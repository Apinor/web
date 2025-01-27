import { load } from "https://deno.land/std@0.204.0/dotenv/mod.ts";
import { Client } from "https://deno.land/x/mysql@v2.11.0/mod.ts";
import console from "../utils/logging.ts";
const env = await load();

// Logging for testing .env connection status and variables, uncomment for use in testing if needed.
// console.info("hostname: ", env.DB_HOST);
// console.info("port: ", env.DB_PORT);
// console.info("username: ", env.DB_USER);
// console.info("password: ", env.DB_PASSWORD);

export async function createSqlConnection() {
  const client = await new Client().connect({
    hostname: env["DB_HOST"],
    port: parseInt(env["DB_PORT"] || "3306"),
    username: env["DB_USER"],
    password: env["DB_PASSWORD"],
    db: "apinor_DB",
  });
  
  console.info("Connected to MySQL database!");
  return client;
}