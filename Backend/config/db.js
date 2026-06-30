import sql from "mssql";
import dotenv from "dotenv";
dotenv.config();

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: Number(process.env.DB_PORT),
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

let pool;

export async function connectDB() {
  try {
    pool = await sql.connect(dbConfig);
    console.log("✅ Connected to MS SQL Server");
  } catch (err) {
    console.error("❌ Database Connection Failed:", err.message);
  }
}

export function getPool() {
  if (!pool) throw new Error("DB not connected yet. Call connectDB() first.");
  return pool;
}

export { sql };