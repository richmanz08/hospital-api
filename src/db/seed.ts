import "dotenv/config";
import { Pool } from "pg";
import fs from "fs";
import path from "path";

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "hospital_db",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "",
});

async function runSeeds() {
  const client = await pool.connect();

  try {
    console.log("🌱 Starting database seeding...\n");

    // Get seed files
    const seedsDir = path.join(__dirname, "seeds");

    if (!fs.existsSync(seedsDir)) {
      console.log("❌ Seeds directory not found");
      return;
    }

    const files = fs
      .readdirSync(seedsDir)
      .filter((f) => f.endsWith(".sql"))
      .sort();

    if (files.length === 0) {
      console.log("No seed files found.");
      return;
    }

    for (const file of files) {
      console.log(`▶️  Seeding: ${file}`);

      const filePath = path.join(seedsDir, file);
      const sql = fs.readFileSync(filePath, "utf-8");

      try {
        await client.query(sql);
        console.log(`✅ Completed: ${file}\n`);
      } catch (err) {
        console.error(`❌ Failed: ${file}`);
        console.error((err as Error).message);
        throw err;
      }
    }

    console.log("🎉 Database seeding completed successfully!");
  } finally {
    client.release();
    await pool.end();
  }
}

runSeeds().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
