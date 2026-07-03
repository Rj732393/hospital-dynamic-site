import { getPool, sql } from "../config/db.js";

// Sab services latest first
export const getAllServices = async () => {
  const pool = await getPool();
  const result = await pool
    .request()
    .query("SELECT * FROM Services ORDER BY ServiceId DESC");
  return result.recordset;
};

// Ek service by id
export const getServiceById = async (id) => {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .query("SELECT * FROM Services WHERE ServiceId = @id");
  return result.recordset[0];
};

// Naya service insert
export const createService = async (data) => {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("Title", sql.NVarChar(200), data.title)
    .input("ShortDescription", sql.NVarChar(300), data.shortDescription || null)
    .input("Description", sql.NVarChar(sql.MAX), data.description)
    .input("ImageUrl", sql.NVarChar(500), data.imageUrl || null)
    .query(`
      INSERT INTO Services (Title, ShortDescription, Description, ImageUrl, CreatedAt, UpdatedAt)
      OUTPUT INSERTED.*
      VALUES (@Title, @ShortDescription, @Description, @ImageUrl, GETDATE(), GETDATE())
    `);
  return result.recordset[0];
};

// Service update
export const updateService = async (id, data) => {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .input("Title", sql.NVarChar(200), data.title)
    .input("ShortDescription", sql.NVarChar(300), data.shortDescription || null)
    .input("Description", sql.NVarChar(sql.MAX), data.description)
    .input("ImageUrl", sql.NVarChar(500), data.imageUrl || null)
    .query(`
      UPDATE Services
      SET Title = @Title,
          ShortDescription = @ShortDescription,
          Description = @Description,
          ImageUrl = @ImageUrl,
          UpdatedAt = GETDATE()
      OUTPUT INSERTED.*
      WHERE ServiceId = @id
    `);
  return result.recordset[0];
};

// Service delete
export const deleteService = async (id) => {
  const pool = await getPool();
  await pool.request().input("id", sql.Int, id).query("DELETE FROM Services WHERE ServiceId = @id");
  return true;
};
