import { resetAppState, updateSignInStatus } from "@/redux/app/app.actions";
import { USER_INITIAL_STATE } from "./user.reducer";
import UserTypes from "./user.types";

export const updateUser = (user) => ({
	type: UserTypes.UPDATE_USER,
	payload: user
});

export const newUpdateUserSignInStatus = (status, data) => (dispatch) => {
	if (status === 200) {
		dispatch(updateUser(data));
		dispatch(updateSignInStatus(true));
	} else {
		dispatch(updateSignInStatus(false));
		dispatch(updateUser(USER_INITIAL_STATE));
		dispatch(resetAppState());
	}
};
