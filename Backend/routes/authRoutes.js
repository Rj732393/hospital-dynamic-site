import express from "express";
import { login, createAdmin } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.post("/create-admin", createAdmin);  // ⚠️ Setup ke baad isko hata/disable karna hai

const router_export = router;
export default router_export;