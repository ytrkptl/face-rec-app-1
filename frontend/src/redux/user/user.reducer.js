import UserTypes from "./user.types";

export const USER_INITIAL_STATE = {
	uid: "",
	displayName: "",
	email: "",
	entries: 0,
	joined: "",
	pet: "",
	age: 30,
	handle: "",
	profilePhotoUrl: ""
};

const UserReducer = (state = USER_INITIAL_STATE, action) => {
	switch (action.type) {
		case UserTypes.UPDATE_USER:
			return {
				...state,
				...action.payload
			};
		default:
			return state;
	}
};

export default UserReducer;
