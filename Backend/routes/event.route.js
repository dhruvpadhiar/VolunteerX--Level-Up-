import express from "express";
import { getAllEvent } from "../controllers/event.controller.js";


const router = express.Router();

router.route("/getAllEvent").get(getAllEvent);

export default router;