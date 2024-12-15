import React, { useState } from "react";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import "./ProfileIcon.css";
import { useDispatch, useSelector } from "react-redux";
import { updateProfileOpen } from "@/redux/app/app.actions";
import { selectUserProfilePhotoUrl } from "@/redux/user/user.selectors";
import { newUpdateUserSignInStatus } from "@/redux/user/user.actions";
import { signOutFromFirebase } from "@/services/firebase.utils";

const ProfileIcon = () => {
	const profilePhotoUrl = useSelector(selectUserProfilePhotoUrl);
	const dispatch = useDispatch();

	const [dropdownOpen, setDropdownOpen] = useState(false);

	const toggle = () => setDropdownOpen((prevState) => !prevState);

	const signOut = async () => {
		await signOutFromFirebase();
		dispatch(newUpdateUserSignInStatus(401, null));
	};

	const openProfileModal = () => {
		dispatch(updateProfileOpen(true));
	};

	return (
		<div className="dropdownParentDiv">
			<Dropdown
				isOpen={dropdownOpen}
				toggle={toggle}>
				<DropdownToggle
					tag="span"
					data-toggle="dropdown"
					aria-expanded={dropdownOpen}>
					<img
						className="homeAvatarImage"
						src={profilePhotoUrl}
						alt="avatar"
					/>
				</DropdownToggle>
				<DropdownMenu
					end
					className="dropdownMenuStyle"
					/*needed to inject some styles directly*/
					style={{
						marginTop: "10px",
						right: 0,
						backgroundColor: "rgba(255, 255, 255, 0.8)"
					}}>
					<DropdownItem onClick={openProfileModal}>View Profile</DropdownItem>
					<DropdownItem onClick={() => signOut()}>Sign Out</DropdownItem>
				</DropdownMenu>
			</Dropdown>
		</div>
	);
};

export default ProfileIcon;
