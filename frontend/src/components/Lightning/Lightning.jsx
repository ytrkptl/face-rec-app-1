import React, { useRef, useEffect } from "react";
import LightningModal from "../LightningModal/LightningModal";
import ThunderSound from "./thunder4.mp3";
import "./Lightning.css";
import { useSelector } from "react-redux";
import { selectIsLightningOn } from "@/redux/app/app.selectors";

const Lightning = () => {
	const isLightningOn = useSelector(selectIsLightningOn);
	const audioRef = useRef(null);

	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		if (isLightningOn) {
			audio.loop = true;
			// Try to play and handle any errors
			const playPromise = audio.play();
			if (playPromise !== undefined) {
				playPromise.catch((error) => {
					//console.error("Audio playback failed:", error);
				});
			}
		} else {
			audio.pause();
			audio.currentTime = 0;
		}

		// Cleanup function
		return () => {
			audio.pause();
			audio.currentTime = 0;
		};
	}, [isLightningOn]);

	return (
		<LightningModal>
			<div className="lightning-modal lightning flashit" />
			<audio
				ref={audioRef}
				src={ThunderSound}
				preload="auto"
			/>
		</LightningModal>
	);
};

export default Lightning;
