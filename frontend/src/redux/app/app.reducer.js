import AppTypes from "./app.types";

const INITIAL_STATE = {
	imageUrl: "",
	boxes: [],
	isSignedIn: false,
	isProfileOpen: false,
	lightningOn: false,
	hasVerifiedEmail: false
};

const AppReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case AppTypes.IMAGE_URL:
			return {
				...state,
				imageUrl: action.payload
			};
		case AppTypes.BOXES:
			return {
				...state,
				boxes: action.payload
			};
		case AppTypes.IS_SIGNED_IN:
			return {
				...state,
				isSignedIn: action.payload
			};
		case AppTypes.IS_PROFILE_OPEN:
			return {
				...state,
				isProfileOpen: action.payload
			};
		case AppTypes.IS_LIGHTNING_ON:
			return {
				...state,
				lightningOn: action.payload
			};
		case AppTypes.HAS_VERIFIED_EMAIL:
			return {
				...state,
				hasVerifiedEmail: action.payload
			};
		default:
			return state;
	}
};

export default AppReducer;
