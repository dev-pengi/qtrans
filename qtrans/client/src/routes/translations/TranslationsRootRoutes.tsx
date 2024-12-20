import { createRoute } from "@tanstack/react-router";
import { RootRoute } from "../RootRoute";
import TranslationsPage from "src/app/translations/pages/TranslationsPage";

export const TranslationsRootRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/",
  component: TranslationsPage,
});
