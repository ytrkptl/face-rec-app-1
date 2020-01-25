import React from 'react';
import Particles from 'react-particles-js';
import Drop from './droplet.jpg';

const ParticlesComponent = ({lightningOn}) =>  {
  
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
          src: `${Drop}`,
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
    lightningOn===true &&
    <Particles className='particles'
      params={particlesOptions}
    />
  )
}

export default ParticlesComponent;

