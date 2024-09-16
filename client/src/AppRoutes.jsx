import { useEffect, useState } from "react";
import { redirect, Route, Routes } from "react-router-dom";
import Signin from "@/components/Signin/Signin";
import Register from "@/components/Register/Register";
import PrivateRoute from "@/components/PrivateRoute";
import LazyLoad from "./LazyLoad"; // Import the LazyLoad HOC
import HomePage from "@/pages/Home/Home";
import * as filestack from "filestack-js";
import "./App.css";

const Forgot = LazyLoad(() => import("@/components/Forgot/Forgot"));
const Rank = LazyLoad(() => import("@/components/Rank/Rank"));

const filestackApiKey = filestack.init(`${import.meta.env.VITE_FILESTACK_API_KEY}`);
if (!filestackApiKey) {
  throw new Error("VITE_FILESTACK_API_KEY environment variable is not defined");
}

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
    handle: ""
  }
};

// convert to functional component
const AppRoutes = () => {
  const [appState, setAppState] = useState(initialState);

  useEffect(() => {
    const token = window.sessionStorage.getItem("token");
    if (token) {
      async function signin() {
        try {
          const response = await fetch(`/api/signin`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: token
            }
          });
          return await response.json();
        } catch (error) {
          console.log("Failed to sign in", "error", { error });
        }
      }
      async function fetchProfile(data) {
        try {
          const user = await fetch(`/api/profile/${data.id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: token
            }
          });
          return await user.json();
        } catch (error) {
          console.log("Failed to fetch user profile", "error", {
            error
          });
        }
      }
      async function loadUserAndToggleSignIn() {
        const signinData = await signin();
        const profileData = await signinData.then((data) => fetchProfile(data));
        if (profileData && profileData.email) {
          loadUser(profileData);
          toggleSignIn(true);
        }
      }
      loadUserAndToggleSignIn();

      return () => {};
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadUser = (data) => {
    setAppState((prevState) => ({
      ...prevState,
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined,
        pet: data.pet,
        age: data.age,
        handle: data.handle
      }
    }));
    if (data.handle === "" || data.handle === undefined || data.handle === null) {
      setAppState({
        ...appState,
        profilePhotoUrl: "https://avatar-letter.herokuapp.com/api/file/set1/big/u/png"
      });
    } else {
      setAppState({
        ...appState,
        profilePhotoUrl: `https://cdn.filestackcontent.com/resize=height:200,width:200/${data.handle}`
      });
    }
  };

  const calculateFaceLocations = (data) => {
    if (data && data.outputs && data.outputs[0].data && data.outputs[0].data.regions) {
      const image = document.getElementById("inputimage");
      const width = Number(image.width);
      const height = Number(image.height);
      return data.outputs[0].data.regions.map((face) => {
        const clarifaiFace = face.region_info.bounding_box;
        return {
          leftCol: clarifaiFace.left_col * width,
          topRow: clarifaiFace.top_row * height,
          rightCol: width - clarifaiFace.right_col * width,
          bottomRow: height - clarifaiFace.bottom_row * height
        };
      });
    }
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

  const onButtonSubmit = async () => {
    try {
      const response = await fetch(`/api/imageurl`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: window.sessionStorage.getItem("token")
        },
        body: JSON.stringify({
          input: appState.imageUrl
        })
      });
      const data = await response.json();
      if (data) {
        const countResponse = await fetch(`/api/image`, {
          method: "put",
          headers: {
            "Content-Type": "application/json",
            Authorization: window.sessionStorage.getItem("token")
          },
          body: JSON.stringify({
            id: appState.user.id
          })
        });
        const count = await countResponse.json();
        setAppState((prevState) => ({
          ...prevState,
          user: {
            ...prevState.user,
            entries: count
          }
        }));
      }
      displayFaceBox(calculateFaceLocations(data));
    } catch (error) {
      console.log("Failed to submit image", "error", { error });
    }
  };

  const signOut = async () => {
    setAppState(initialState);
    try {
      const response = await fetch(`/api/signout`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: window.sessionStorage.getItem("token")
        }
      });
      const value = await response.json();
      if (value) {
        removeAuthTokenFromSession("token");
        toggleSignIn(false);
      }
    } catch (error) {
      console.log("Failed to sign out", "error", { error });
      console.log(`error onRouteChange in App.js line 202`);
    }
  };

  const toggleModal = () => {
    setAppState((prevState) => ({
      ...prevState,
      isProfileOpen: !prevState.isProfileOpen
    }));
  };

  const changeProfileImage = (url, handle) => {
    setAppState((prevState) => ({
      ...prevState,
      profilePhotoUrl: `${url}`
    }));
    fetch(`/api/upload/${appState.user.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: window.sessionStorage.getItem("token")
      },
      body: JSON.stringify({
        handle: handle
      })
    })
      .then((resp) => {
        const token = window.sessionStorage.getItem("token");
        if (resp === "success inserted handle in db") {
          fetch(`/api/profile/${appState.user.id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: token
            }
          })
            .then((resp) => resp.json())
            .then((user) => {
              if (user && user.email) {
                loadUser(user);
              }
            });
        }
      })
      .catch(() => console.log(`error running changeProfileImage in App.js line 249`));
  };

  const showLightning = () => {
    setAppState((prevState) => ({
      ...prevState,
      lightningOn: !prevState.lightningOn
    }));
  };

  const toggleSignIn = (val) => {
    setAppState({ ...appState, isSignedIn: val });
    return val ? redirect("/") : redirect("/signin");
  };

  const { isSignedIn, imageUrl, boxes, user } = appState;

  return (
    <Routes>
      <Route
        path="/"
        element={
          <HomePage
            {...appState}
            changeImageUrl={changeImageUrl}
            filestackApiKey={filestackApiKey}
            toggleModal={toggleModal}
            showLightning={showLightning}
            signOut={signOut}
            changeProfileImage={changeProfileImage}
          />
        }>
        <Route
          index
          element={
            <PrivateRoute
              isSignedIn={isSignedIn}
              redirectPath="/signin">
              <Rank
                name={user.name}
                entries={user.entries}
                changeImageUrl={changeImageUrl}
                client={filestackApiKey}
                boxes={boxes}
                imageUrl={imageUrl}
              />
            </PrivateRoute>
          }
        />
        <Route
          exact
          path="signin"
          element={
            <PrivateRoute
              isSignedIn={!isSignedIn}
              redirectPath="/">
              <Signin
                loadUser={loadUser}
                saveAuthTokenInSession={saveAuthTokenInSession}
                toggleSignIn={toggleSignIn}
              />
            </PrivateRoute>
          }
        />
        <Route
          exact
          path="register"
          element={
            <PrivateRoute
              isSignedIn={!isSignedIn}
              redirectPath="/">
              <Register
                loadUser={loadUser}
                saveAuthTokenInSession={saveAuthTokenInSession}
                toggleSignIn={toggleSignIn}
              />
            </PrivateRoute>
          }
        />
        <Route
          exact
          path="forgot"
          element={
            <PrivateRoute
              isSignedIn={!isSignedIn}
              redirectPath="/">
              <Forgot />
            </PrivateRoute>
          }
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
