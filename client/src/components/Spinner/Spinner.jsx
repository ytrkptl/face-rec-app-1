import { useState, useEffect } from "react";
import "./Spinner.css";

const Spinner = ({ showSpinner }) => {
  let [displayIt, changeDisplayIt] = useState("none");

  useEffect(() => {
    if (showSpinner) {
      changeDisplayIt("flex");
    } else {
      changeDisplayIt("none");
    }
    return () => {
      changeDisplayIt("none");
    };
  }, [showSpinner, displayIt, changeDisplayIt]);

  return (
    <div
      className="spinnerOverlay"
      style={{ display: `${displayIt}` }}>
      <div className="spinnerContainer" />
    </div>
  );
};

export default Spinner;
