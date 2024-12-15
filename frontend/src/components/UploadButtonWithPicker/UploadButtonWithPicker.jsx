import React from "react";
import "./UploadButtonWithPicker.css";
import { useDispatch } from "react-redux";
import {
	uploadImageToFirebaseStorage,
	updateEntriesInFirebase,
	logToFirestore,
	saveCoordinatesInFirestore
} from "@/services/firebase.utils";
import { updateImageUrl } from "@/redux/app/app.actions";
import * as filestack from "filestack-js";
import { updateBoxes } from "@/redux/app/app.actions";
import { useSelector } from "react-redux";
import { selectImageUrl } from "@/redux/app/app.selectors";

const filestackClient = filestack.init(`${import.meta.env.VITE_FILESTACK_API_KEY}`);
if (!filestackClient) {
	throw new Error("VITE_FILESTACK_API_KEY environment variable is not defined");
}

const UploadButtonWithPicker = () => {
	const dispatch = useDispatch();
	const imageUrl = useSelector(selectImageUrl);

	const options = {
		maxFiles: 1,
		uploadInBackground: false,
		accept: ["image/jpeg", "image/png"],
		fromSources: ["local_file_system", "url", "imagesearch"],
		onOpen: () => {},
		onUploadDone: (res) => uploadToFilestack(res)
	};

	const uploadToFilestack = async (fileStackData) => {
		try {
			const ww = window.innerWidth;
			if (fileStackData) {
				const HANDLE = fileStackData.filesUploaded[0].handle;
				const resp = await fetch(`https://cdn.filestackcontent.com/imagesize/${HANDLE}`, {
					method: "GET"
				});
				const data = await resp.json();
				const height = data.height;
				const width = data.width;
				let widthToUse, heightToUse;
				// check if image is portrait
				if (height > width) {
					// do following to check device's width to send apprpopriate and
					// more dynamic parameters to FileStack
					widthToUse = ww > 650 ? 400 : Math.round(ww * 0.9);
					heightToUse = ww > 650 ? 600 : Math.round(widthToUse * 1.5);
				}
				// check if image is landscape
				else if (height < width) {
					// do following to check device's width to send apprpopriate and
					// more dynamic parameters to FileStack
					widthToUse = ww > 650 ? 600 : Math.round(ww * 0.9);
					heightToUse = ww > 650 ? 400 : Math.round(widthToUse * 0.67);
				}
				// else return a square image
				else {
					// do following to check device's width to send apprpopriate and
					// more dynamic parameters to FileStack
					widthToUse = ww > 600 ? 600 : Math.round(ww * 0.9);
					heightToUse = widthToUse;
				}
				await processImage(HANDLE, widthToUse, heightToUse);
			}
		} catch (error) {
			console.log(`error in uploadButtonWithPicker in "resizeAndDetectFaces" line 76`);
			await logToFirestore("Failed to upload image to filestack", "error", { error });
		}
	};

	async function processImage(HANDLE, widthToUse, heightToUse) {
		try {
			// Step 1: Get image data and face detection in parallel
			const [file, facesData] = await Promise.all([
				getImageDataFromFilestack(HANDLE, widthToUse, heightToUse),
				getFacesFromFilestack(HANDLE, widthToUse, heightToUse)
			]);

			// Step 2: Upload to Firebase and get URL
			const downloadUrl = await uploadImageToFirebaseStorage(file);

			// Step 3: Update state and save data
			dispatch(updateImageUrl(downloadUrl));
			dispatch(updateBoxes(facesData));

			// Step 4: Save to Firestore with the correct URL
			await Promise.all([updateEntriesInFirebase(), saveCoordinatesInFirestore(downloadUrl, facesData)]);
		} catch (error) {
			await logToFirestore("Failed to process image", "error", { error });
		}
	}

	async function getImageDataFromFilestack(handle, widthToUse, heightToUse) {
		try {
			const response = await fetch(
				`https://cdn.filestackcontent.com/resize=height:${heightToUse},width:${widthToUse}/${handle}`,
				{
					method: "GET"
				}
			);
			const url = response.url;
			return await fetch(url).then((r) => r.blob());
		} catch (error) {
			await logToFirestore("Failed to get image data from filestack", "error", { error });
		}
	}

	async function getFacesFromFilestack(handle, widthToUse, heightToUse) {
		try {
			const response = await fetch(
				`https://cdn.filestackcontent.com/resize=height:${heightToUse},width:${widthToUse}/detect_faces=export:true/${handle}`,
				{
					method: "GET"
				}
			);
			return await response.json();
		} catch (error) {
			await logToFirestore("Failed to detect faces from filestack", "error", { error });
		}
	}

	return (
		<button
			className="fileUploadButton"
			onClick={() => filestackClient.picker(options).open()}>
			Upload an image
		</button>
	);
};

export default UploadButtonWithPicker;
