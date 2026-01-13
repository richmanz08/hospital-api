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

async function runMigrations() {
  const client = await pool.connect();

  try {
    console.log("🔄 Starting migrations...\n");

    // Create migrations tracking table if not exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Get already executed migrations
    const { rows: executedMigrations } = await client.query(
      "SELECT name FROM migrations"
    );
    const executedNames = executedMigrations.map((m) => m.name);

    // Get migration files
    const migrationsDir = path.join(__dirname, "migrations");
    const files = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith(".sql"))
      .sort();

    let migrationsRan = 0;

    for (const file of files) {
      if (executedNames.includes(file)) {
        console.log(`⏭️  Skipping: ${file} (already executed)`);
        continue;
      }

      console.log(`▶️  Running: ${file}`);

      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, "utf-8");

      await client.query("BEGIN");
      try {
        await client.query(sql);
        await client.query("INSERT INTO migrations (name) VALUES ($1)", [file]);
        await client.query("COMMIT");
        console.log(`✅ Completed: ${file}\n`);
        migrationsRan++;
      } catch (err) {
        await client.query("ROLLBACK");
        console.error(`❌ Failed: ${file}`);
        console.error((err as Error).message);
        throw err;
      }
    }

    if (migrationsRan === 0) {
      console.log("\n✨ No new migrations to run.");
    } else {
      console.log(`\n🎉 Successfully ran ${migrationsRan} migration(s).`);
    }
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
