import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
// import { selectUserSignInStatus } from "@/redux/user/user.selectors.js";
// import { useSelector } from "react-redux";

/**
 * Redirects to a given path if the user is not signed in. Almost identical to
 * a protected route but is capable of redirecting to a given path.
 * Source: https://www.robinwieruch.de/react-router-private-routes/
 */
const RouteWithRedirect = ({ isSignedIn, redirectPath, children }) => {
  // const isSignedIn = useSelector(selectUserSignInStatus);

  useEffect(() => {
    console.log("bob");
  }, []);

  if (!isSignedIn) {
    return <Navigate to={redirectPath} />;
  }

  return children ? children : <Outlet />;
};

export default RouteWithRedirect;
