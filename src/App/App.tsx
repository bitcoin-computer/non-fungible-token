import { ChakraProvider } from "@chakra-ui/react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import NavBar from "../components/Navbar";
import PageRoutes from "../constants/PageRoutes";
import { isUserLoggedIn } from "../helpers/AuthHelpers";
import Host from "../pages/Host";
import JoinRoom from "../pages/JoinRoom";
import Login from "../pages/Login";
import MyCollections from "../pages/MyCollections";
import Player from "../pages/Player";

function App() {
  const isLoggedIn = isUserLoggedIn();

  return (
    <ChakraProvider>
      <Router>
        <Switch>
          <Route exact path={PageRoutes.ROOT}>
            <Redirect to={isLoggedIn ? PageRoutes.HOST : PageRoutes.LOGIN} />
          </Route>
          <Route path={PageRoutes.LOGIN} render={() => <Login />} />
          <NavBar>
            <Route path={PageRoutes.JOIN_ROOM}>
              <JoinRoom />
            </Route>
            <Route path={`${PageRoutes.PLAYER}/:roomId`}>
              <Player />
            </Route>
            <Route path={PageRoutes.HOST}>
              <Host />
            </Route>
            <Route
              path={PageRoutes.MY_COLLECTIONS}
              render={() => <MyCollections />}
            />
          </NavBar>
        </Switch>
      </Router>
    </ChakraProvider>
  );
}

export default App;
