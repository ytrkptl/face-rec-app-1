import React from "react";
import FaceBox from "@/components/FaceBox/FaceBox";
import "./FaceRecognition.css";
import { selectBoxes, selectImageUrl } from "@/redux/app/app.selectors";
import { useSelector } from "react-redux";

const FaceRecognition = () => {
	const imageUrl = useSelector(selectImageUrl);
	const boxes = useSelector(selectBoxes);

	return (
		<div className="centerFaceRec">
			<div className="absoluteDiv">
				<img
					id="inputimage"
					alt=""
					width="100%"
					height="auto"
					className="inputImage"
					src={imageUrl}
				/>
        {
          boxes.map((box, i)=> {
            return <FaceBox key={i} box={box} />
          })
        }
			</div>
		</div>
	);
};

export default FaceRecognition;
