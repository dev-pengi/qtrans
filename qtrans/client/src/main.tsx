import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./index.css";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "src/routes/index";
import { FC } from "react";
import { ErrorPage, NotFound } from "src/components";
import { SettingsContextProvider } from "./contexts";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: true,
    },
  },
});

const AppWrapper: FC = () => {
  return (
    <>
      <Toaster position={"bottom-right"} />
      <RouterProvider
        router={router}
        notFoundMode="root"
        defaultNotFoundComponent={NotFound}
        defaultErrorComponent={ErrorPage}
      />
    </>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <SettingsContextProvider>
      <AppWrapper />
    </SettingsContextProvider>
  </QueryClientProvider>
);
