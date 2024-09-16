// import CheckAuth from "@/components/CheckAuth/CheckAuth";
import { Fragment } from "react/jsx-runtime";
import RouteWithRedirect from "@/components/RouteWithRedirect";

const PrivateRoute = ({ isSignedIn, redirectPath, children }) => {
  return (
    <Fragment>
      {/* <CheckAuth /> */}
      <RouteWithRedirect
        isSignedIn={isSignedIn}
        redirectPath={redirectPath}>
        {children}
      </RouteWithRedirect>
    </Fragment>
  );
};

export default PrivateRoute;
