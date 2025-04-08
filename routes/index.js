import express from "express";
import {
  initiateInstagramFlow,
  getAccessToken,
  getLongAccessToken,
  deleteUserData,
} from "../controllers/instagramController.js";
import { saveUserData } from "../controllers/user.js";

const router = express.Router();

router.get("/instagram/initiate", initiateInstagramFlow);
router.get("/instagram/access-token", getAccessToken);
router.get("/instagram/extend-token", getLongAccessToken);
router.get("/instagram/delete-data", deleteUserData);
router.get("/save-user", saveUserData);

export default router;
