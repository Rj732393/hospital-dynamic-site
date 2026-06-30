import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  createAppointment,
  getAllAppointments,
  updateAppointmentStatus,
  deleteAppointment,
} from "../controllers/appointmentController.js";

const router = express.Router();

router.post("/", createAppointment);              // Public - website form
router.get("/", verifyToken, getAllAppointments);  // Admin only
router.patch("/:id", verifyToken, updateAppointmentStatus); // Admin only
router.delete("/:id", verifyToken, deleteAppointment);      // Admin only

export default router;