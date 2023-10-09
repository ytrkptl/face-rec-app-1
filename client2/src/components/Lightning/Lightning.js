import React, { createRef, useEffect } from 'react'
import LightningModal from '../LightningModal/LightningModal';
import ThunderSound from './thunder4.mp3';
import './Lightning.css';

const Lightning = ({lightningOn}) => {
  const audioRef = createRef();
  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    if (lightningOn) {
      audioRef.current.autoplay = true;
      audioRef.current.loop = true;
    } else {
      audioRef.current.autoplay = false;
      audioRef.current.loop = false;
    }
  });

  return (
    <LightningModal>
      <div className="lightning-modal lightning flashit" />
      <audio
        ref={audioRef}
        src={ThunderSound}
      />
    </LightningModal>
  );
}

export default Lightning;
