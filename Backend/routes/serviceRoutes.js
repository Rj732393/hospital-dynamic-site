import express from "express";
import upload from "../middleware/upload.js";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  getServices,
  getService,
  addService,
  editService,
  removeService,
} from "../controllers/serviceController.js";

const router = express.Router();

router.get("/", getServices);              // GET    /api/services (public)
router.get("/:id", getService);            // GET    /api/services/:id (public)
router.post("/", verifyToken, upload.single("image"), addService);       // Admin only
router.put("/:id", verifyToken, upload.single("image"), editService);    // Admin only
router.delete("/:id", verifyToken, removeService);      // Admin only

export default router;