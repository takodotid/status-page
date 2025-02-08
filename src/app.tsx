// @refresh reload
import "@/app.css";
import "@/globals";

import { MetaProvider } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Toaster } from "solid-sonner";

export default function App() {
    return (
        <MetaProvider>
            <Router>{FileRoutes()}</Router>
            <Toaster />
        </MetaProvider>
    );
}
