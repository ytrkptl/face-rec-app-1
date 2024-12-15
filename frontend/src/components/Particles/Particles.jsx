import { selectIsLightningOn } from "@/redux/app/app.selectors";
import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const ParticlesComponent = () => {
	const isLightningOn = useSelector(selectIsLightningOn);
	const [init, setInit] = useState(false);

	// this should be run only once per application lifetime
	useEffect(() => {
		if (init) {
			//console.log("Particles already initialized");
			return;
		}

		//console.log("Initializing particles...");
		initParticlesEngine(async (engine) => {
			// you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
			// this loads the tsparticles package bundle, it's the easiest method for getting everything ready
			// starting from v2 you can add only the features you need reducing the bundle size
			//await loadAll(engine);
			//await loadFull(engine);
			try {
				//console.log("Loading full tsParticles engine...");
				// await loadImageShape(engine, true);
				await loadSlim(engine);
				//console.log("Successfully loaded tsParticles engine");
			} catch (error) {
				//console.error("Error loading tsParticles:", error);
			}
		})
			.then(() => {
				setInit(true);
				//console.log("Particles initialization complete");
			})
			.catch((error) => {
				//console.error("Failed to initialize particles engine:", error);
			});
	}, [init]);

	const particlesOptions = {
		particles: {
			number: {
				value: 24,
				density: {
					enable: true,
					area: 240
				}
			},
			shape: {
				type: "images",
				options: {
					images: {
						src: "https://res.cloudinary.com/dun1b4fpw/image/upload/c_scale,f_auto,q_auto,w_32/v1580263176/face-rec-app-1/droplet.png"
					}
				}
			},
			size: {
				value: 4.011985930952697
			},
			line_linked: {
				enable: false
			},
			move: {
				enable: true,
				speed: 6,
				direction: "bottom",
				straight: true,
				out_mode: "out"
			}
		}
	};

	const particlesLoaded = useCallback(async (container) => {
		// await console.log(container);
	}, []);

	return (
		isLightningOn &&
		init && (
			<Particles
				className="particles"
				id="tsparticles"
				particlesLoaded={particlesLoaded}
				options={particlesOptions}
			/>
		)
	);
};

export default ParticlesComponent;
