import { compose } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { NODE_ENV } from "@/config/index";
import rootReducer from "@/redux/root-reducer";

// Custom middleware to sanitize or filter actions
const actionSanitizerMiddleware = (storeAPI) => (next) => (action) => {
	// Ignore Firebase-related actions or any other unwanted actions
	if (action.type.startsWith("@auth")) {
		console.debug("Filtered out Firebase action:", action);
		return;
	}

	// Otherwise, pass the action along
	return next(action);
};

const composeEnhancers =
	(NODE_ENV === "development" && typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
	compose;

function initStore(preloadedState) {
	return configureStore({
		reducer: rootReducer,
		middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(actionSanitizerMiddleware),
		preloadedState,
		devTools: NODE_ENV === "development",
		composeEnhancers
	});
}

export const store = initStore();
