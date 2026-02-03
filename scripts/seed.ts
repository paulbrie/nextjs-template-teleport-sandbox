import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hash } from "bcryptjs";
import { config } from "dotenv";

// Load environment variables from .env file
config({ path: ".env" });

async function seed() {
  // Use the DATABASE_URL from environment, which is already set correctly
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error("❌ DATABASE_URL environment variable is not set");
    process.exit(1);
  }
  
  const client = new Client({
    connectionString: databaseUrl,
  });

  await client.connect();
  const db = drizzle(client);

  console.log("🌱 Seeding database...");

  // Check if admin user already exists
  const existingUsers = await db.select().from(users).where(eq(users.email, "paul.brie@teleporthq.io"));
  
  if (existingUsers.length > 0) {
    console.log("Admin user already exists, skipping...");
  } else {
    // Create admin user with password: admin
    const hashedPassword = await hash("admin", 10);
    
    await db.insert(users).values({
      email: "paul.brie@teleporthq.io",
      password: hashedPassword,
      name: "Paul Brie",
    });
    
    console.log("✅ Admin user created: paul.brie@teleporthq.io / admin");
  }

  await client.end();
  console.log("🎉 Seeding completed!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});
