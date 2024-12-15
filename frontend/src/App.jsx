import { Route, Routes, Navigate } from "react-router-dom";
import Signin from "@/components/Signin/Signin";
import Register from "@/components/Register/Register";
import PrivateRoute from "@/components/PrivateRoute";
import LazyLoad from "./LazyLoad"; 
import HomePage from "@/pages/Home/Home";
import "./App.css";
import { useSelector } from "react-redux";
import { selectHasVerifiedEmail, selectIsSignedIn } from "./redux/app/app.selectors";
import EmailVerificationNotice from "./components/EmailVerificationNotice/EmailVerificationNotice";
import { useAuth } from "@/hooks/useAuth";
import FullScreenSpinner from "@/components/FullScreenSpinner/FullScreenSpinner";

const Forgot = LazyLoad(() => import("@/components/Forgot/Forgot"));
const RankAndImageFormWrapper = LazyLoad(() => import("@/components/RankAndImageFormWrapper/RankAndImageFormWrapper"));

// env variables prefixed with VITE_ are available in the browser

const AppRoutes = () => {
	const isSignedIn = useSelector(selectIsSignedIn);
	const hasVerifiedEmail = useSelector(selectHasVerifiedEmail);
	const { loading } = useAuth();

	if (loading) {
		return <FullScreenSpinner />;
	}

	return (
		<Routes>
			<Route
				path="/"
				element={<HomePage />}>
				<Route
					index
					element={
						<PrivateRoute
							redirectCondition={isSignedIn}
							redirectPath="/login">
							{!hasVerifiedEmail ? <EmailVerificationNotice /> : <RankAndImageFormWrapper />}
						</PrivateRoute>
					}
				/>
				<Route
					exact
					path="login"
					element={
						<PrivateRoute
							redirectCondition={!isSignedIn}
							redirectPath="/">
							<Signin />
						</PrivateRoute>
					}
				/>	
				<Route
					exact
					path="register"
					element={
						<PrivateRoute
							redirectCondition={!isSignedIn}
							redirectPath="/">
							<Register />
						</PrivateRoute>
					}
				/>
				<Route
					exact
					path="forgot"
					element={
						<PrivateRoute
							redirectCondition={!isSignedIn}
							redirectPath="/">
							<Forgot />
						</PrivateRoute>
					}
				/>
			</Route>
		</Routes>
	);
};

export default AppRoutes;
