import { getPool, sql } from "../config/db.js";

// Public form ke liye - website se contact message
export async function createContactMessage(req, res) {
  const { cName, cEmail, cPhone, cSubject, cMessage } = req.body;

  if (!cName || !cEmail || !cMessage) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  try {
    const pool = getPool();
    await pool
      .request()
      .input("cName", sql.VarChar, cName)
      .input("cEmail", sql.VarChar, cEmail)
      .input("cPhone", sql.VarChar, cPhone || null)
      .input("cSubject", sql.VarChar, cSubject || null)
      .input("cMessage", sql.VarChar, cMessage)
      .query(`INSERT INTO ContactMessages (cName, cEmail, cPhone, cSubject, cMessage)
              VALUES (@cName, @cEmail, @cPhone, @cSubject, @cMessage)`);

    res.json({ message: "Message sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

// Admin - sab messages
export async function getAllMessages(req, res) {
  try {
    const pool = getPool();
    const result = await pool
      .request()
      .query("SELECT * FROM ContactMessages ORDER BY created_at DESC");

    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

// Admin - read/unread mark karna
export async function markAsRead(req, res) {
  const { id } = req.params;

  try {
    const pool = getPool();
    await pool
      .request()
      .input("id", sql.Int, id)
      .query("UPDATE ContactMessages SET isRead = 1 WHERE id = @id");

    res.json({ message: "Marked as read" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

// Admin - delete message
export async function deleteMessage(req, res) {
  const { id } = req.params;

  try {
    const pool = getPool();
    await pool
      .request()
      .input("id", sql.Int, id)
      .query("DELETE FROM ContactMessages WHERE id = @id");

    res.json({ message: "Message deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}