import express from "express";
import {
  registerVolunteer,
  loginVolunteer,
  logoutVolunteer,
  getVolunteerProfile,
  editVolunteerProfile,
  updateJoinEvent,
  joinEvent
} from "../controllers/volunteer.controller.js";

import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.route("/register").post(registerVolunteer);
router.route("/login").post(loginVolunteer);
router.route("/logout").get(logoutVolunteer);
router.route("/:id/profile").get(isAuthenticated, getVolunteerProfile);
router.route("/profile/edit").post(isAuthenticated, upload.single("profileImage"), editVolunteerProfile);
router.post('/:eventId/join', isAuthenticated, joinEvent);
router.route("/joinEvent/:eventId").get(isAuthenticated,updateJoinEvent);

export default router;
