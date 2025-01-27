import { createSqlConnection } from "../dbscripts/DbConnection.ts";
import console from "./logging.ts";
const mysql = await createSqlConnection();
if (mysql) {
    console.info("Database connection established!");
} else {
    console.error("Failed to connect to the database.");
}

export async function validateSession(sessionToken: string): Promise<boolean> {
    if (!sessionToken?.trim()) return false;
    
    if (!mysql) {
        console.error("Database connection unavailable");
        return false;
    }

    try {
        const [rows]: any = await mysql.query(
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