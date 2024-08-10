import { Router } from "express";
import bcrypt from "bcryptjs";
import registerStepOne from "../controllers/register/register-step-1.js";
import registerStepTwo from "../controllers/register/register-step-2.js";
import signin from "../controllers/signin.js";
import forgot from "../controllers/forgot/forgot-step1.js";
import reset from "../controllers/forgot/forgot-step2.js";
import updateNewPassword from "../controllers/forgot/forgot-step3.js";
import profile from "../controllers/profile.js";
import image from "../controllers/image.js";
import auth from "../controllers/authorization.js";
import signout from "../controllers/signout.js";
import subscribe from "../controllers/mailchimp.js";
import {db} from "../db/index.mjs";

const router = Router();

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

export default router;
