import "./FaceRecognition.css";

const FaceRecognition = ({ imageUrl, boxes }) => {
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
        {boxes.map((box) => {
          return (
            <div
              key={box.topRow}
              className="bounding-box"
              style={{
                top: box.topRow,
                right: box.rightCol,
                bottom: box.bottomRow,
                left: box.leftCol
              }}></div>
          );
        })}
      </div>
    </div>
  );
};

export default FaceRecognition;
