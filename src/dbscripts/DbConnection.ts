import { load } from "https://deno.land/std@0.204.0/dotenv/mod.ts";
import { Client } from "https://deno.land/x/mysql@v2.11.0/mod.ts";
import console from "../utils/logging.ts";
const env = await load();

export async function createSqlConnection() {
  const client = await new Client().connect({
    hostname: env["DB_HOST"],
    port: parseInt(env["DB_PORT"] || "3306"),
    username: env["DB_USER"],
    password: env["DB_PASSWORD"]
  });
  
  console.info("Connected to MySQL database!");
  return client;
}