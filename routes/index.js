const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const registerStepOne = require("../controllers/register/register-step-1");
const registerStepTwo = require("../controllers/register/register-step-2");
const signin = require("../controllers/signin");
const forgot = require("../controllers/forgot/forgot-step1");
const reset = require("../controllers/forgot/forgot-step2");
const updateNewPassword = require("../controllers/forgot/forgot-step3");
const profile = require("../controllers/profile");
const image = require("../controllers/image");
const auth = require("../controllers/authorization");
const signout = require("../controllers/signout");
const subscribe = require("../controllers/mailchimp");
const db = require("../db");

router.get("/favicon.ico", (req, res) => res.status(204));

router.get("/api", (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL}`);
});

router.post("/api/signin", signin.signinAuthentication(db, bcrypt));

router.post("/api/register-step-1", (req, res) =>
  registerStepOne.handleRegisterWithEmail(db, bcrypt, req, res)
);

router.post("/api/register-step-2", (req, res) =>
  registerStepTwo.registerAuthentication(req, res)
);

router.post("/api/forgot", (req, res) => {
  forgot.handleForgotPassword(db, req, res);
});

router.post("/api/reset", (req, res) => {
  reset.handleResetId(req, res);
});

router.post("/api/update-new-password", (req, res) => {
  updateNewPassword.handleUpdateNewPassword(req, res, db, bcrypt);
});

router.get("/api/profile/:id", auth.requireAuth, (req, res) => {
  profile.handleProfileGet(req, res, db);
});

router.post("/api/profile/:id", auth.requireAuth, (req, res) => {
  profile.handleProfileUpdate(req, res, db);
});

router.post("/api/upload/:id", auth.requireAuth, (req, res) => {
  profile.handleProfilePhoto(req, res, db);
});

router.put("/api/image", auth.requireAuth, (req, res) => {
  image.handleImage(req, res, db);
});

router.post("/api/imageurl", auth.requireAuth, (req, res) => {
  image.handleApiCall(req, res);
});

router.delete("/api/signout", (req, res) => {
  signout.removeAuthToken(req, res);
});

router.post("/api/subscribe", (req, res) => {
  subscribe.handleSubscribe(req, res);
});

module.exports = router;
