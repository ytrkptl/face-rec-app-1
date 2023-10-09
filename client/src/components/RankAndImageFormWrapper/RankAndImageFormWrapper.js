import Rank from '../Rank/Rank'
import UploadButtonWithPicker from '../UploadButtonWithPicker/UploadButtonWithPicker';
import FaceRecognition from '../FaceRecognition/FaceRecognition';

const RankAndImageFormWrapper = ({ name, entries, changeImageUrl, client , boxes, imageUrl}) => {
  return (
    <div className="rankAndImageFormWrapper">
    <Rank name={name} entries={entries} />
    <UploadButtonWithPicker
      changeImageUrl={changeImageUrl}
      client={client}
    />
    <FaceRecognition boxes={boxes} imageUrl={imageUrl} />
  </div>
  )
}

export default RankAndImageFormWrapper