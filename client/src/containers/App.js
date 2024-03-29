import React, { Component } from "react";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
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
import ReactGA from "react-ga";

import "./App.css";

ReactGA.initialize(`${process.env.REACT_APP_GA_TRACKING_ID}`);
ReactGA.pageview(window.location.pathname + window.location.search);
const client = filestack.init(`${process.env.REACT_APP_FILESTACK}`);

// Create-React-App automatically detects and uses env varialbes
// prefixed with REACT_APP_ during local development
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

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  componentDidMount() {
    const token = window.sessionStorage.getItem("token");
    if (token) {
      fetch(`/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      })
        .then((resp) => resp.json())
        .then((data) => {
          if (data && data.id) {
            fetch(`/profile/${data.id}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: token,
              },
            })
              .then((resp) => resp.json())
              .then((user) => {
                if (user && user.email) {
                  this.loadUser(user);
                  this.toggleSignIn(true);
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
    }
  }

  loadUser = (data) => {
    this.setState({
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
      this.setState({
        profilePhotoUrl:
          "https://avatar-letter.herokuapp.com/api/file/set1/big/u/png",
      });
    } else {
      this.setState({
        profilePhotoUrl: `https://cdn.filestackcontent.com/resize=height:200,width:200/${data.handle}`,
      });
    }
  };

  calculateFaceLocations = (data) => {
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

  displayFaceBox = (boxes) => {
    if (boxes) {
      this.setState({ boxes: boxes });
    }
  };

  saveAuthTokenInSession = (token) => {
    window.sessionStorage.setItem("token", token);
  };

  removeAuthTokenFromSession = (token) => {
    window.sessionStorage.removeItem(token);
  };

  changeImageUrl = (source) => {
    this.setState({ imageUrl: source });
    this.onButtonSubmit();
  };

  onButtonSubmit = () => {
    fetch(`/imageurl`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: window.sessionStorage.getItem("token"),
      },
      body: JSON.stringify({
        input: this.state.imageUrl,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response) {
          fetch(`/image`, {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              Authorization: window.sessionStorage.getItem("token"),
            },
            body: JSON.stringify({
              id: this.state.user.id,
            }),
          })
            .then((response) => response.json())
            .then((count) => {
              this.setState((prevState) => ({
                user: {
                  ...prevState.user,
                  entries: count,
                },
              }));
            })
            .catch((err) =>
              console.log(`error onButtonSubmit method in App.js line 173`)
            );
        }
        this.displayFaceBox(this.calculateFaceLocations(response));
      })
      .catch((err) =>
        console.log(`error upon submit button in App.js line 177`)
      );
  };

  signOut = async () => {
    this.setState(initialState);
    try {
      const response = await fetch(`/signout`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: window.sessionStorage.getItem("token"),
        },
      });
      const value = await response.json();
      if (value) {
        this.removeAuthTokenFromSession("token");
        this.toggleSignIn(false);
      }
    } catch (error) {
      return console.log(`error onRouteChange in App.js line 202`);
    }
  };

  toggleModal = () => {
    this.setState((prevState) => ({
      ...prevState,
      isProfileOpen: !prevState.isProfileOpen,
    }));
  };

  changeProfileImage = (url, handle) => {
    this.setState({ profilePhotoUrl: `${url}` });
    fetch(`/upload/${this.state.user.id}`, {
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
          fetch(`/profile/${this.state.user.id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          })
            .then((resp) => resp.json())
            .then((user) => {
              if (user && user.email) {
                this.loadUser(user);
              }
            });
        }
      })
      .catch((err) =>
        console.log(`error running changeProfileImage in App.js line 249`)
      );
  };

  showLightning = () => {
    this.setState((prevState) => ({
      ...prevState,
      lightningOn: !prevState.lightningOn,
    }));
  };

  toggleSignIn = (val) => {
    this.setState({ isSignedIn: val });
    val ? this.props.history.push("/") : this.props.history.push("/signin");
  };

  render() {
    const {
      isSignedIn,
      imageUrl,
      boxes,
      isProfileOpen,
      lightningOn,
      user,
      profilePhotoUrl,
    } = this.state;
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
          toggleModal={this.toggleModal}
          profilePhotoUrl={profilePhotoUrl}
          showLightning={this.showLightning}
          signOut={this.signOut}
        />
        {isProfileOpen && (
          <Modal>
            <RemoveScroll>
              <Profile
                isProfileOpen={isProfileOpen}
                toggleModal={this.toggleModal}
                loadUser={this.loadUser}
                profilePhotoUrl={profilePhotoUrl}
                changeProfileImage={this.changeProfileImage}
                client={client}
                user={user}
                signOut={this.signOut}
              />
            </RemoveScroll>
          </Modal>
        )}
        <div className="row2">
          <Switch>
            <Route exact path="/">
              {isSignedIn ? (
                <div className="rankAndImageFormWrapper">
                  <Rank name={user.name} entries={user.entries} />
                  <UploadButtonWithPicker
                    changeImageUrl={this.changeImageUrl}
                    client={client}
                  />
                  <FaceRecognition boxes={boxes} imageUrl={imageUrl} />
                </div>
              ) : (
                <Redirect to="/signin" />
              )}
            </Route>
            <Route
              exact
              path="/signin"
              render={() => {
                return (
                  <Signin
                    loadUser={this.loadUser}
                    saveAuthTokenInSession={this.saveAuthTokenInSession}
                    toggleSignIn={this.toggleSignIn}
                  />
                );
              }}
            />
            <Route
              exact
              path="/register"
              render={() => (
                <Register
                  loadUser={this.loadUser}
                  saveAuthTokenInSession={this.saveAuthTokenInSession}
                  toggleSignIn={this.toggleSignIn}
                />
              )}
            />
            <Route
              exact
              path="/forgot"
              render={() => {
                return <Forgot />;
              }}
            />
          </Switch>
        </div>
        <Footer className="row3" />
      </div>
    );
  }
}

export default withRouter(App);
