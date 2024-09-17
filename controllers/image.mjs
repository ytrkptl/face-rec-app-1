import pkg from 'clarifai';
const { App, FACE_DETECT_MODEL } = pkg;

const app = new App({
  apiKey: process.env.CLARIFAI_API_KEY,
});

const handleApiCall = (req, res) => {
  app.models
    .predict(FACE_DETECT_MODEL, req.body.input)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => res.status(404).json(`unable to work with API ${err}`));
};

const handleImage = async (req, res, db) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      if (entries[0] === null) {
        throw new Error("Something went wrong");
      }
      res.json(entries[0]);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json("unable to get entries");
    });
};

export default {
  handleImage,
  handleApiCall,
};
