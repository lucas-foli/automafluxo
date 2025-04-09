import express from "express";
import {
  initiateInstagramFlow,
  getAccessToken,
  deleteUserData,
} from "../controllers/instagramController.js";

const router = express.Router();

router.get("/instagram/initiate", initiateInstagramFlow);
router.get("/instagram/access-token", getAccessToken);
router.get("/instagram/delete-data", deleteUserData);

export default router;
