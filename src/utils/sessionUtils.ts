import { createSqlConnection } from "../dbscripts/DbConnection.ts";
import console from "./logging.ts";

const mysql = await createSqlConnection();

export async function cleanupSessions(): Promise<void> {
  console.info("Cleaning up expired sessions");
  if (!mysql) {
    console.error("Database connection unavailable");
    return;
  }

  try {
    const result = await mysql.query(
      `UPDATE Sessions 
             SET Active = 0 
             WHERE Active = 1 
             AND NOW() > DATE_ADD(Created_At, INTERVAL Duration_Seconds SECOND)`
    );

    // Access the result correctly for MySQL2 in Deno
    const affectedRows = result[0]?.affectedRows;
    if (affectedRows > 0) {
      console.info(`Cleaned up ${affectedRows} expired sessions`);
    }
  } catch (error) {
    console.error("Error cleaning up sessions:", error);
  }
}

export async function deactivateSession(token: string): Promise<boolean> {
  if (!mysql) {
    console.error("Database connection unavailable");
    return false;
  }

  try {
    const result = await mysql.query(
      "UPDATE Sessions SET Active = 0 WHERE Token = ?",
      [token]
    );
    return result[0]?.affectedRows > 0;
  } catch (error) {
    console.error("Error deactivating session:", error);
    return false;
  }
}
export async function validateSession(sessionToken: string): Promise<boolean> {
  if (!sessionToken?.trim()) return false;

  if (!mysql) {
    console.error("Database connection unavailable");
    return false;
  }

  try {
    const [rows] = await mysql.query(
      `SELECT COUNT(*) as count
            FROM Sessions 
            WHERE 
                Token = ? 
                AND Active = 1 
                AND NOW() < DATE_ADD(Created_At, INTERVAL Duration_Seconds SECOND)`,
      [sessionToken]
    );

    console.info("Rows:", JSON.stringify(rows, null, 2));

    return rows?.count > 0;
  } catch (error) {
    console.error("Session validation error:", error);
    return false;
  }
}
export async function saveSession(
  sessionToken: string,
  durationSeconds = 7200
): Promise<boolean> {
  if (!sessionToken?.trim()) {
    console.error("Invalid session token provided");
    return false;
  }

  if (!mysql) {
    console.error("Database connection unavailable");
    return false;
  }

  try {
    const result = await mysql.execute(
      `INSERT INTO Sessions (Token, Created_At, Duration_Seconds, Active)
             VALUES (?, NOW(), ?, 1)`,
      [sessionToken, durationSeconds]
    );

    console.info("Session saved:", JSON.stringify(result, null, 2));
    // Check if the session was inserted successfully
    return (
      result && result.affectedRows !== undefined && result.affectedRows > 0
    );
  } catch (error) {
    console.error("Error saving session:", error);
    return false;
  }
}
export function generateSessionToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
}
