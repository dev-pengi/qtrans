import { Router } from "@tanstack/react-router";
import { RootRoute } from "./RootRoute";

const routeTree = RootRoute.addChildren([]);

export const router = new Router({ routeTree });
