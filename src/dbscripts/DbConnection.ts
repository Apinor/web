import { Client } from "https://deno.land/x/mysql@v2.11.0/mod.ts";

export async function createSqlConnection() {
  const client = await new Client().connect({
    hostname: Deno.env.get("DB_HOST"),
    port: parseInt(Deno.env.get("DB_PORT") || "3306"),
    username: Deno.env.get("DB_USER"),
    password: Deno.env.get("DB_PASSWORD"),
    db: Deno.env.get("DB_NAME"),
  });
  
  console.log("Connected to MySQL database!");
  return client;
}