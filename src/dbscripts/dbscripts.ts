import {createSqlConnection} from "./DbConnection.ts";
const client = await createSqlConnection();
if (client) {
  console.log("Database connection established!");
} else {
  console.error("Failed to connect to the database.");
}