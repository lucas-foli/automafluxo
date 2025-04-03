import express from "express";
import {
  initiateInstagramFlow,
  getAccessToken,
  getLongAccessToken,
} from "../controllers/instagramController.js";

const router = express.Router();

router.get("/instagram/initiate", initiateInstagramFlow);
router.get("/instagram/access-token", getAccessToken);
router.get("/instagram/extend-token", getLongAccessToken);

export default router;
