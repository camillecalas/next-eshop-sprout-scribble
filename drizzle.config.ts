import type {Config } from "drizzle-kit";
import * as dotenv from "dotenv"

dotenv.config({
	path: ".env.local",
})

export default {
  schema: "./server/schema.ts",
  out: "./server/migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: "postgresql://neondb_owner:pK46fCdIxQBh@ep-young-mud-a5rf3pke-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"
  },
} satisfies Config;

// import type { Config } from "drizzle-kit";
// import * as dotenv from "dotenv";

// dotenv.config({
//     path: ".env.local",
// });

// const config: Config = {
//     schema: "./server/schema.ts",
//     out: "./server/migrations",
//     driver: "pg",
//     dbCredentials: {
//         connectionString: process.env.POSTGRES_URL as string, // Assuming POSTGRES_URL is defined in .env.local
//     },
// };

// export default config;
