import { createSqlConnection } from "./dbscripts/DbConnection.ts";
import { serveDir, serveFile } from "https://deno.land/std@0.224.0/http/file_server.ts";
import console from "./utils/logging.ts";
import { load } from "https://deno.land/std@0.204.0/dotenv/mod.ts";
import {
  generateSessionToken,
  validateSession,
  saveSession,
  cleanupSessions,
} from "./utils/sessionUtils.ts";
import { handleApiRequest } from "./utils/apiHandler.ts";
import { renderFileToString } from "https://deno.land/x/dejs@0.10.3/mod.ts";
const mysql = await createSqlConnection();
if (mysql) {
  console.info("Database connection established!");
} else {
  console.error("Failed to connect to the database.");
}

Deno.serve(async (req: Request) => {
    const url = new URL(req.url);
  if (req.method === "GET" && url.pathname === "/") {
    try {
      const body = await renderFileToString("public/views/index.ejs", templateData);
      return new Response(body, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    } catch (error) {
      console.error("Template rendering error:", error);
      return new Response("Error rendering template", { status: 500 });
    }
  } else if (req.method === "GET" && url.pathname === "/productPage") {
    try {
      const body = await renderFileToString("public/views/productPage.ejs", templateData);
      return new Response(body, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    } catch (error) {
      console.error("Template rendering error:", error);
      return new Response("Error rendering template", { status: 500 });
    }
  } else if (req.method === "GET" && url.pathname.startsWith("/public")) {
    try {
      const filePath = "./public/";
      const file = await serveFile(req, filePath);
      return file;
    } catch (error) {
      console.error("File serving error:", error);
      return new Response("File not found", { status: 404 });
    }
  } else if (req.method === "GET" && url.pathname.startsWith("/public/views")) {
    try {
      const filePath = "./public/views/";
      const file = await serveFile(req, filePath);
      return file;
    } catch (error) {
      console.error("File serving error:", error);
      return new Response("File not found", { status: 404 });
    }
  } 

  return new Response("Not Found", { status: 404 });
});

console.info("Server running at http://localhost:8000");