import CheckAuth from "@/components/CheckAuth/CheckAuth";
import { Fragment } from "react/jsx-runtime";
import RouteWithRedirect from "@/components/RouteWithRedirect";

const PrivateRoute = ({ redirectCondition, redirectPath, children }) => {

	// NOTE: Avoid using the isSignedIn selector here

	return (
		<Fragment>
			<CheckAuth />
			<RouteWithRedirect
				redirectCondition={redirectCondition}
				redirectPath={redirectPath}>
				{children}
			</RouteWithRedirect>
		</Fragment>
	);
};

export default PrivateRoute;
