import React, { useState } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import "./ProfileIcon.css";

const ProfileIcon = ({ profilePhotoUrl, toggleModal, signOut }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  return (
    <div className="dropdownParentDiv">
      <Dropdown isOpen={dropdownOpen} toggle={toggle}>
        <DropdownToggle
          tag="span"
          data-toggle="dropdown"
          aria-expanded={dropdownOpen}
        >
          <img className="homeAvatarImage" src={profilePhotoUrl} alt="avatar" />
        </DropdownToggle>
        <DropdownMenu
          right
          className="dropdownMenuStyle"
          /*needed to inject some styles directly*/
          style={{
            marginTop: "10px",
            right: 0,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
          }}
        >
          <DropdownItem onClick={() => toggleModal()}>
            View Profile
          </DropdownItem>
          <DropdownItem onClick={() => signOut()}>Sign Out</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default ProfileIcon;
