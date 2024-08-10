import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const ParticlesComponent = ({ lightningOn }) => {
  let particlesOptions = {
    particles: {
      number: {
        value: 24,
        density: {
          enable: true,
          value_area: 240.35957792858096,
        },
      },
      shape: {
        type: "image",
        image: {
          src: `https://res.cloudinary.com/dun1b4fpw/image/upload/s--xuSqPQTh--/c_scale,f_auto,q_auto,w_32/v1580263176/face-rec-app-1/droplet.png`,
        },
      },
      size: {
        value: 4.011985930952697,
      },
      line_linked: {
        enable: false,
      },
      move: {
        enable: true,
        speed: 4,
        direction: "bottom",
        straight: true,
        out_mode: "out",
      },
    },
  };

  const particlesInit = useCallback(async (engine) => {
    // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    // await console.log(container);
  }, []);

  return (
    lightningOn === true && (
      <Particles
        className="particles"
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={particlesOptions}
      />
    )
  );
};

export default ParticlesComponent;
