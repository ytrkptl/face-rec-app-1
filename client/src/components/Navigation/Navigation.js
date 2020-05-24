import React from "react";
import ProfileIcon from "../Profile/ProfileIcon";
import Logo from "../Logo/Logo";
import "./Navigation.css";

const Navigation = ({
  onRouteChange,
  isSignedIn,
  toggleModal,
  profilePhotoUrl,
  showLightning,
}) => {
  if (isSignedIn) {
    return (
      <nav className="nav">
        <Logo showLightning={showLightning} />
        <div className="gridCol2">
          <ProfileIcon
            profilePhotoUrl={profilePhotoUrl}
            onRouteChange={onRouteChange}
            toggleModal={toggleModal}
          />
        </div>
      </nav>
    );
  } else {
    return (
      <nav className="nav">
        <Logo showLightning={showLightning} />
        <div className="divInNav">
          <button
            onClick={() => onRouteChange("signin")}
            className="customLink"
          >
            Sign In
          </button>
          <button
            onClick={() => onRouteChange("register")}
            className="customLink"
          >
            Register
          </button>
        </div>
      </nav>
    );
  }
};

export default Navigation;
