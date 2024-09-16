import ProfileIcon from "@/components/Profile/ProfileIcon";
import Logo from "@/components/Logo/Logo";
import { useNavigate } from "react-router-dom";
import "./Navigation.css";

const Navigation = ({ isSignedIn, toggleModal, profilePhotoUrl, showLightning, signOut }) => {
  const navigateTo = useNavigate();

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
          <button
            onClick={() => navigateTo("signin")}
            className="customLink">
            Sign In
          </button>
          <button
            onClick={() => navigateTo("register")}
            className="customLink">
            Register
          </button>
        </div>
      </nav>
    );
  }
};

export default Navigation;
