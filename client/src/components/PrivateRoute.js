import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ isSignedIn, children, redirectPath = "/signin" }) => {
  if (!isSignedIn) {
    return <Navigate to={redirectPath} />;
  }

  return children ? children : <Outlet />;
};

export default PrivateRoute;
