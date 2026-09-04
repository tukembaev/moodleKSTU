import { Layout } from "widgets/Layout";

import { AppRouter } from "./providers/router";
import { ThemeProvider } from "./providers/ThemeProvider/ThemeProvider";
import { SessionBootstrap } from "./providers/SessionBootstrap";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <SessionBootstrap>
        <div className="h-dvh w-full">
          <Layout>
            <AppRouter />
          </Layout>
        </div>
      </SessionBootstrap>
    </ThemeProvider>
  );
}

export default App;
