import { createSqlConnection } from "../dbscripts/DbConnection.ts";
import console from "./logging.ts";

const mysql = await createSqlConnection();
if (mysql) {
    console.info("Database connection established!");
} else {
    console.error("Failed to connect to the database.");
}

export async function saveSession(sessionToken: string, durationSeconds = 7200): Promise<boolean> {
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
        return result && result.affectedRows !== undefined && result.affectedRows > 0;
    } catch (error) {
        console.error("Error saving session:", error);
        return false;
    }
}