import "./UploadButtonWithPicker.css";

const UploadButtonWithPicker = ({ changeImageUrl, client }) => {
  const options = {
    maxFiles: 1,
    uploadInBackground: false,
    onOpen: () => {},
    onUploadDone: (res) => someFunction(res)
  };

  const someFunction = async (someObject) => {
    try {
      let ww = window.innerWidth;
      if (someObject) {
        let HANDLE = someObject.filesUploaded[0].handle;
        const resp = await fetch(`https://cdn.filestackcontent.com/imagesize/${HANDLE}`, {
          method: "GET"
        });
        const data = await resp.json();
        let height = data.height;
        let width = data.width;
        let widthToUse, heightToUse;
        // check if image is portrait
        if (height > width) {
          // do following to check device's width to send apprpopriate and
          // more dynamic parameters to FileStack
          ww > 650 ? (widthToUse = 400) : (widthToUse = Math.round(ww * 0.9));
          ww > 650 ? (heightToUse = 600) : (heightToUse = Math.round(widthToUse * 1.5));
          try {
            const resp2 = await fetch(
              `https://cdn.filestackcontent.com/resize=height:${heightToUse},width:${widthToUse}/${HANDLE}`,
              {
                method: "GET"
              }
            );
            const url = resp2.url;
            changeImageUrl(url);
          } catch (error) {
            console.log(error);
            console.log(`error in uploadButtonWithPicker in "someFunction" line 40`);
          }
        }
        // check if image is landscape
        else if (height < width) {
          // do following to check device's width to send apprpopriate and
          // more dynamic parameters to FileStack
          ww > 650 ? (widthToUse = 600) : (widthToUse = Math.round(ww * 0.9));
          ww > 650 ? (heightToUse = 400) : (heightToUse = Math.round(widthToUse * 0.67));
          try {
            const resp3 = await fetch(
              `https://cdn.filestackcontent.com/resize=height:${heightToUse},width:${widthToUse}/${HANDLE}`,
              {
                method: "GET"
              }
            );
            const url = resp3.url;
            changeImageUrl(url);
          } catch (error) {
            console.log(error);
            console.log(`error in uploadButtonWithPicker in "someFunction" line 57`);
          }
        }
        // else return a square image
        else {
          // do following to check device's width to send apprpopriate and
          // more dynamic parameters to FileStack
          ww > 600 ? (widthToUse = 600) : (widthToUse = Math.round(ww * 0.9));
          heightToUse = widthToUse;
          try {
            const resp4 = await fetch(
              `https://cdn.filestackcontent.com/resize=height:${heightToUse},width:${widthToUse}/${HANDLE}`,
              {
                method: "GET"
              }
            );
            const url = resp4.url;
            changeImageUrl(url);
          } catch (error) {
            if (import.meta.env.MODE === "development") {
              console.log(error);
            }
            console.log(`error in uploadButtonWithPicker in "someFunction" line 73`);
          }
        }
      }
    } catch (error) {
      if (import.meta.env.MODE === "development") {
        console.log(error);
      }
      console.log(`error in uploadButtonWithPicker in "someFunction" line 76`);
    }
  };

  return (
    <button
      className="fileUploadButton"
      onClick={() => client.picker(options).open()}>
      Upload an image
    </button>
  );
};

export default UploadButtonWithPicker;
