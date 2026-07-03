import express from "express";
import upload from "../middleware/upload.js";
import {
  getServices,
  getService,
  addService,
  editService,
  removeService,
} from "../controllers/serviceController.js";

const router = express.Router();

router.get("/", getServices);              // GET    /api/services
router.get("/:id", getService);            // GET    /api/services/:id
router.post("/", upload.single("image"), addService);       // POST   /api/services
router.put("/:id", upload.single("image"), editService);    // PUT    /api/services/:id
router.delete("/:id", removeService);      // DELETE /api/services/:id

export default router;
