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