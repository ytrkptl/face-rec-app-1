import { Router } from "express";
import bcrypt from "bcryptjs";
import registerStepOne from "../controllers/register/register-step-1.mjs";
import registerStepTwo from "../controllers/register/register-step-2.mjs";
import signin from "../controllers/signin.mjs";
import forgot from "../controllers/forgot/forgot-step1.mjs";
import reset from "../controllers/forgot/forgot-step2.mjs";
import updateNewPassword from "../controllers/forgot/forgot-step3.mjs";
import profile from "../controllers/profile.mjs";
import image from "../controllers/image.mjs";
import auth from "../controllers/authorization.mjs";
import signout from "../controllers/signout.mjs";
// import subscribe from "../controllers/mailchimp.mjs";
import {db} from "../db/index.mjs";

const router = Router();

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

// router.post("/api/subscribe", (req, res) => {
//   subscribe.handleSubscribe(req, res);
// });

export default router;
