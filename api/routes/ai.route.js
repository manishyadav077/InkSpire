import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { generateTitle, refineContent } from "../controllers/ai.controller.js";

const router = express.Router();

router.post("/generate-title", verifyToken, generateTitle);
router.post("/refine-content", verifyToken, refineContent);

export default router;
