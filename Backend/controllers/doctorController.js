import { getPool, sql } from "../config/db.js";

export const getAllDoctors = async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request()
      .query("SELECT * FROM ghospital.Doctors WHERE IsActive = 1 ORDER BY DoctorID DESC");

    res.status(200).json({ success: true, data: result.recordset });
  } catch (err) {
    console.error("getAllDoctors error:", err);
    res.status(500).json({ success: false, message: "Doctors fetch nahi ho paye" });
  }
};

export const addDoctor = async (req, res) => {
  try {
    const { name, specialization, experience } = req.body;

    if (!name || !specialization) {
      return res.status(400).json({ success: false, message: "Name aur Specialization required hain" });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const pool = getPool();
    await pool.request()
      .input("Name", sql.NVarChar(150), name)
      .input("Specialization", sql.NVarChar(150), specialization)
      .input("Experience", sql.Int, parseInt(experience) || 0)
      .input("ImageUrl", sql.NVarChar(300), imageUrl)
      .query(`INSERT INTO ghospital.Doctors (Name, Specialization, Experience, ImageUrl)
              VALUES (@Name, @Specialization, @Experience, @ImageUrl)`);

    res.status(201).json({ success: true, message: "Doctor add ho gaya" });
  } catch (err) {
    console.error("addDoctor error:", err);
    res.status(500).json({ success: false, message: "Doctor add nahi ho paya" });
  }
};

export const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, specialization, experience } = req.body;

    const pool = getPool();
    const request = pool.request()
      .input("DoctorID", sql.Int, id)
      .input("Name", sql.NVarChar(150), name)
      .input("Specialization", sql.NVarChar(150), specialization)
      .input("Experience", sql.Int, parseInt(experience) || 0);

    let query = `UPDATE ghospital.Doctors
                 SET Name = @Name, Specialization = @Specialization, Experience = @Experience`;

    if (req.file) {
      const imageUrl = `/uploads/${req.file.filename}`;
      request.input("ImageUrl", sql.NVarChar(300), imageUrl);
      query += `, ImageUrl = @ImageUrl`;
    }

    query += ` WHERE DoctorID = @DoctorID`;
    await request.query(query);

    res.status(200).json({ success: true, message: "Doctor update ho gaya" });
  } catch (err) {
    console.error("updateDoctor error:", err);
    res.status(500).json({ success: false, message: "Doctor update nahi ho paya" });
  }
};

export const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();
    await pool.request()
      .input("DoctorID", sql.Int, id)
      .query("UPDATE ghospital.Doctors SET IsActive = 0 WHERE DoctorID = @DoctorID");

    res.status(200).json({ success: true, message: "Doctor remove ho gaya" });
  } catch (err) {
    console.error("deleteDoctor error:", err);
    res.status(500).json({ success: false, message: "Doctor delete nahi ho paya" });
  }
};