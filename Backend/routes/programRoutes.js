import express from "express";
import upload from "../middleware/upload.js";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  getPrograms,
  getProgram,
  addProgram,
  editProgram,
  removeProgram,
} from "../controllers/programController.js";

const router = express.Router();

router.get("/", getPrograms);              // GET    /api/programs (public)
router.get("/:id", getProgram);            // GET    /api/programs/:id (public)
router.post("/", verifyToken, upload.single("image"), addProgram);       // Admin only
router.put("/:id", verifyToken, upload.single("image"), editProgram);    // Admin only
router.delete("/:id", verifyToken, removeProgram);      // Admin only

export default router;