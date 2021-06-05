import React from 'react';
import Particles from 'react-particles-js';

const ParticlesComponent = ({ lightningOn }) => {

  let particlesOptions = {
    particles: {
      number: {
        value: 24,
        density: {
          enable: true,
          value_area: 240.35957792858096
        }
      },
      shape: {
        type: "image",
        image: {
          src: `https://res.cloudinary.com/dun1b4fpw/image/upload/s--xuSqPQTh--/c_scale,f_auto,q_auto,w_32/v1580263176/face-rec-app-1/droplet.png`,
        }
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
      }
    },
  }
  return (
    lightningOn === true &&
    <Particles className='particles'
      params={particlesOptions}
    />
  )
}

export default ParticlesComponent;

