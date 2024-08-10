import { useState, useEffect } from "react";
import { Tilt } from "react-tilt";
import LogoImg from "./thunderstorm4.png";
import "./Logo.css";

// Source: https://usehooks.com/useWindowSize/
function useWindowSize() {
  const isClient = typeof window === "object";

  function getSize() {
    return {
      width: isClient ? window.innerWidth : undefined,
      height: isClient ? window.innerHeight : undefined,
    };
  }

  const [windowSize, setWindowSize] = useState(getSize);

  useEffect(() => {
    if (!isClient) {
      return false;
    }

    function handleResize() {
      setWindowSize(getSize());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return windowSize;
}

const Logo = ({ showLightning }) => {
  let [device, changeDevice] = useState("laptop");

  const size = useWindowSize();
  useEffect(() => {
    if (size.width <= 800) {
      changeDevice("tablet");
    } else {
      changeDevice("laptop");
    }
  }, [size]);

  return (
    <div className="TiltParentDiv">
      {device === "laptop" ? (
        <Tilt className="Tilt" options={{ max: 55 }}>
          <div className="Tilt-inner" onClick={() => showLightning()}>
            <img className="logoImg" src={LogoImg} alt="thunder" />
            <span className="logoText">Click me to toggle rain.</span>
          </div>
        </Tilt>
      ) : (
        <div className="Tilt">
          <div className="Tilt-inner" onClick={() => showLightning()}>
            <img className="logoImg" src={LogoImg} alt="thunder" />
            <span className="logoText">Click me to toggle rain.</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Logo;
