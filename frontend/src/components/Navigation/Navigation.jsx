import ProfileIcon from "@/components/Profile/ProfileIcon";
import Logo from "@/components/Logo/Logo";
import { useNavigate } from "react-router-dom";
import "./Navigation.css";
import { useSelector } from "react-redux";
import { selectIsSignedIn } from "@/redux/app/app.selectors";

const Navigation = () => {
	const isSignedIn = useSelector(selectIsSignedIn);

	const navigateTo = useNavigate();

	if (isSignedIn) {
		return (
			<nav className="nav">
				<Logo />
				<div className="gridCol2">
					<ProfileIcon />
				</div>
			</nav>
		);
	} else {
		return (
			<nav className="nav">
				<Logo />
				<div className="divInNav">
					<button
						onClick={() => navigateTo("login")}
						className="customLink">
						Sign In
					</button>
					<button
						onClick={() => navigateTo("register")}
						className="customLink">
						Register
					</button>
				</div>
			</nav>
		);
	}
};

export default Navigation;
