import express from "express";
import {
  initiateInstagramFlow,
  getAccessToken,
  deleteUserData,
  fetchComments,
  replyToComment,
  fetchIGConversations,
  replyToIGMessage,
  publishIGPhoto,
  fetchAccountInsights,
  markHumanAgent,
  sendHumanAgentMessage,
  getMediaId
} from "../controllers/instagramController.js";

import {
  initiateFbLogin,
  getFbAccessToken,
} from "../controllers/fbController.js";

const router = express.Router();

router.get("/instagram/initiate", initiateInstagramFlow);
router.get("/instagram/callback", getAccessToken);
router.get("/instagram/delete-data", deleteUserData);
router.get("/instagram/get-media", getMediaId);
router.get("/instagram/fetch-comments", fetchComments);
router.get("/instagram/reply-to-comment", replyToComment);
router.get("/instagram/fetch-ig-conversations", fetchIGConversations);
router.get("/instagram/reply-to-ig-message", replyToIGMessage);
router.get("/instagram/publish-ig-photo", publishIGPhoto);
router.get("/instagram/fetch-account-insights", fetchAccountInsights);
router.get("/instagram/mark-human-agent", markHumanAgent);
router.get("/instagram/send-human-agent-message", sendHumanAgentMessage);
router.get("/facebook/login", initiateFbLogin);
router.get("/facebook/callback", getFbAccessToken);

export default router;
