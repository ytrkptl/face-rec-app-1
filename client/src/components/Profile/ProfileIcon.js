import React, { useState, useEffect } from 'react';
import {
	Dropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem
} from 'reactstrap';
import './ProfileIcon.css';

// class ProfileIcon extends React.Component {
// 	constructor(props) {
// 		super(props);
// 		this.state = {
// 			dropdownOpen: false,
// 		}
// 	}

// 	componentDidUpdate() {
// 		console.log('received')
// 	}


// 	toggle = () => {
// 		this.setState(prevState => ({
// 			dropdownOpen: !prevState.dropdownOpen
// 		}));
// 	}

// 	render() {
// 		const { profilePhotoUrl } = this.props;
// 		return (
// 			<div className="dropdownParentDiv">
// 				<Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
// 					<DropdownToggle
// 						tag="span"
// 						data-toggle="dropdown"
// 						aria-expanded={this.state.dropdownOpen}>
// 						<img
// 							className="homeAvatarImage"
// 							src={profilePhotoUrl}
// 							alt="avatar" />
// 					</DropdownToggle>
// 					<DropdownMenu
// 						right
// 						className="dropdownMenuStyle"
// 						/*needed to inject some styles directly*/
// 						style={{ marginTop: '10px', right: 0, backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
// 						<DropdownItem onClick={() => this.props.toggleModal()}>View Profile</DropdownItem>
// 						<DropdownItem onClick={() => this.props.onRouteChange('signout')}>Sign Out</DropdownItem>
// 					</DropdownMenu>
// 				</Dropdown>
// 			</div>
// 		);
// 	}
// }

const ProfileIcon = ({ profilePhotoUrl, toggleModal, onRouteChange }) => {

	const [dropdownOpen, setDropdownOpen] = useState(false);

	const toggle = () => setDropdownOpen(prevState => !prevState);

	useEffect(() => {
		console.log(profilePhotoUrl)
	}, [profilePhotoUrl])

	return (
		<div className="dropdownParentDiv">
			<Dropdown isOpen={dropdownOpen} toggle={toggle}>
				<DropdownToggle
					tag="span"
					data-toggle="dropdown"
					aria-expanded={dropdownOpen}>
					<img
						className="homeAvatarImage"
						src={profilePhotoUrl}
						alt="avatar" />
				</DropdownToggle>
				<DropdownMenu
					right
					className="dropdownMenuStyle"
					/*needed to inject some styles directly*/
					style={{ marginTop: '10px', right: 0, backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
					<DropdownItem onClick={() => toggleModal()}>View Profile</DropdownItem>
					<DropdownItem onClick={() => onRouteChange('signout')}>Sign Out</DropdownItem>
				</DropdownMenu>
			</Dropdown>
		</div>
	)

}



export default ProfileIcon;