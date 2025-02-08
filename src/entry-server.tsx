// @refresh reload
import { CONFIGS } from "./constants";

import { createHandler, StartServer } from "@solidjs/start/server";
import { Show } from "solid-js";

export default createHandler(() => (
    <StartServer
        document={({ assets, children, scripts }) => (
            <html lang="en">
                <head>
                    <meta charset="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <meta name="robots" content="index, follow" />

                    <meta name="color-scheme" content="dark" />
                    <meta property="og:type" content="website" />
                    <meta name="application-name" content="Tako" />
                    <meta name="og:site_name" content="Tako" />

                    <link rel="icon" href="/favicon.png" />

                    {assets}
                </head>
                <body>
                    <div id="app">{children}</div>

                    {scripts}

                    {/* Google tag (gtag.js) [Google Analytics 4] */}
                    <Show when={CONFIGS.GA4_ID}>
                        <script async src={`https://www.googletagmanager.com/gtag/js?id=${CONFIGS.GA4_ID}`} />

                        <script>
                            {`
                                window.dataLayer = window.dataLayer || [];

                                function gtag() { 
                                    dataLayer.push(arguments); 
                                }

                                gtag('js', new Date());
                                gtag('config', '${CONFIGS.GA4_ID}');
                            `}
                        </script>
                    </Show>
                </body>
            </html>
        )}
    />
));
