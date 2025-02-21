import { Layout } from "widgets/Layout";
import { AppRouter } from "./providers/router";
function App() {
  return (
    <div>
      <Layout>
        <AppRouter />
      </Layout>
    </div>
  );
}

export default App;
