import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getPool, sql } from "../config/db.js";

// Admin Login
export async function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  try {
    const pool = getPool();
    const result = await pool
      .request()
      .input("username", sql.VarChar, username)
      .query("SELECT * FROM Admins WHERE username = @username");

    if (result.recordset.length === 0) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const admin = result.recordset[0];
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      message: "Login successful",
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        role: admin.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

// Pehla Admin Create (setup ke baad delete kar dena)
export async function createAdmin(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  try {
    const pool = getPool();
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool
      .request()
      .input("username", sql.VarChar, username)
      .input("password", sql.VarChar, hashedPassword)
      .query(
        "INSERT INTO Admins (username, password) VALUES (@username, @password)"
      );

    res.json({ message: "Admin created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

// Forgot Password - OTP bhejo
export async function forgotPassword(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email required" });
  }

  try {
    const pool = getPool();
    const result = await pool
      .request()
      .input("email", sql.VarChar, email)
      .query("SELECT * FROM Admins WHERE email = @email");

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Email not registered" });
    }

    // 6 digit OTP generate karo
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    await pool
      .request()
      .input("email", sql.VarChar, email)
      .input("otp", sql.VarChar, otp)
      .input("otp_expiry", sql.DateTime, expiry)
      .query(
        "UPDATE Admins SET otp = @otp, otp_expiry = @otp_expiry WHERE email = @email"
      );

    res.json({ message: "OTP sent to your email", otp }); // baad me nodemailer lagayenge
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

// OTP Verify
export async function verifyOtp(req, res) {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP required" });
  }

  try {
    const pool = getPool();
    const result = await pool
      .request()
      .input("email", sql.VarChar, email)
      .query("SELECT * FROM Admins WHERE email = @email");

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Email not found" });
    }

    const admin = result.recordset[0];

    if (admin.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (new Date() > new Date(admin.otp_expiry)) {
      return res.status(400).json({ message: "OTP expired" });
    }

    res.json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

// Reset Password
export async function resetPassword(req, res) {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: "All fields required" });
  }

  try {
    const pool = getPool();
    const result = await pool
      .request()
      .input("email", sql.VarChar, email)
      .query("SELECT * FROM Admins WHERE email = @email");

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Email not found" });
    }

    const admin = result.recordset[0];

    if (admin.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (new Date() > new Date(admin.otp_expiry)) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool
      .request()
      .input("email", sql.VarChar, email)
      .input("password", sql.VarChar, hashedPassword)
      .query(
        "UPDATE Admins SET password = @password, otp = NULL, otp_expiry = NULL WHERE email = @email"
      );

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}