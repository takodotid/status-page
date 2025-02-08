import { useNavigate } from "@solidjs/router";
import { onMount } from "solid-js";

import { ROUTES } from "@/constants";

export default function NotFound() {
    const navigate = useNavigate();

    onMount(() => {
        navigate(ROUTES.HOME, { replace: true });
    });

    return null;
}
