
import { serveDir } from "https://deno.land/std@0.224.0/http/file_server.ts";
import { load } from "https://deno.land/std@0.224.0/dotenv/mod.ts";
import {createSqlConnection} from "./dbscripts/DbConnection.ts";

const mysql = await createSqlConnection();
if (mysql) {
  console.log("Database connection established!");
} else {
  console.error("Failed to connect to the database.");
}

  if (req.method === "GET" && pathname === "/") {
    try {
      const body = await renderFileToString("public/views/index.ejs", templateData);
      return new Response(body, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    } catch (error) {
      console.error("Template rendering error:", error);
      return new Response("Error rendering template", { status: 500 });
    }
  } else if (req.method === "GET" && pathname === "/productPage") {
    try {
      const body = await renderFileToString("public/views/productPage.ejs", templateData);
      return new Response(body, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    } catch (error) {
      console.error("Template rendering error:", error);
      return new Response("Error rendering template", { status: 500 });
    }
  } else if (req.method === "GET" && pathname.startsWith("/public")) {
    try {
      const filePath = `.${pathname}`;
      const file = await serveFile(req, filePath);
      return file;
    } catch (error) {
      console.error("File serving error:", error);
      return new Response("File not found", { status: 404 });
    }
  } else if (req.method === "GET" && pathname.startsWith("/public/views")) {
    try {
      const filePath = `.${pathname}`;
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