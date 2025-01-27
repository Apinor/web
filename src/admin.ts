import {createSqlConnection} from "./dbscripts/DbConnection.ts";
import { serveDir } from "https://deno.land/std@0.224.0/http/file_server.ts";
import {generateSessionToken} from "./utils/generateSessionToken.ts"
import console from "./utils/logging.ts" 
import { validateSession } from "./utils/validateSession.ts";
import {saveSession} from "./utils/saveSession.ts";
const mysql = await createSqlConnection();
if (mysql) {
  console.info("Database connection established!");
} else {
  console.error("Failed to connect to the database.");
}


Deno.serve(async (req: Request) => {
    try {
        const url = new URL(req.url);
        console.info("Session token: ",req.headers.get("cookie")?.match(/session=([^;]+)/)?.[1])
        // Handle login POST request
        console.info("Request path: ", url.pathname);

        if (url.pathname === "/login" && req.method === "POST") {

            console.info("Handling login request from post login path");
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
                const response = new Response(null, {
                    status: 302, // HTTP redirect status code
                    headers: {
                        "Location": "/panel", // Redirect to admin panel
                        "Set-Cookie": `session=${sessionToken}; HttpOnly; Path=/; Max-Age=7200; SameSite=Strict`,
                        "Cache-Control": "no-cache, no-store, must-revalidate"
                    }
                });
                return response;
            } else {
                console.info("Invalid credentials");
            }
        } else if (url.pathname == "/login/" || url.pathname == "/login" && req.method === "GET") {
            return serveDir(req, { fsRoot: "./admin/public" });
        }

        // Serve files from the 'public' directory for all other paths
        return serveDir(req, { fsRoot: "./admin" });
    } catch (error) {
        console.error("Error handling request:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
});