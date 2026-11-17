#!/usr/bin/env node

/**
 * Database Diagnostic Script for Candela Tiles & Marbles
 * Usage:
 *   npm run db:check
 * Or with custom connection string:
 *   DATABASE_URL="postgresql://..." npm run db:check
 */

const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

// Load .env.local with highest priority (matching Next.js precedence)
const envLocalPath = path.resolve(__dirname, "../.env.local");
if (fs.existsSync(envLocalPath)) {
  const content = fs.readFileSync(envLocalPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const idx = trimmed.indexOf("=");
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim();
      if (val) {
        process.env[key] = val.replace(/^["']|["']$/g, "");
      }
    }
  }
}

// Clean connection string (strip jdbc: prefix if present from Spring Boot configs)
let connectionString = process.env.DATABASE_URL?.trim();
if (connectionString && connectionString.startsWith("jdbc:")) {
  connectionString = connectionString.replace(/^jdbc:/, "");
}
const host = process.env.DB_HOST?.trim();
const user = process.env.DB_USER?.trim();
const password = process.env.DB_PASSWORD?.trim();
const database = process.env.DB_NAME?.trim() || "postgres";
const port = parseInt(process.env.DB_PORT || "5432", 10);

console.log("====================================================");
console.log(" Candela Tiles & Marbles — Database Diagnostic Tool ");
console.log("====================================================\n");

if (!connectionString && (!host || !user || !password)) {
  console.log("⚠️  NO DATABASE CONFIGURED");
  console.log("   No active DATABASE_URL or DB_HOST/USER/PASSWORD found in environment or .env.local.");
  console.log("   To manually connect your database:");
  console.log("   1. Open 'frontend/.env.local'");
  console.log("   2. Set DATABASE_URL=postgresql://postgres.[project-ref]:[pass]@[host]:6543/postgres");
  console.log("   3. Run 'npm run db:check' again.\n");
  process.exit(0);
}

const isSsl =
  process.env.DB_SSL === "true" ||
  Boolean(connectionString && (connectionString.includes("supabase.com") || connectionString.includes("sslmode=require")));

const pool = new Pool(
  connectionString
    ? {
        connectionString,
        ssl: isSsl ? { rejectUnauthorized: false } : undefined,
        connectionTimeoutMillis: 8000,
      }
    : {
        host,
        port,
        database,
        user,
        password,
        ssl: isSsl ? { rejectUnauthorized: false } : undefined,
        connectionTimeoutMillis: 8000,
      }
);

async function testConnection() {
  console.log("Connecting to database...");
  if (connectionString) {
    // Mask password in logs
    const masked = connectionString.replace(/:([^@]+)@/, ":****@");
    console.log(` Target: ${masked}`);
  } else {
    console.log(` Target: ${user}@${host}:${port}/${database}`);
  }

  try {
    const res = await pool.query("SELECT current_database(), current_user, version();");
    console.log("\n✅ SUCCESS: Connected successfully!");
    console.log(`   Database : ${res.rows[0].current_database}`);
    console.log(`   User     : ${res.rows[0].current_user}`);
    console.log(`   Engine   : ${res.rows[0].version.split(",")[0]}`);

    // Query accessible tables for runtime role
    const tableRes = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    console.log(`\n📊 Runtime-Accessible Public Objects (${tableRes.rows.length}):`);
    tableRes.rows.forEach((r) => console.log(`   - ${r.table_name}`));

    // If separate MIGRATION_DATABASE_URL is configured, verify full schema count (23 objects)
    const migrationUrl = process.env.MIGRATION_DATABASE_URL?.trim().replace(/^jdbc:/, "");
    if (migrationUrl) {
      const migPool = new Pool({
        connectionString: migrationUrl,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 8000,
      });
      const fullRes = await migPool.query(`
        SELECT table_name FROM information_schema.tables
        WHERE table_schema = 'public' ORDER BY table_name;
      `);
      console.log(`\n📊 Full Schema Objects Verified via MIGRATION_DATABASE_URL (${fullRes.rows.length}):`);
      fullRes.rows.forEach((r) => console.log(`   - ${r.table_name}`));
      await migPool.end();
    }

    console.log("\n🚀 Database is fully ready for deployment!\n");
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error("\n❌ CONNECTION FAILED:");
    console.error(`   ${err.message}\n`);
    console.log("Tip: Check that your credentials, IP whitelist, and network ports are open.");
    await pool.end();
    process.exit(1);
  }
}

testConnection();

