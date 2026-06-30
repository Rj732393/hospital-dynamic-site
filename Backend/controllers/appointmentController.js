import { getPool, sql } from "../config/db.js";

// Public form ke liye - website se appointment book hoga
export async function createAppointment(req, res) {
  const { fullName, phone, dept, date, time, description } = req.body;

  if (!fullName || !phone || !dept || !date || !time) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  try {
    const pool = getPool();
    await pool
      .request()
      .input("fullName", sql.VarChar, fullName)
      .input("phone", sql.VarChar, phone)
      .input("dept", sql.VarChar, dept)
      .input("appt_date", sql.Date, date)
      .input("appt_time", sql.VarChar, time)
      .input("description", sql.VarChar, description || null)
      .query(`INSERT INTO Appointments (fullName, phone, dept, appt_date, appt_time, description)
              VALUES (@fullName, @phone, @dept, @appt_date, @appt_time, @description)`);

    res.json({ message: "Appointment booked successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

// Admin panel ke liye - sab appointments list
export async function getAllAppointments(req, res) {
  try {
    const pool = getPool();
    const result = await pool
      .request()
      .query("SELECT * FROM Appointments ORDER BY created_at DESC");

    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

// Admin - status update (pending/confirmed/cancelled)
export async function updateAppointmentStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;

  const allowedStatus = ["pending", "confirmed", "cancelled"];
  if (!allowedStatus.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const pool = getPool();
    await pool
      .request()
      .input("id", sql.Int, id)
      .input("status", sql.VarChar, status)
      .query("UPDATE Appointments SET status = @status WHERE id = @id");

    res.json({ message: "Status updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

// Admin - delete appointment
export async function deleteAppointment(req, res) {
  const { id } = req.params;

  try {
    const pool = getPool();
    await pool
      .request()
      .input("id", sql.Int, id)
      .query("DELETE FROM Appointments WHERE id = @id");

    res.json({ message: "Appointment deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}