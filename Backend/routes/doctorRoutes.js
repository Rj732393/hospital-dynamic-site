import express from "express";
import upload from "../middleware/upload.js"; // tumhara existing shared upload middleware
import { verifyToken } from "../middleware/verifyToken.js";// apna actual naam/path check kar lena

import {
  getAllDoctors,
  addDoctor,
  updateDoctor,
  deleteDoctor,
} from "../controllers/doctorController.js";

const router = express.Router();

router.get("/", getAllDoctors);
router.post("/", verifyToken, upload.single("photo"), addDoctor);
router.put("/:id", verifyToken, upload.single("photo"), updateDoctor);
router.delete("/:id", verifyToken, deleteDoctor);

export default router;