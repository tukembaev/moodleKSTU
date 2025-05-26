import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";

import { BrowserRouter } from "react-router-dom";

import { QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "app/providers/ErrorBoundary/ErrorBoundary/index.ts";
import "app/styles/global.css";
import { queryClient } from "shared/api/queryClient.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
