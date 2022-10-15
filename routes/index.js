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

router.get("/", (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL}`);
});

router.post("/signin", signin.signinAuthentication(db, bcrypt));

router.post("/register-step-1", (req, res) =>
  registerStepOne.handleRegisterWithEmail(db, bcrypt, req, res)
);

router.post("/register-step-2", (req, res) =>
  registerStepTwo.registerAuthentication(req, res)
);

router.post("/forgot", (req, res) => {
  forgot.handleForgotPassword(db, req, res);
});

router.post("/reset", (req, res) => {
  reset.handleResetId(req, res);
});

router.post("/update-new-password", (req, res) => {
  updateNewPassword.handleUpdateNewPassword(req, res, db, bcrypt);
});

router.get("/profile/:id", auth.requireAuth, (req, res) => {
  profile.handleProfileGet(req, res, db);
});

router.post("/profile/:id", auth.requireAuth, (req, res) => {
  profile.handleProfileUpdate(req, res, db);
});

router.post("/upload/:id", auth.requireAuth, (req, res) => {
  profile.handleProfilePhoto(req, res, db);
});

router.put("/image", auth.requireAuth, (req, res) => {
  image.handleImage(req, res, db);
});

router.post("/imageurl", auth.requireAuth, (req, res) => {
  image.handleApiCall(req, res);
});

router.delete("/signout", (req, res) => {
  signout.removeAuthToken(req, res);
});

router.post("/subscribe", (req, res) => {
  subscribe.handleSubscribe(req, res);
});

module.exports = router;
