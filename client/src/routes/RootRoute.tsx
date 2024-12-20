import { createRootRoute } from "@tanstack/react-router";
import App from "src/App";

export const RootRoute = createRootRoute({
  component: () => <App />,
});
