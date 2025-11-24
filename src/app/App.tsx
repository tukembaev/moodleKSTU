import { Layout } from "widgets/Layout";

import { AppRouter } from "./providers/router";
import { ThemeProvider } from "./providers/ThemeProvider/ThemeProvider";
function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="w-full ">
        <Layout>
          <AppRouter />
        </Layout>
      </div>
    </ThemeProvider>
  );
}

export default App;
