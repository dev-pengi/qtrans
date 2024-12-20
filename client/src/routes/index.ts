import { Router } from "@tanstack/react-router";
import { RootRoute } from "./RootRoute";
import { TranslationsRouteTree } from "./translations";

const routeTree = RootRoute.addChildren([TranslationsRouteTree]);

export const router = new Router({ routeTree });
