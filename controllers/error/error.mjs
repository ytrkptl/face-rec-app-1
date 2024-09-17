const errorHandler = async (error, req, res, next) => {
  let doc = {
    messageForLog: error.messageForLog,
    messageSent: error.message,
  };
  console.log(doc)
  // for cases when we want to send success message despite of error
  // in backend.
  if (error.status === 200) {
    return res.status(200).json(error.message);
  }
  return res.status(error.status || 500).json({
    error: {
      message: error.message || "Oops! Something went wrong.",
    },
  });
};

export default errorHandler;
