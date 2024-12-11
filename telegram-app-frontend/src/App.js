import "./App.css";
import { HashRouter, Route, Switch } from "react-router-dom";
import { CoreLayout, DefaultLayout } from "./layouts";
import Platform from "./pages/start/platform";
import HomePage from "./pages/home";
import Mission from "./pages/mission";
import Referral from "./pages/referral";
import Wallet from "./pages/wallet";

// Component to render a route with a layout
const RouteWithLayout = ({ layout: Layout, component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => (
        <Layout>
          <Component {...props} />
        </Layout>
      )}
    />
  );
};

function App() {
  return (
    <HashRouter>
      <Switch>
        <RouteWithLayout
          exact
          path="/platform"
          layout={DefaultLayout}
          component={Platform}
        />
        <RouteWithLayout
          exact
          path="/"
          layout={CoreLayout}
          component={HomePage}
        />
        <RouteWithLayout
          exact
          path="/mission"
          layout={CoreLayout}
          component={Mission}
        />
        <RouteWithLayout
          exact
          path="/referral"
          layout={CoreLayout}
          component={Referral}
        />
        <RouteWithLayout
          exact
          path="/wallet"
          layout={CoreLayout}
          component={Wallet}
        />
      </Switch>
    </HashRouter>
  );
}

export default App;
