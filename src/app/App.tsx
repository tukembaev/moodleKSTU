import { Layout } from "widgets/Layout";

import { AppRouter } from "./providers/router";
import { ThemeProvider } from "./providers/ThemeProvider/ThemeProvider";
import { SessionBootstrap } from "./providers/SessionBootstrap";
import { HiddenIdSync } from "./providers/HiddenIdSync";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <SessionBootstrap>
        <HiddenIdSync>
          <div className="h-dvh w-full">
            <Layout>
              <AppRouter />
            </Layout>
          </div>
        </HiddenIdSync>
      </SessionBootstrap>
    </ThemeProvider>
  );
}

export default App;
