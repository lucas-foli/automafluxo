import express from "express";
import { initiateInstagramFlow } from "../controllers/instagramController.js";

const router = express.Router();

router.get("/instagram/initiate", initiateInstagramFlow);

export default router;
