import { getApp, initializeApp } from "firebase/app";
import {
	connectAuthEmulator,
	createUserWithEmailAndPassword,
	getAuth,
	sendEmailVerification,
	signInWithEmailAndPassword,
	signOut,
	setPersistence,
	browserLocalPersistence
} from "firebase/auth";
import { addDoc, collection, connectFirestoreEmulator, doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import { connectStorageEmulator, ref, getDownloadURL, getStorage, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

// One thing to note, is that we will be
// adding a config object that we get from firebase into our
// files, and in that config object is an API key. Typically,
// it is good practice not to expose your API key publicly,
// but in the case of firebase, we have to do so because
// this is how firebase knows the application is ours! This
// is perfectly safe, and the intended purpose of this public
// API key. If you commit your code to GitHub, you may get a
// warning from GitGuardian having caught a Google key, but
// GitGuardian has acknowledged that this is not an issue here!

// How we do secure out data is actually done with security rules
// in the firebase dashboard.

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Note: Use a different firebase project in Production.

function createFirebaseApp(config) {
	try {
		return getApp();
	} catch {
		return initializeApp(config);
	}
}

// Initialize Firebase
const firebaseApp = createFirebaseApp(firebaseConfig);

export const firestore = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);
export const functions = getFunctions(firebaseApp);
export const storage = getStorage(firebaseApp);

// Create a user profile document in the database
export const createUserProfileDocument = async (userAuth, additionalData) => {
	if (!userAuth) return;

	// Reference to the specific user document
	const userRef = doc(firestore, "users", userAuth.uid);
	// Fetch the user document
	const snapShot = await getDoc(userRef);

	if (snapShot.exists()) {
		console.error("Error creating user");
	} else {
		const { displayName, email } = userAuth;
		// save a human-readable date
		const date = new Date();
		const options = { year: "numeric", month: "short", day: "numeric" };
		const joined = date.toLocaleDateString("en-US", options); // "Oct. 24, 2024"

		await setDoc(userRef, {
			displayName,
			email,
			joined,
			...additionalData
		});
	}

	return userRef;
};

export const getUserProfileDocument = async (userUid) => {
	const userRef = doc(firestore, "users", userUid);
	const snapShot = await getDoc(userRef);
	return snapShot.data();
};

// Update the user profile document in the database.
export const updateUserProfile = async (userUid, data) => {
	try {
		const userRef = doc(firestore, "users", userUid);
		await setDoc(userRef, data, { merge: true });
	} catch (error) {
		console.error("Error updating user profile", error.message);
	}
};

export const updateEntriesInFirebase = async () => {
	try {
		if (!auth || !auth.currentUser) {
			return;
		}
		const profileDocument = await getUserProfileDocument(auth.currentUser.uid);
		const userUid = auth.currentUser.uid;
		const entries = profileDocument.entries + 1;
		const userRef = doc(firestore, "users", userUid);
		await setDoc(userRef, { entries }, { merge: true });
	} catch (error) {
		console.error("Error updating user entries", error.message);
	}
};

// Sign in with email and password.
export const signInWithCredentialsWrapper = async (email, password) => {
	try {
		return await signInWithEmailAndPassword(auth, email, password);
	} catch (error) {
		if (error.message === "Firebase: Error (auth/user-not-found).") {
			throw new Error("The email/password combination is incorrect.");
		} else {
			throw new Error("Something went wrong. Please try again or contact support.");
		}
	}
};

// Sign up with email and password.
export const signUpWithCredentialsWrapper = async (email, password) => {
	try {
		const data = await createUserWithEmailAndPassword(auth, email, password);
		return data.user;
	} catch (error) {
		if (error.message === "Firebase: Error (auth/email-already-in-use).") {
			throw new Error("The email/password combination is incorrect.");
		} else {
			throw new Error("Something went wrong. Please try again or contact support.");
		}
	}
};

// Send registration verification email.
export const sendRegistrationVerificationEmail = async (user) => {
	try {
		return await sendEmailVerification(user);
	} catch (error) {
		console.error("Error verifying confirmation code:", error);
		return false;
	}
};

// Sign out from Firebase.
export const signOutFromFirebase = async () => {
	return await signOut(auth);
};

// Upload image to Firebase Storage.
export const uploadImageToFirebaseStorage = async (file) => {
	try {
		const fileName = file.name || uuidv4();
		const storageRef = ref(storage, `images/${auth.currentUser.uid}/${fileName}`);
		// ensure the file gets a unique name
		await uploadBytes(storageRef, file);
		return await getDownloadURL(storageRef);
	} catch (error) {
		console.error("Error uploading image:", error);
	}
};

export const saveCoordinatesInFirestore = async (imageUrl, data) => {
	if (!auth.currentUser) {
		throw new Error('User must be authenticated to save coordinates');
	}
	try {
		const coordinatesCollection = collection(firestore, 'imageCoordinates');
    
    // Create a new document with the current timestamp and user ID
    const coordinatesData = {
      userId: auth.currentUser.uid,
      imageUrl, // Array of image URLs
      coordinates: data, // Object containing coordinates
      timestamp: new Date().toISOString()
    };

    // Add the document to the collection
    const docRef = await addDoc(coordinatesCollection, coordinatesData);
    return docRef.id;
  } catch (error) {
    console.error('Error saving coordinates:', error);
    throw error;
  }
};

// Function to handle logging errors coming from the client side to firestore only
// if the user is signed in
export const logToFirestore = async (message, level = "client", context = {}) => {
	if (!auth || !auth.currentUser) {
		return;
	}
	try {
		// Reference to the specific collection
		const collectionRef = collection(firestore, "errors");

		// Add a new document with a generated id.

		await addDoc(collectionRef, { message, level, context, timestamp: new Date().toISOString() });
	} catch (error) {
		console.error("Error logging client error:", error);
	}
};

// Emulator setup
function startEmulators() {
	connectAuthEmulator(auth, "http://localhost:9099");
	connectFirestoreEmulator(firestore, "localhost", 8080);
	connectFunctionsEmulator(functions, "127.0.0.1", 5001);
	connectStorageEmulator(storage, "localhost", 9199);
}

if (import.meta.env.MODE !== "production" || process.env.API_RUNNING === "true") {
	startEmulators();
}

setPersistence(auth, browserLocalPersistence).catch((error) => {
	console.error("Error setting local persistence:", error);
});

// export const googleProvider = new firebase.auth.GoogleAuthProvider();
// googleProvider.setCustomParameters({ prompt: "select_account" });
// export const signInWithGoogle = () => auth.signInWithPopup(googleProvider);

export default firebaseApp;
