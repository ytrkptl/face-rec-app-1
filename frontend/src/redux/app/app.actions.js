import { makeActionCreator } from "../make-action-creator";
import AppTypes from "./app.types";

export const updateImageUrl = makeActionCreator(AppTypes.IMAGE_URL, "payload");

export const updateBoxes = makeActionCreator(AppTypes.BOXES, "payload");

export const updateSignInStatus = makeActionCreator(AppTypes.IS_SIGNED_IN, "payload");

export const updateProfileOpen = makeActionCreator(AppTypes.IS_PROFILE_OPEN, "payload");

export const updateLightningOn = makeActionCreator(AppTypes.IS_LIGHTNING_ON, "payload");

export const updateHasVerifiedEmail = makeActionCreator(AppTypes.HAS_VERIFIED_EMAIL, "payload");

export const resetAppState = () => (dispatch) => {
	dispatch(updateImageUrl(""));
	dispatch(updateBoxes([]));
	dispatch(updateSignInStatus(false));
	dispatch(updateProfileOpen(false));
	dispatch(updateLightningOn(false));
	dispatch(updateHasVerifiedEmail(false));
};
