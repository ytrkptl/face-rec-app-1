import { Outlet } from "react-router-dom";
import { RemoveScroll } from "react-remove-scroll";
import ParticlesComponent from "@/components/Particles/Particles";
import Navigation from "@/components/Navigation/Navigation";
import Profile from "@/components/Profile/Profile";
import Modal from "@/components/Modal/Modal";
import Footer from "@/components/Footer/Footer";
import Lightning from "@/components/Lightning/Lightning";
import "./Home.css";
import { useSelector } from "react-redux";
import { selectIsLightningOn, selectIsProfileOpen } from "@/redux/app/app.selectors";

function Home() {
	const isProfileOpen = useSelector(selectIsProfileOpen);
	const isLightningOn = useSelector(selectIsLightningOn);

	return (
		<div className="App">
			{isLightningOn && (
				<>
					<ParticlesComponent />
					<Lightning />
				</>
			)}
			<Navigation className="row1" />
			{isProfileOpen && (
				<Modal>
					<RemoveScroll>
						<Profile />
					</RemoveScroll>
				</Modal>
			)}
			<div className="row2">
				<Outlet />
			</div>
			<Footer className="row3" />
		</div>
	);
}

export default Home;
