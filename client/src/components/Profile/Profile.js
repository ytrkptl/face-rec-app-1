import React from "react";
import { withRouter } from "react-router-dom";
import "./Profile.css";

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.user.name,
      age: this.props.user.age,
      pet: this.props.user.pet,
      url: this.props.profilePhotoUrl,
      handle: this.props.user.handle,
    };
  }

  onFormChange = (event) => {
    switch (event.target.name) {
      case "user-name":
        this.setState({ name: event.target.value });
        break;
      case "user-age":
        this.setState({ age: event.target.value });
        break;
      case "user-pet":
        this.setState({ pet: event.target.value });
        break;
      default:
        return;
    }
  };

  onProfileUpdate = (data) => {
    fetch(`/profile/${this.props.user.id}`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: window.sessionStorage.getItem("token"),
      },
      body: JSON.stringify({ formInput: data }),
    })
      .then((resp) => {
        if (resp.status === 200 || resp.status === 304) {
          this.props.toggleModal();
          this.props.changeProfileImage(this.state.url, this.state.handle);
          this.props.loadUser({ ...this.props.user, ...data });
        }
      })
      .catch((e) => {
        console.log(`error updating user profile`);
      });
  };

  triggerPhotoChange = () => {
    const client = this.props.client;
    const options = {
      maxFiles: 1,
      uploadInBackground: false,
      onOpen: () => {},
      onUploadDone: (res) => uploadPhotoFunction(res),
    };

    client.picker(options).open();

    const uploadPhotoFunction = (someObject) => {
      if (someObject) {
        let HANDLE = someObject.filesUploaded[0].handle;
        fetch(
          `https://cdn.filestackcontent.com/resize=height:200,width:200/${HANDLE}`,
          {
            method: "GET",
          }
        )
          .then((resp) => {
            let url = resp.url;
            this.setState({ url, handle: HANDLE });
          })
          .catch((err) => console.log(`error uploading photo`));
      }
    };
  };

  render() {
    const { user } = this.props;
    const { name, age, pet, handle, url } = this.state;
    return (
      <div className="profile-modal">
        <article className="responsive">
          <main className="main">
            <div className="centerThatDiv">
              <img
                src={url}
                name="user-photo"
                className="avatarImageInProfile"
                alt="avatar"
              />
              <button
                className="changePhotoButton"
                onClick={() => this.triggerPhotoChange()}
              >
                Change Profile Photo
              </button>
            </div>
            <h1>{user.name}</h1>
            <h4>{`Images Submitted: ${user.entries}`}</h4>
            <p>{`Member since: ${new Date(
              user.joined
            ).toLocaleDateString()}`}</p>
            <hr />
            <label className="labelForUsername" htmlFor="user-name">
              Name:{" "}
            </label>
            <input
              onChange={this.onFormChange}
              className="inputClasses"
              placeholder={user.name}
              type="text"
              name="user-name"
              id="user-name"
            />
            <label className="otherLabels" htmlFor="user-age">
              Age:{" "}
            </label>
            <input
              onChange={this.onFormChange}
              className="inputClasses"
              placeholder={user.age}
              type="text"
              name="user-age"
              id="user-age"
            />
            <label className="otherLabels" htmlFor="user-pet">
              Pet:{" "}
            </label>
            <input
              onChange={this.onFormChange}
              className="inputClasses"
              placeholder={user.pet}
              type="text"
              name="user-pet"
              id="user-pet"
            />
            <div className="saveAndCancelButtonsDiv">
              <button
                onClick={() => this.onProfileUpdate({ name, age, pet, handle })}
                className="saveButton"
              >
                Save
              </button>
              <button className="cancelButton" onClick={this.props.toggleModal}>
                Cancel
              </button>
            </div>
          </main>
          <div className="modal-close" onClick={this.props.toggleModal}>
            &times;
          </div>
        </article>
      </div>
    );
  }
}

export default withRouter(Profile);
