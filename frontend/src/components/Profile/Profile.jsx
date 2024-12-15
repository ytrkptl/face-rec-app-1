import { useState, useEffect } from "react";
import "./Profile.css";
import { useDispatch, useSelector } from "react-redux";
import {
	selectUserEmail,
	selectUserEntries,
	selectUserName,
	selectUserUid,
	selectUserJoined,
	selectUserPet,
	selectUserAge,
	selectUserHandle,
	selectUserProfilePhotoUrl
} from "@/redux/user/user.selectors";
import { updateUser } from "@/redux/user/user.actions";
import { updateUserProfile } from "@/services/firebase.utils";
import { updateProfileOpen } from "@/redux/app/app.actions";
import { selectIsProfileOpen } from "@/redux/app/app.selectors";
import * as filestack from "filestack-js";
// import { NODE_ENV } from "@/config/index";

// env variables prefixed with VITE_ are available in the browser
const filestackClient = filestack.init(`${import.meta.env.VITE_FILESTACK_API_KEY}`);
if (!filestackClient) {
	throw new Error("VITE_FILESTACK_API_KEY environment variable is not defined");
}

// convert to functional component
const Profile = () => {
	const userUid = useSelector(selectUserUid);
	const userName = useSelector(selectUserName);
	const userEmail = useSelector(selectUserEmail);
	const userEntries = useSelector(selectUserEntries);
	const userJoined = useSelector(selectUserJoined);
	const userPet = useSelector(selectUserPet);
	const userAge = useSelector(selectUserAge);
	const userHandle = useSelector(selectUserHandle);
	const profilePhotoUrl = useSelector(selectUserProfilePhotoUrl);
	const profileOpen = useSelector(selectIsProfileOpen);
	const dispatch = useDispatch();

	const [profileState, setProfileState] = useState({
		name: userName,
		age: userAge,
		pet: userPet,
		handle: userHandle,
		url: profilePhotoUrl
	});

	const { name, age, pet, handle, url } = profileState;

	useEffect(() => {
		// if the profile photo url is from avatar-letter.fun/api
		// then we need to change the url to the large version of the photo
		// so it looks better in the profile modal
		if (url.includes("avatar-letter.fun/api")) {
			if (profileOpen) {
				// replace the big word with large
				const url2 = url.replace("big", "large");
				setProfileState((prevState) => ({ ...prevState, url: url2 }));
			} else {
				// replace the large word with big
				const url2 = url.replace("large", "big");
				setProfileState((prevState) => ({ ...prevState, url: url2 }));
			}
		}

		return () => {
			setProfileState((prevState) => prevState);
		};
	}, [profileOpen, url]);

	const onFormChange = (event) => {
		const { name, value } = event.target;
		const nameSubstring = name.split("-")[1];

		setProfileState((prevState) => ({
			...prevState,
			[nameSubstring]: value
		}));
	};

	const onProfileUpdate = async (data) => {
		try {
			const profileObj = {
				uid: userUid,
				displayName: data.name,
				email: userEmail,
				entries: userEntries,
				joined: userJoined,
				pet: data.pet,
				age: data.age,
				handle: data.handle,
				profilePhotoUrl: data.url,
				updatedAt: new Date().toISOString()
			};
			// update the name, age, pet, and handle in firestore
			await updateUserProfile(userUid, profileObj);
			// update the user in redux
			dispatch(updateUser(profileObj));
			dispatch(updateProfileOpen(false));
		} catch (error) {
			// if (NODE_ENV === "development") {
			// 	console.log(`error updating user profile`, error.message);
			// }
		}
	};

	const triggerPhotoChange = () => {
		const options = {
			maxFiles: 1,
			uploadInBackground: false,
			accept: ["image/jpeg", "image/png"],
			fromSources: ["local_file_system", "url", "imagesearch"],
			onOpen: () => {},
			onUploadDone: (res) => uploadPhotoFunction(res)
		};

		filestackClient.picker(options).open();

		const uploadPhotoFunction = (someObject) => {
			if (someObject) {
				const HANDLE = someObject.filesUploaded[0].handle;
				fetch(`https://cdn.filestackcontent.com/resize=height:200,width:200/${HANDLE}`, {
					method: "GET"
				})
					.then((resp) => {
						const url = resp.url;
						setProfileState({ ...profileState, url, handle: HANDLE });
					})
					.catch(() => console.log(`error uploading photo`));
			}
		};
	};

	const closeModal = () => {
		dispatch(updateProfileOpen(false));
	};

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
					<h1>{name}</h1>
					<h4>{`Images Submitted: ${userEntries}`}</h4>
					<p>{`Member since: ${userJoined}`}</p>
					<hr />
					<label
						className="labelForUsername"
						htmlFor="user-name">
						Name:{" "}
					</label>
					<input
						onChange={onFormChange}
						className="inputClasses"
						placeholder={name}
						type="text"
						name="user-name"
						id="user-name"
					/>
					<label
						className="otherLabels"
						htmlFor="user-age">
						Age:{" "}
					</label>
					<input
						onChange={onFormChange}
						className="inputClasses"
						placeholder={age}
						type="text"
						name="user-age"
						id="user-age"
					/>
					<label
						className="otherLabels"
						htmlFor="user-pet">
						Pet:{" "}
					</label>
					<input
						onChange={onFormChange}
						className="inputClasses"
						placeholder={pet}
						type="text"
						name="user-pet"
						id="user-pet"
					/>
					<div className="saveAndCancelButtonsDiv">
						<button
							onClick={() => onProfileUpdate({ name, age, pet, url, handle })}
							className="saveButton">
							Save
						</button>
						<button
							className="cancelButton"
							onClick={closeModal}>
							Cancel
						</button>
					</div>
				</main>
				<div
					className="modal-close"
					onClick={closeModal}>
					&times;
				</div>
			</article>
		</div>
	);
};

export default Profile;
