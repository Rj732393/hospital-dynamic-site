import express from "express";
import upload from "../middleware/upload.js";
import {
  getPrograms,
  getProgram,
  addProgram,
  editProgram,
  removeProgram,
} from "../controllers/programController.js";

const router = express.Router();

router.get("/", getPrograms);              // GET    /api/programs
router.get("/:id", getProgram);            // GET    /api/programs/:id
router.post("/", upload.single("image"), addProgram);       // POST   /api/programs
router.put("/:id", upload.single("image"), editProgram);    // PUT    /api/programs/:id
router.delete("/:id", removeProgram);      // DELETE /api/programs/:id

export default router;