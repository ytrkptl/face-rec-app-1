import { useState } from "react";
import "./Profile.css";

// convert to functional component
const Profile = ({
  user,
  profilePhotoUrl,
  client,
  toggleModal,
  changeProfileImage,
  loadUser,
}) => {
  const [profileState, setProfileState] = useState({
    name: user.name,
    age: user.age,
    pet: user.pet,
    url: profilePhotoUrl,
    handle: user.handle,
  });

  const onFormChange = (event) => {
    const { name, value } = event.target;

    setProfileState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onProfileUpdate = async (data) => {
    try {
      const response = await fetch(`/api/profile/${user.id}`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: window.sessionStorage.getItem("token"),
        },
        body: JSON.stringify({ formInput: data }),
      });
      if (response.status === 200 || response.status === 304) {
        toggleModal();
        changeProfileImage(profileState.url, profileState.handle);
        loadUser({ ...user, ...data });
      }
    } catch (error) {
      console.log(`error updating user profile`);
    }
  };

  const triggerPhotoChange = () => {
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
            setProfileState({ ...profileState, url, handle: HANDLE });
          })
          .catch(() => console.log(`error uploading photo`));
      }
    };
  };

  const { name, age, pet, handle, url } = profileState;

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
              onClick={() => triggerPhotoChange()}>
              Change Profile Photo
            </button>
          </div>
          <h1>{user.name}</h1>
          <h4>{`Images Submitted: ${user.entries}`}</h4>
          <p>{`Member since: ${new Date(user.joined).toLocaleDateString()}`}</p>
          <hr />
          <label className="labelForUsername" htmlFor="user-name">
            Name:{" "}
          </label>
          <input
            onChange={onFormChange}
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
            onChange={onFormChange}
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
            onChange={onFormChange}
            className="inputClasses"
            placeholder={user.pet}
            type="text"
            name="user-pet"
            id="user-pet"
          />
          <div className="saveAndCancelButtonsDiv">
            <button
              onClick={() => onProfileUpdate({ name, age, pet, handle })}
              className="saveButton">
              Save
            </button>
            <button className="cancelButton" onClick={toggleModal}>
              Cancel
            </button>
          </div>
        </main>
        <div className="modal-close" onClick={toggleModal}>
          &times;
        </div>
      </article>
    </div>
  );
};

export default Profile;
