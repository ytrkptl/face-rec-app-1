import { useState, useEffect } from "react";
import { Tilt } from "react-tilt";
import LogoImg from "./thunderstorm4.png";
import "./Logo.css";
import { updateLightningOn } from "@/redux/app/app.actions";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useDispatch, useSelector } from "react-redux";
import { selectIsLightningOn } from "@/redux/app/app.selectors";

const Logo = () => {
	const [device, changeDevice] = useState("laptop");
	const dispatch = useDispatch();

	const isLightningOn = useSelector(selectIsLightningOn);

	const size = useWindowSize();
	useEffect(() => {
		if (size.width <= 800) {
			changeDevice("tablet");
		} else {
			changeDevice("laptop");
		}
	}, [size]);

	const toggleLightning = () => {
		dispatch(updateLightningOn(!isLightningOn));
	};

	return (
		<div className="TiltParentDiv">
			{device === "laptop" ? (
				<Tilt
					className="Tilt"
					options={{ max: 55 }}>
					<div
						className="Tilt-inner"
						onClick={() => toggleLightning()}>
						<img
							className="logoImg"
							src={LogoImg}
							alt="thunder"
						/>
						<span className="logoText">Click me to toggle rain.</span>
					</div>
				</Tilt>
			) : (
				<div className="Tilt">
					<div
						className="Tilt-inner"
						onClick={() => toggleLightning()}>
						<img
							className="logoImg"
							src={LogoImg}
							alt="thunder"
						/>
						<span className="logoText">Click me to toggle rain.</span>
					</div>
				</div>
			)}
		</div>
	);
};

export default Logo;
