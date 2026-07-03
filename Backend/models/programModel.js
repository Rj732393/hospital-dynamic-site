import { getPool, sql } from "../config/db.js";

// Sab programs latest first
export const getAllPrograms = async () => {
  const pool = await getPool();
  const result = await pool
    .request()
    .query("SELECT * FROM Programs ORDER BY ProgramId DESC");
  return result.recordset;
};

// Ek program by id
export const getProgramById = async (id) => {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .query("SELECT * FROM Programs WHERE ProgramId = @id");
  return result.recordset[0];
};

// Naya program insert
export const createProgram = async (data) => {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("Title", sql.NVarChar(200), data.title)
    .input("ShortDescription", sql.NVarChar(300), data.shortDescription || null)
    .input("Description", sql.NVarChar(sql.MAX), data.description)
    .input("ImageUrl", sql.NVarChar(500), data.imageUrl || null)
    .query(`
      INSERT INTO Programs (Title, ShortDescription, Description, ImageUrl, CreatedAt, UpdatedAt)
      OUTPUT INSERTED.*
      VALUES (@Title, @ShortDescription, @Description, @ImageUrl, GETDATE(), GETDATE())
    `);
  return result.recordset[0];
};

// Program update
export const updateProgram = async (id, data) => {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .input("Title", sql.NVarChar(200), data.title)
    .input("ShortDescription", sql.NVarChar(300), data.shortDescription || null)
    .input("Description", sql.NVarChar(sql.MAX), data.description)
    .input("ImageUrl", sql.NVarChar(500), data.imageUrl || null)
    .query(`
      UPDATE Programs
      SET Title = @Title,
          ShortDescription = @ShortDescription,
          Description = @Description,
          ImageUrl = @ImageUrl,
          UpdatedAt = GETDATE()
      OUTPUT INSERTED.*
      WHERE ProgramId = @id
    `);
  return result.recordset[0];
};

// Program delete
export const deleteProgram = async (id) => {
  const pool = await getPool();
  await pool.request().input("id", sql.Int, id).query("DELETE FROM Programs WHERE ProgramId = @id");
  return true;
};
