import { combineReducers } from "redux";

import AppReducer from "./app/app.reducer";
import UserReducer from "@/redux/user/user.reducer";

// https://stackoverflow.com/questions/35622588/how-to-reset-the-state-of-a-redux-store
const rootReducer = combineReducers({
	/* your app’s top-level reducers */
	app: AppReducer,
	user: UserReducer
});

export default rootReducer;
