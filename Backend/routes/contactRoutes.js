import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  createContactMessage,
  getAllMessages,
  markAsRead,
  deleteMessage,
} from "../controllers/contactController.js";

const router = express.Router();

router.post("/", createContactMessage);       // Public - website form
router.get("/", verifyToken, getAllMessages); // Admin only
router.patch("/:id/read", verifyToken, markAsRead); // Admin only
router.delete("/:id", verifyToken, deleteMessage);  // Admin only

export default router;