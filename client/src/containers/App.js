import React, { Component } from 'react';
import ParticlesComponent from '../components/Particles/Particles';
import Navigation from '../components/Navigation/Navigation';
import FaceRecognition from '../components/FaceRecognition/FaceRecognition';
import Signin from '../components/Signin/Signin';
import Register from '../components/Register/Register';
import Forgot from '../components/Forgot/Forgot';
import UploadButtonWithPicker from '../components/UploadButtonWithPicker/UploadButtonWithPicker';
// import UploadToCloudinary from '../components/UploadToCloudinary/UploadToCloudinary';
import Rank from '../components/Rank/Rank';
import Modal from '../components/Modal/Modal';
import Profile from '../components/Profile/Profile';
import Footer from '../components/Footer/Footer';
import Lightning from '../components/Lightning/Lightning';
import * as filestack from 'filestack-js';
import ReactGA from 'react-ga';

import './App.css';

ReactGA.initialize(`${process.env.REACT_APP_GA_TRACKING_ID}`);
ReactGA.pageview(window.location.pathname + window.location.search);
const client = filestack.init(`${process.env.REACT_APP_FILESTACK}`);

// Create-React-App automatically detects and uses env varialbes
// prefixed with REACT_APP_ during local development
// The config variables for production are stored in heroku itself.

const initialState = {
  imageUrl: '',
  boxes: [],
  route: 'signin',
  isSignedIn: false,
  isProfileOpen: false,
  lightningOn: false,
  profilePhotoUrl: '',
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: '',
    pet: '',
    age: 30,
    handle: ''
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  componentDidMount() {
    const token = window.sessionStorage.getItem('token');
    console.log(token)
    if (token) {
      fetch(`${process.env.REACT_APP_ENDPOINT_URL}/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      })
        .then(resp => resp.json())
        .then(data => {
          console.log(data && data.id)
          if (data && data.id) {
            fetch(`${process.env.REACT_APP_ENDPOINT_URL}/profile/${data.id}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': token
              }
            })
              .then(resp => resp.json())
              .then(user => {
                if (user && user.email) {
                  this.loadUser(user)
                  this.onRouteChange('home');
                }
              })
          }
        })
        .catch(console.log)
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
        handle: data.handle
      }
    })
    if (data.handle === '' || data.handle === undefined || data.handle === null) {
      this.setState({ profilePhotoUrl: 'http://tachyons.io/img/logo.jpg' })
    } else {
      this.setState({ profilePhotoUrl: `https://cdn.filestackcontent.com/resize=height:200,width:200/${data.handle}` })
    }
  }

  calculateFaceLocations = (data) => {
    if (data && data.outputs && data.outputs[0].data && data.outputs[0].data.regions) {
      const image = document.getElementById('inputimage');
      const width = Number(image.width);
      const height = Number(image.height);
      return data.outputs[0].data.regions.map(face => {
        const clarifaiFace = face.region_info.bounding_box;
        return {
          leftCol: clarifaiFace.left_col * width,
          topRow: clarifaiFace.top_row * height,
          rightCol: width - (clarifaiFace.right_col * width),
          bottomRow: height - (clarifaiFace.bottom_row * height)
        }
      });
    }
    return;
  }

  displayFaceBox = (boxes) => {
    if (boxes) {
      this.setState({ boxes: boxes });
    }
  }

  saveAuthTokenInSession = (token) => {
    window.sessionStorage.setItem('token', token);
  }

  removeAuthTokenFromSession = (token) => {
    window.sessionStorage.removeItem(token);
  }

  changeImageUrl = (source) => {
    this.setState({ imageUrl: source });
    this.onButtonSubmit();
  }

  onButtonSubmit = () => {
    fetch(`${process.env.REACT_APP_ENDPOINT_URL}/imageurl`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': window.sessionStorage.getItem('token')
      },
      body: JSON.stringify({
        input: this.state.imageUrl
      })
    })
      .then(response => response.json())
      .then(response => {
        if (response) {
          fetch(`${process.env.REACT_APP_ENDPOINT_URL}/image`, {
            method: 'put',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': window.sessionStorage.getItem('token')
            },
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count }))
            })
            .catch(console.log)
        }
        this.displayFaceBox(this.calculateFaceLocations(response))
      })
      .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState)
      // removeAuthTokenFromSession will remove the 
      // token from the browser,
      // however we may also need to remove it from redis in backend
      // therefore the below fetch function, which removes it from
      // redis first and then call the removeAuthTokenFromSession func
      // above
      fetch(`${process.env.REACT_APP_ENDPOINT_URL}/signout`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': window.sessionStorage.getItem('token')
        }
      })
        .then(response => response.json())
        .then(value => {
          if (value) {
            this.removeAuthTokenFromSession('token');
          }
        })
        .catch(error => console.log(error))
      return
    } else if (route === 'home') {
      this.setState({ isSignedIn: true })
    }
    this.setState({ route: route });
  }

  toggleModal = () => {
    this.setState(prevState => ({
      ...prevState,
      isProfileOpen: !prevState.isProfileOpen
    }))
  }

  changeProfileImage = (url, handle) => {
    this.setState({ profilePhotoUrl: `${url}` })

    fetch(`${process.env.REACT_APP_ENDPOINT_URL}/upload/${this.state.user.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': window.sessionStorage.getItem('token')
      },
      body: JSON.stringify({
        handle: handle
      })
    })
      .then(resp => {
        const token = window.sessionStorage.getItem('token')
        if (resp === "success inserted handle in db") {
          fetch(`${process.env.REACT_APP_ENDPOINT_URL}/profile/${this.state.user.id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token
            }
          })
            .then(resp => resp.json())
            .then(user => {
              if (user && user.email) {
                this.loadUser(user)
                this.onRouteChange('home');
              }
            })
        }
      })
      .catch(err => console.log(err))
  }

  showLightning = () => {
    this.setState(prevState => ({
      ...prevState,
      lightningOn: !prevState.lightningOn
    }))
  }

  render() {
    const { isSignedIn, imageUrl, route, boxes, isProfileOpen, lightningOn, user, profilePhotoUrl } = this.state;
    return (
      <div className="App">
        {
          lightningOn &&
          <>
            <ParticlesComponent lightningOn={lightningOn} />
            <Lightning lightningOn={lightningOn} />
          </>
        }
        <Navigation
          className="row1"
          isSignedIn={isSignedIn}
          onRouteChange={this.onRouteChange}
          toggleModal={this.toggleModal}
          profilePhotoUrl={profilePhotoUrl}
          showLightning={this.showLightning}
        />
        {isProfileOpen &&
          <Modal>
            <Profile
              isProfileOpen={isProfileOpen}
              toggleModal={this.toggleModal}
              loadUser={this.loadUser}
              profilePhotoUrl={profilePhotoUrl}
              changeProfileImage={this.changeProfileImage}
              client={client}
              user={user} />
          </Modal>
        }
        <div className="row2">
          {route === 'home' &&
            <div className="rankAndImageFormWrapper">
              <Rank
                name={user.name}
                entries={user.entries}
              />
              <UploadButtonWithPicker
                changeImageUrl={this.changeImageUrl}
                client={client}
              />
              {/* <UploadToCloudinary changeImageUrl={this.changeImageUrl} /> */}
              <FaceRecognition boxes={boxes} imageUrl={imageUrl} />
            </div>
          }
          {route === 'signin' &&
            <Signin
              loadUser={this.loadUser}
              saveAuthTokenInSession={this.saveAuthTokenInSession}
              onRouteChange={this.onRouteChange} />
          }
          {route === 'register' &&
            <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          }
          {route === 'forgot' && <Forgot onRouteChange={this.onRouteChange} />}
        </div>
        <Footer className="row3" />
      </div>
    );
  }
}

export default App;