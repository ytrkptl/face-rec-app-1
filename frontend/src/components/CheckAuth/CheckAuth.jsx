import { useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { firestore } from "@/services/firebase.utils";
import { useDispatch } from "react-redux";
import { newUpdateUserSignInStatus } from "@/redux/user/user.actions";
import { updateHasVerifiedEmail } from "@/redux/app/app.actions";
import { useAuth } from "@/hooks/useAuth";

const CheckAuth = () => {
	const { user, loading } = useAuth();
	const dispatch = useDispatch();

	useEffect(() => {
		if (user && !loading) {
			dispatch(updateHasVerifiedEmail(user.emailVerified));
			if (user.emailVerified) {
				// If email is verified, set up the user profile listener
				const ref = doc(firestore, "users", user.uid);
				const unsubscribe = onSnapshot(ref, (doc) => {
					const userObj = {
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
					const userProfileObj = doc.data();
					if (userProfileObj) {
						userObj.uid = userProfileObj.uid;
						userObj.displayName = userProfileObj.displayName;
						userObj.email = userProfileObj.email;
						userObj.entries = userProfileObj.entries;
						userObj.joined = userProfileObj.joined;
						userObj.pet = userProfileObj.pet;
						userObj.age = userProfileObj.age;
						userObj.handle = userProfileObj.handle;
						userObj.profilePhotoUrl = userProfileObj.profilePhotoUrl;
						dispatch(newUpdateUserSignInStatus(200, userObj));
					}
				});

				return () => {
					unsubscribe();
				};
			}
		} else if (!user && !loading) {
			dispatch(newUpdateUserSignInStatus(401, null));
		}
	}, [user, loading, dispatch]);

	return null;
};

export default CheckAuth;
