import { z } from "zod";

export const listHealthChecksResponseSchema = z.object({
    success: z.boolean(),
    errors: z.array(
        z.object({
            code: z.number(),
            message: z.string(),
        })
    ),
    messages: z.array(
        z.object({
            code: z.number(),
            message: z.string(),
        })
    ),
    result: z.array(
        z.object({
            id: z.string(),
            name: z.string(),
            description: z.string().nullish(),
            status: z.enum(["unknown", "healthy", "unhealthy", "suspended"]),
            failure_reason: z.string().nullish(),
            interval: z.number(),
            suspended: z.boolean(),
            type: z.enum(["HTTP", "HTTPS", "TCP"]),
        })
    ),
});

export const queryHealthCheckResponseSchema = z
    .object({
        data: z
            .object({
                viewer: z.object({
                    zones: z.array(
                        z.object({
                            healthCheckEventsAdaptiveGroups: z.array(
                                z.object({
                                    avg: z.object({
                                        rttMs: z.number(),
                                        sampleInterval: z.number(),
                                    }),
                                    dimensions: z.object({
                                        healthCheckId: z.string(),
                                        healthCheckName: z.string(),
                                        ts: z.string().refine((ts) => new Date(ts).toString() !== "Invalid Date"),
                                    }),
                                })
                            ),
                        })
                    ),
                }),
            })
            .nullish(),
        errors: z
            .array(
                z.object({
                    message: z.string(),
                })
            )
            .nullish(),
    })
    .transform((data) => {
        if (data.errors) {
            return {
                data: [],
                errors: data.errors,
            };
        }

        return {
            data: data.data?.viewer.zones[0].healthCheckEventsAdaptiveGroups ?? [],
            errors: [],
        };
    });

export const healthCheckHistorySchema = z.object({
    data: listHealthChecksResponseSchema.shape.result.element
        .and(
            z.object({
                histories: queryHealthCheckResponseSchema.innerType().shape.data.unwrap().unwrap().shape.viewer.shape.zones.element.shape.healthCheckEventsAdaptiveGroups,
            })
        )
        .array(),
    timestamp: z.string().refine((ts) => new Date(ts).toString() !== "Invalid Date"),
});
