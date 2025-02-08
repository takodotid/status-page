import "chartjs-adapter-date-fns";

import type { DynamicProps } from "solid-js/web";
import type { z } from "zod";

import { Chart, LinearScale, LineController, LineElement, PointElement, TimeScale, Tooltip } from "chart.js";
import { createSignal, For, onCleanup, onMount } from "solid-js";
import { toast } from "solid-sonner";

import { API_ROUTES, CONFIGS, LOCAL_STORAGE_KEYS } from "@/constants";
import { queryHealthCheckResponseSchema, listHealthChecksResponseSchema, healthCheckHistorySchema } from "@/schemas";

type MetricsProps = Omit<DynamicProps<"canvas">, "component"> & {
    datasets: z.infer<typeof healthCheckHistorySchema>["data"][0]["histories"];
};

const Metrics = (props: MetricsProps) => {
    let canvas!: HTMLCanvasElement;

    onMount(() => {
        const sortedData = [...props.datasets].sort((a, b) => new Date(a.dimensions.ts).getTime() - new Date(b.dimensions.ts).getTime());

        Chart.register(TimeScale, LinearScale, LineController, LineElement, PointElement, Tooltip);

        const chart = new Chart(canvas.getContext("2d")!, {
            type: "line",
            data: {
                labels: sortedData.map((data) => new Date(data.dimensions.ts)),
                datasets: [
                    {
                        label: "Response Time (ms)",
                        data: sortedData.map((data) => data.avg.rttMs),
                        borderColor: "rgb(75, 192, 192)",
                        tension: 0.1,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: "time",
                        time: {
                            unit: "minute",
                            displayFormats: {
                                minute: "HH:mm",
                            },
                        },
                        title: {
                            display: false,
                            text: "Time",
                            font: {
                                family: "var(--font-nunito)",
                            },
                        },
                        stack: "auto",
                        ticks: {
                            autoSkip: true,
                            maxRotation: 0,
                            font: {
                                family: "Nunito",
                            },
                        },
                    },
                    y: {
                        title: {
                            display: false,
                            text: "Response Time (ms)",
                            align: "end",
                        },
                        ticks: {
                            maxRotation: 0,
                            font: {
                                family: "Nunito",
                            },
                            callback(tickValue) {
                                return `${tickValue}ms`;
                            },
                        },
                    },
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const dataIndex = context.dataIndex;
                                const data = sortedData[dataIndex];
                                return `Response Time: ${data.avg.rttMs}ms`;
                            },
                        },
                        bodyFont: {
                            family: "Nunito",
                        },
                        titleFont: {
                            family: "Nunito",
                        },
                    },
                },
            },
        });

        onCleanup(() => {
            chart.destroy();
        });
    });

    return <canvas ref={canvas} {...props} />;
};

export default function Home() {
    const [healthChecks, setHealthChecks] = createSignal<z.infer<typeof healthCheckHistorySchema>>();

    const getHealthChecks = async () => {
        try {
            const historyData = localStorage.getItem(LOCAL_STORAGE_KEYS.HEALTHCHECKS_HISTORY);

            if (historyData) {
                const parsed = healthCheckHistorySchema.parse(JSON.parse(historyData));

                // If the data is less than 5 minutes old, use it
                if (new Date().getTime() - new Date(parsed.timestamp).getTime() <= 1000 * 60 * 5) {
                    setHealthChecks(parsed);
                    return;
                }
            }
        } catch (error) {
            // If there's an error parsing the data, ignore it
            // Fetch the data from the API instead
        }

        try {
            // ------------------------------------------------
            // [1]  List all available health checks
            // ------------------------------------------------
            const listHeathChecksResponse = await fetch(API_ROUTES.LIST_HEALTH_CHECKS, {
                headers: {
                    Authorization: `Bearer ${CONFIGS.CF_API_TOKEN.READ_HEALTH_CHECKS}`,
                    "Content-Type": "application/json",
                },
            });

            if (!listHeathChecksResponse.ok) {
                throw new Error("Failed to Get List of Health Checks");
            }

            const listHeathChecksResult = listHealthChecksResponseSchema.parse(await listHeathChecksResponse.json());

            // ------------------------------------------------
            // [2]  Get the metrics for each health check
            //      Fetch all metrics then group them by health check ID after fetching
            // ------------------------------------------------
            const queryHealthCheckAnalyticsResponse = await fetch(API_ROUTES.GRAPHQL_QUERY, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${CONFIGS.CF_API_TOKEN.QUERY_GRAPHQL}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query: "query testingTimeseries($zoneTag: string, $filter: object) { viewer { zones(filter: {zoneTag: $zoneTag}) { healthCheckEventsAdaptiveGroups(limit: 10000, filter: $filter, orderBy: [datetimeFifteenMinutes_ASC, healthCheckName_ASC]) { avg { rttMs sampleInterval } dimensions { ts: datetimeFifteenMinutes healthCheckName healthCheckId } } } }}",
                    variables: {
                        zoneTag: CONFIGS.CF_ZONE_ID,
                        filter: {
                            datetime_geq: new Date(new Date().getTime() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
                            datetime_leq: new Date().toISOString(),
                        },
                    },
                }),
            });

            if (!queryHealthCheckAnalyticsResponse.ok) {
                throw new Error("Failed to Query Health Check Analytics");
            }

            const queryHealthCheckAnalyticsResult = queryHealthCheckResponseSchema.parse(await queryHealthCheckAnalyticsResponse.json());

            // ------------------------------------------------
            // [3]  Combine the health checks with their metrics
            // ------------------------------------------------
            const healthChecks = healthCheckHistorySchema.parse({
                data: listHeathChecksResult.result.map((healthCheck) => {
                    const histories = queryHealthCheckAnalyticsResult.data?.filter((history) => history.dimensions.healthCheckId === healthCheck.id);

                    return {
                        ...healthCheck,
                        histories: histories ?? [],
                    };
                }),
                timestamp: new Date().toISOString(),
            } satisfies typeof healthCheckHistorySchema._input);

            setHealthChecks(healthChecks);
            localStorage.setItem(LOCAL_STORAGE_KEYS.HEALTHCHECKS_HISTORY, JSON.stringify(healthChecks));
        } catch (error) {
            console.error(error);
            toast.error("Failed to Get Data");
        }
    };

    onMount(() => {
        getHealthChecks();

        const interval = setInterval(getHealthChecks, 1000 * 60 * 5); // 5 minutes

        onCleanup(() => {
            clearInterval(interval);
        });
    });

    return (
        <main class="relative flex min-h-dvh flex-col items-center gap-14 bg-black px-3 pt-12">
            <img src={"/images/logo.png"} alt="Tako" loading="lazy" class="h-8 hoverable" />

            <h1 class="ts-h2 font-bold text-green-primary">All System Operational</h1>

            <For each={healthChecks()?.data}>
                {({ id, name, status, histories }) => {
                    const avgRttMs = histories.reduce((acc, curr) => acc + curr.avg.rttMs, 0) / histories.length;

                    return (
                        <div data-id={id} class="container grid w-full gap-3 rounded-xl border border-grayscale-50 bg-grayscale-40 py-4 shadow-trail shadow-grayscale-50">
                            <section class="flex items-center justify-between px-4">
                                <div class="flex flex-col">
                                    <p class="ts-lg font-bold">{name}</p>
                                    <span class="ts-sm font-medium capitalize text-green-primary">{status}</span>
                                </div>

                                <p class="ts-base font-bold">{avgRttMs.toFixed(0)}ms</p>
                            </section>

                            <section class="w-full overflow-hidden px-4">
                                <Metrics datasets={histories} class="!h-28 w-full" />
                            </section>
                        </div>
                    );
                }}
            </For>
        </main>
    );
}
