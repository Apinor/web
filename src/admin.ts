import {createSqlConnection} from "./dbscripts/DbConnection.ts";
import { serveDir } from "https://deno.land/std@0.224.0/http/file_server.ts";
import {generateSessionToken} from "./utils/generateSessionToken.ts"
const mysql = await createSqlConnection();
if (mysql) {
  console.log("Database connection established!");
} else {
  console.error("Failed to connect to the database.");
}

Deno.serve(async (req: Request) => {
    try {
        const url = new URL(req.url);

        // Handle login POST request
        if (url.pathname === "/login" && req.method === "POST") {
            const formData = await req.formData();
            // Log the session token and recieved formdata from the login form
            console.info(req.headers.get("cookie")?.match(/session=([^;]+)/)?.[1])
            console.info("Recived formdata: ", formData);
            const username = formData.get("username");
            const password = formData.get("password");

            if (username === "1" && password === "1") {
                console.info("Login successful");
                const sessionToken = generateSessionToken();
                console.info("Session token:", sessionToken);
                const response = new Response(JSON.stringify({ success: true }), {
                    status: 200,
                    headers: {
                        "Content-Type": "application/json",
                        "Set-Cookie": `session=${sessionToken}; HttpOnly; Path=/; Max-Age=7200; SameSite=Strict`
                    }
                });
                return response;
            } else {
                console.info("Invalid credentials");
            }
        }

        // Serve files from the 'public' directory for all other paths
        return serveDir(req, { fsRoot: "./admin/public" });
    } catch (error) {
        console.error("Error handling request:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
});