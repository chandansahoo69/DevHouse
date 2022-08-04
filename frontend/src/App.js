import "./App.css";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import Home from "./pages/Home/Home";
import Naviagation from "./components/shared/Navigation/Naviagation";
import Authenticate from "./pages/Authenticate/Authenticate";
import Activate from "./pages/Activate/Activate";
import Rooms from "./pages/Rooms/Rooms";
import Room from "./pages/Room/Room";
import { useSelector } from "react-redux";
import { useLoading } from "./hooks/useLoading";
import Loader from "./components/shared/Loader/Loader";
import Clubs from "./pages/Clubs/Clubs";
import People from "./pages/People/People";
import TabNavigation from "./components/shared/TabNavigation/TabNavigation";
import Profile from "./pages/ProfilePage/Profile";
import Club from "./pages/Club/Club";
import Followers from "./pages/Followers/Followers";
import Following from "./pages/Following/Following";
import PageNotFound from "./pages/PageNotFound/PageNotFound";
import SingleClubRoom from "./pages/Club/SingleClubRoom";

function App() {
  //get the loading state
  const { loading } = useLoading();

  return loading ? (
    <Loader message="Loading, Please wait" />
  ) : (
    <>
      <BrowserRouter>
        <Naviagation />
        <Switch>
          //if the user is not logged in then show the home page else the
          redirect to room page this is a private route to check the user is
          logged in or not
          <GuestRoute path="/" exact>
            <Home />
          </GuestRoute>
          <GuestRoute path="/authenticate" exact>
            <Authenticate />
          </GuestRoute>
          <SemiProtectedRoute path="/activate" exact>
            <Activate />
          </SemiProtectedRoute>
          <ProtectedRoute path="/rooms" exact>
            <TabNavigation />
            <Rooms />
          </ProtectedRoute>
          <ProtectedRoute path="/clubs" exact>
            <TabNavigation />
            <Clubs />
          </ProtectedRoute>
          <ProtectedRoute path="/people" exact>
            <TabNavigation />
            <People />
          </ProtectedRoute>
          <ProtectedRoute path="/room/:id" exact>
            <Room />
          </ProtectedRoute>
          <ProtectedRoute path="/user/:id" exact>
            <Profile />
          </ProtectedRoute>
          <ProtectedRoute path="/user/:id/getAllFollowers" exact>
            <Followers />
          </ProtectedRoute>
          <ProtectedRoute path="/user/:id/getAllFollowing" exact>
            <Following />
          </ProtectedRoute>
          <ProtectedRoute path="/club/:id" exact>
            <Club />
          </ProtectedRoute>
          <ProtectedRoute path="/404">
            <PageNotFound />
          </ProtectedRoute>
          <ProtectedRoute path="/club/:clubId/room/:roomId" exact>
            <SingleClubRoom />
          </ProtectedRoute>
          {/* <Redirect to="/404" /> */}
        </Switch>
      </BrowserRouter>
    </>
  );
}

const GuestRoute = ({ children, ...rest }) => {
  const { isAuth } = useSelector((state) => state.auth);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuth ? (
          <Redirect
            to={{
              pathname: "/rooms",
              state: { from: location },
            }}
          />
        ) : (
          children
        )
      }
    ></Route>
  );
};

const SemiProtectedRoute = ({ children, ...rest }) => {
  const { user, isAuth } = useSelector((state) => state.auth);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        !isAuth ? (
          <Redirect
            to={{
              pathname: "/",
              state: { from: location },
            }}
          />
        ) : isAuth && user && !user.activated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/rooms",
              state: { from: location },
            }}
          />
        )
      }
    ></Route>
  );
};

const ProtectedRoute = ({ children, ...rest }) => {
  const { user, isAuth } = useSelector((state) => state.auth);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        !isAuth ? (
          <Redirect
            to={{
              pathname: "/",
              state: { from: location },
            }}
          />
        ) : isAuth && user && !user.activated ? (
          <Redirect
            to={{
              pathname: "/activate",
              state: { from: location },
            }}
          />
        ) : (
          children
        )
      }
    ></Route>
  );
};

export default App;
