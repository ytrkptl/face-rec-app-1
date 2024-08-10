import { useState, useEffect } from "react";
import { Route, redirect, Routes, Outlet } from "react-router-dom";
import { RemoveScroll } from "react-remove-scroll";
import ParticlesComponent from "../components/Particles/Particles";
import Navigation from "../components/Navigation/Navigation";
import FaceRecognition from "../components/FaceRecognition/FaceRecognition";
import Signin from "../components/Signin/Signin";
import Register from "../components/Register/Register";
import Forgot from "../components/Forgot/Forgot";
import UploadButtonWithPicker from "../components/UploadButtonWithPicker/UploadButtonWithPicker";
import Rank from "../components/Rank/Rank";
import Modal from "../components/Modal/Modal";
import Profile from "../components/Profile/Profile";
import Footer from "../components/Footer/Footer";
import Lightning from "../components/Lightning/Lightning";
import * as filestack from "filestack-js";
import "./App.css";

const client = filestack.init(`${import.meta.env.VITE_FILESTACK}`);

// Create-React-App automatically detects and uses env varialbes
// prefixed with VITE_ during local development
// The config variables for production are stored in heroku itself.

const initialState = {
  imageUrl: "",
  boxes: [],
  isSignedIn: false,
  isProfileOpen: false,
  lightningOn: false,
  profilePhotoUrl: "",
  user: {
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: "",
    pet: "",
    age: 30,
    handle: "",
  },
};

// convert to functional component
const App = () => {
  const [appState, setAppState] = useState(initialState);

  useEffect(() => {
    const token = window.sessionStorage.getItem("token");
    if (token) {
      fetch(`/api/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      })
        .then((resp) => resp.json())
        .then((data) => {
          if (data && data.id) {
            fetch(`/api/profile/${data.id}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: token,
              },
            })
              .then((resp) => resp.json())
              .then((user) => {
                if (user && user.email) {
                  loadUser(user);
                  toggleSignIn(true);
                }
              })
              .catch((err) =>
                console.log(
                  err +
                    "error fetching user profile in App.js component did mount"
                )
              );
          }
        })
        .catch((err) =>
          console.log(err + `error in componentDidMount in App.js`)
        );

      return () => {};
    }
  }, []);

  const loadUser = (data) => {
    setAppState({
      ...appState,
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined,
        pet: data.pet,
        age: data.age,
        handle: data.handle,
      },
    });
    if (
      data.handle === "" ||
      data.handle === undefined ||
      data.handle === null
    ) {
      setAppState({
        ...appState,
        profilePhotoUrl:
          "https://avatar-letter.herokuapp.com/api/file/set1/big/u/png",
      });
    } else {
      setAppState({
        ...appState,
        profilePhotoUrl: `https://cdn.filestackcontent.com/resize=height:200,width:200/${data.handle}`,
      });
    }
  };

  const calculateFaceLocations = (data) => {
    if (
      data &&
      data.outputs &&
      data.outputs[0].data &&
      data.outputs[0].data.regions
    ) {
      const image = document.getElementById("inputimage");
      const width = Number(image.width);
      const height = Number(image.height);
      return data.outputs[0].data.regions.map((face) => {
        const clarifaiFace = face.region_info.bounding_box;
        return {
          leftCol: clarifaiFace.left_col * width,
          topRow: clarifaiFace.top_row * height,
          rightCol: width - clarifaiFace.right_col * width,
          bottomRow: height - clarifaiFace.bottom_row * height,
        };
      });
    }
    return;
  };

  const displayFaceBox = (boxes) => {
    if (boxes) {
      setAppState({ ...appState, boxes: boxes });
    }
  };

  const saveAuthTokenInSession = (token) => {
    window.sessionStorage.setItem("token", token);
  };

  const removeAuthTokenFromSession = (token) => {
    window.sessionStorage.removeItem(token);
  };

  const changeImageUrl = (source) => {
    setAppState({ ...appState, imageUrl: source });
    onButtonSubmit();
  };

  const onButtonSubmit = () => {
    fetch(`/api/imageurl`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: window.sessionStorage.getItem("token"),
      },
      body: JSON.stringify({
        input: appState.imageUrl,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response) {
          fetch(`/api/image`, {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              Authorization: window.sessionStorage.getItem("token"),
            },
            body: JSON.stringify({
              id: appState.user.id,
            }),
          })
            .then((response) => response.json())
            .then((count) => {
              setAppState((prevState) => ({
                ...prevState,
                user: {
                  ...prevState.user,
                  entries: count,
                },
              }));
            })
            .catch(() =>
              console.log(`error onButtonSubmit method in App.js line 173`)
            );
        }
        displayFaceBox(calculateFaceLocations(response));
      })
      .catch(() => console.log(`error upon submit button in App.js line 177`));
  };

  const signOut = async () => {
    setAppState(initialState);
    try {
      const response = await fetch(`/api/signout`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: window.sessionStorage.getItem("token"),
        },
      });
      const value = await response.json();
      if (value) {
        removeAuthTokenFromSession("token");
        toggleSignIn(false);
      }
    } catch (error) {
      return console.log(`error onRouteChange in App.js line 202`);
    }
  };

  const toggleModal = () => {
    setAppState((prevState) => ({
      ...prevState,
      isProfileOpen: !prevState.isProfileOpen,
    }));
  };

  const changeProfileImage = (url, handle) => {
    setAppState({ ...appState, profilePhotoUrl: `${url}` });
    fetch(`/api/upload/${appState.user.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: window.sessionStorage.getItem("token"),
      },
      body: JSON.stringify({
        handle: handle,
      }),
    })
      .then((resp) => {
        const token = window.sessionStorage.getItem("token");
        if (resp === "success inserted handle in db") {
          fetch(`/api/profile/${appState.user.id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          })
            .then((resp) => resp.json())
            .then((user) => {
              if (user && user.email) {
                loadUser(user);
              }
            });
        }
      })
      .catch(() =>
        console.log(`error running changeProfileImage in App.js line 249`)
      );
  };

  const showLightning = () => {
    setAppState((prevState) => ({
      ...prevState,
      lightningOn: !prevState.lightningOn,
    }));
  };

  const toggleSignIn = (val) => {
    setAppState({ ...appState, isSignedIn: val });
    val ? redirect("/") : redirect("/signin");
  };

  const {
    isSignedIn,
    imageUrl,
    boxes,
    isProfileOpen,
    lightningOn,
    user,
    profilePhotoUrl,
  } = appState;
  return (
    <Routes>
      <Route
        path="/"
        element={
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
                    client={client}
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
        }>
        <Route
          index
          element={
            <>
              {isSignedIn ? (
                <div className="rankAndImageFormWrapper">
                  <Rank name={user.name} entries={user.entries} />
                  <UploadButtonWithPicker
                    changeImageUrl={changeImageUrl}
                    client={client}
                  />
                  <FaceRecognition boxes={boxes} imageUrl={imageUrl} />
                </div>
              ) : (
                <h1>you are not signed in</h1>
              )}
            </>
          }
        />
        <Route
          exact
          path="signin"
          element={
            <Signin
              loadUser={loadUser}
              saveAuthTokenInSession={saveAuthTokenInSession}
              toggleSignIn={toggleSignIn}
            />
          }
        />
        <Route
          exact
          path="register"
          element={
            <Register
              loadUser={loadUser}
              saveAuthTokenInSession={saveAuthTokenInSession}
              toggleSignIn={toggleSignIn}
            />
          }
        />
        <Route exact path="forgot" element={<Forgot />} />
      </Route>
    </Routes>
  );
};

export default App;
