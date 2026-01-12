import { Layout } from "widgets/Layout";

import { AppRouter } from "./providers/router";
import { ThemeProvider } from "./providers/ThemeProvider/ThemeProvider";
// import { PWAInstallBanner } from "features/PWAInstallBanner/PWAInstallBanner";
function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="w-full ">
        <Layout>
          <AppRouter />
        </Layout>
        {/* <PWAInstallBanner /> */}
      </div>
    </ThemeProvider>
  );
}

export default App;
