import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import programRoutes from "./routes/programRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Uploaded images ko publicly serve karo -> http://localhost:5000/uploads/filename.jpg
app.use("/uploads", express.static(path.resolve("uploads")));




app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/contacts", contactRoutes);


// API routes
app.use("/api/programs", programRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/doctors", doctorRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Hospital Backend Running Successfully 🚀" });
});

const PORT = process.env.PORT || 5000;

// pehle DB connect hone do, USKE BAAD hi server start karo
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Server start nahi hua, DB connection fail:", err.message);
  });