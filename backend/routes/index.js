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
  getMediaId,
  fetchUser,
  getCommentByID,
  fetchMessage,
} from "../controllers/instagramController.js";

import {
  initiateFbLogin,
  getFbAccessToken,
} from "../controllers/fbController.js";

const router = express.Router();

router.get("/instagram/initiate", initiateInstagramFlow);
router.get("/instagram/callback", getAccessToken);
router.get("/instagram/fetch-user-info", fetchUser);
router.post("/instagram/delete", deleteUserData);
router.get("/instagram/get-media", getMediaId);
router.get("/instagram/fetch-comments", fetchComments);
router.get("/instagram/get-comment-by-id", getCommentByID);
router.get("/instagram/fetch-ig-conversations", fetchIGConversations);
router.get("/instagram/fetch-message", fetchMessage);
router.post("/instagram/reply-to-ig-message", replyToIGMessage);
router.get("/instagram/publish-ig-photo", publishIGPhoto);
router.get("/instagram/fetch-account-insights", fetchAccountInsights);
router.get("/instagram/mark-human-agent", markHumanAgent);
router.get("/instagram/send-human-agent-message", sendHumanAgentMessage);
router.post("/instagram/reply-comment", replyToComment);
router.get("/facebook/login", initiateFbLogin);
router.get("/facebook/callback", getFbAccessToken);
// router.get("/whatsapp/fetch", fetchWppMessages);

export default router;
