import Rank from "../Rank/Rank";
import UploadButtonWithPicker from "../UploadButtonWithPicker/UploadButtonWithPicker";
import FaceRecognition from "../FaceRecognition/FaceRecognition";

const RankAndImageFormWrapper = () => {
	return (
		<div className="rankAndImageFormWrapper">
			<Rank />
			<UploadButtonWithPicker />
			<FaceRecognition />
		</div>
	);
};

export default RankAndImageFormWrapper;
