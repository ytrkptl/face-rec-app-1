import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/services/firebase.utils";

export const useAuth = () => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(
			auth,
			async (currentUser) => {
				if (currentUser) {
					// Force token refresh to get the latest emailVerified status
					await currentUser.reload();
					// Get the refreshed user object
					const refreshedUser = auth.currentUser;
					setUser(refreshedUser);
				} else {
					setUser(null);
				}
				setLoading(false);
			},
			(error) => {
				//console.log(error);
				setLoading(false);
			}
		);

		return () => {
			unsubscribe();
			setUser(null);
			setLoading(false);
		};
	}, []);

	return { user, loading };
};
