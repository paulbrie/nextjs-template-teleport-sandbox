import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import * as schema from "./schema";
import { config } from "dotenv";

// Load environment variables from .env file
config({ path: ".env" });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/postgres",
});

const db = drizzle(pool, { schema });

async function seed() {
  console.log("Seeding database...");
  
  // Check if admin user already exists
  const existingUser = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, "paul.brie@teleporthq.io"),
  });

  if (existingUser) {
    console.log("Admin user already exists, skipping seed...");
    await pool.end();
    return;
  }

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin", 10);
  
  await db.insert(schema.users).values({
    email: "paul.brie@teleporthq.io",
    name: "Paul Brie",
    password: hashedPassword,
    role: "admin",
  });

  console.log("Admin user created successfully!");
  console.log("Email: paul.brie@teleporthq.io");
  console.log("Password: admin");
  
  await pool.end();
}

seed().catch((error) => {
  console.error("Error seeding database:", error);
  process.exit(1);
});
