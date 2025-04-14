import express from "express";
import {
  initiateInstagramFlow,
  getAccessToken,
  deleteUserData,
} from "../controllers/instagramController.js";
import { saveUser } from "../controllers/user.js";

const router = express.Router();

router.get("/instagram/initiate", initiateInstagramFlow);
router.get("/instagram/callback", getAccessToken);
router.get("/instagram/delete-data", deleteUserData);
router.get("/save-user", saveUser);

export default router;
