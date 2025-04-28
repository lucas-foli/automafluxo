import express from "express";
import {
  initiateInstagramFlow,
  getAccessToken,
  deleteUserData,
} from "../controllers/instagramController.js";

import { initiateFbLogin, getFbAccessToken } from "../controllers/fbController.js";

const router = express.Router();

router.get("/instagram/initiate", initiateInstagramFlow);
router.get("/instagram/callback", getAccessToken);
router.get("/instagram/delete-data", deleteUserData);
router.get("/facebook/login", initiateFbLogin);
router.get("/facebook/callback", getFbAccessToken);

export default router;
