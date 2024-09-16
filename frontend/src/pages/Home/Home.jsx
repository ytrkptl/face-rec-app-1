import { Outlet } from "react-router-dom";
import { RemoveScroll } from "react-remove-scroll";
import ParticlesComponent from "@/components/Particles/Particles";
import Navigation from "@/components/Navigation/Navigation";
import Profile from "@/components/Profile/Profile";
import Modal from "@/components/Modal/Modal";
import Footer from "@/components/Footer/Footer";
import Lightning from "@/components/Lightning/Lightning";
import "./Home.css";

function Home({
  isSignedIn,
  isProfileOpen,
  lightningOn,
  profilePhotoUrl,
  user,
  toggleModal,
  showLightning,
  signOut,
  loadUser,
  changeProfileImage,
  filestackApiKey
}) {
  return (
    <div className="App">
      {lightningOn && (
        <>
          <ParticlesComponent lightningOn={lightningOn} />
          <Lightning lightningOn={lightningOn} />
        </>
      )}
      <Navigation
        className="row1"
        isSignedIn={isSignedIn}
        toggleModal={toggleModal}
        profilePhotoUrl={profilePhotoUrl}
        showLightning={showLightning}
        signOut={signOut}
      />
      {isProfileOpen && (
        <Modal>
          <RemoveScroll>
            <Profile
              isProfileOpen={isProfileOpen}
              toggleModal={toggleModal}
              loadUser={loadUser}
              profilePhotoUrl={profilePhotoUrl}
              changeProfileImage={changeProfileImage}
              client={filestackApiKey}
              user={user}
              signOut={signOut}
            />
          </RemoveScroll>
        </Modal>
      )}
      <div className="row2">
        <Outlet />
      </div>
      <Footer className="row3" />
    </div>
  );
}

export default Home;
