import React from "react";
import ProfileIcon from "../Profile/ProfileIcon";
import Logo from "../Logo/Logo";
import "./Navigation.css";
import { useHistory } from "react-router-dom";

const Navigation = ({
  isSignedIn,
  toggleModal,
  profilePhotoUrl,
  showLightning,
  signOut,
}) => {
  const history = useHistory();

  if (isSignedIn) {
    return (
      <nav className="nav">
        <Logo showLightning={showLightning} />
        <div className="gridCol2">
          <ProfileIcon
            profilePhotoUrl={profilePhotoUrl}
            toggleModal={toggleModal}
            signOut={signOut}
          />
        </div>
      </nav>
    );
  } else {
    return (
      <nav className="nav">
        <Logo showLightning={showLightning} />
        <div className="divInNav">
          <button onClick={() => history.push("signin")} className="customLink">
            Sign In
          </button>
          <button
            onClick={() => history.push("register")}
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
