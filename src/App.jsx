import { StoreProvider } from "./store.jsx";
import { useRoute } from "./router.jsx";
import Layout from "./components/Layout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import NewEvent from "./pages/NewEvent.jsx";
import EventDetails from "./pages/EventDetails.jsx";
import Automation from "./pages/Automation.jsx";
import Analytics from "./pages/Analytics.jsx";
import Reports from "./pages/Reports.jsx";

function Page({ path }) {
  const [, seg, id] = path.split("/");
  if (seg === "new") return <NewEvent />;
  if (seg === "event") return <EventDetails id={id} />;
  if (seg === "automation") return <Automation />;
  if (seg === "analytics") return <Analytics />;
  if (seg === "reports") return <Reports />;
  return <Dashboard />;
}

export default function App() {
  const path = useRoute();
  return (
    <StoreProvider>
      <Layout path={path}><Page path={path} /></Layout>
    </StoreProvider>
  );
}
