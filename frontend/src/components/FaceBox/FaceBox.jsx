const FaceBox = ({ box }) => {
	const { x, y, width, height } = box;
	return (
		<div
			style={{
				position: "absolute",
				top: y,
				left: x,
				width: width,
				height: height,
				boxShadow: `0 0 0 3px #149df2 inset`
			}}></div>
	);
};

export default FaceBox;
