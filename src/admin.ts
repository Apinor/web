import { createSqlConnection } from "./dbscripts/DbConnection.ts";
import { serveDir } from "https://deno.land/std@0.224.0/http/file_server.ts";
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
// Cleanup expired sessions every hoursl
setInterval(cleanupSessions, 3600000);

const env = await load();
const mysql = await createSqlConnection();
if (mysql) {
  console.info("Database connection established!");
} else {
  console.error("Failed to connect to the database.");
}

Deno.serve(async (req: Request) => {
  try {
    const url = new URL(req.url);
    // console.info("Session token: ",req.headers.get("cookie")?.match(/session=([^;]+)/)?.[1])
    // Handle login POST request
    console.info("Request path: ", url.pathname);

    if (url.pathname === "/login" && req.method === "POST") {
      console.info("Handling login request from post login path");
      const formData = await req.formData();

      // Log the session token and recieved formdata from the login form
      console.info(req.headers.get("cookie")?.match(/session=([^;]+)/)?.[1]);
      console.info("Recived formdata: ", formData);
      const username = formData.get("username");
      const password = formData.get("password");

      if (username === env["ADMIN_USR"] && password === env["ADMIN_PWD"]) {
        console.info("Login successful");
        const sessionToken = generateSessionToken();
        console.info("Session token:", sessionToken);

        await saveSession(sessionToken);

        const response = new Response(null, {
          status: 302,
          headers: {
            Location: "/panel/",
            "Set-Cookie": `session=${sessionToken}; HttpOnly; Path=/; Max-Age=7200; SameSite=Strict`,
            "Cache-Control": "no-cache, no-store, must-revalidate",
          },
        });
        return response;
      } else {
        console.info("Invalid credentials");
      }
    } else if (
      url.pathname == "/login/" ||
      (url.pathname == "/login" && req.method === "GET")
    ) {
      return serveDir(req, { fsRoot: "./admin/public" });
    } else if (
      url.pathname === "/panel" ||
      (url.pathname == "/panel/" && req.method === "GET")
    ) {
      const sessionToken = req.headers
        .get("cookie")
        ?.match(/session=([^;]+)/)?.[1];
      if (!sessionToken) {
        return new Response("Unauthorized", { status: 401 });
      }
      const validatedSessionToken = await validateSession(sessionToken);
      console.info("Session token sent to validateSession:", sessionToken);
      console.info("Validated session token:", validatedSessionToken);
      if (validatedSessionToken) {
        console.info("User is authenticated");
        return serveDir(req, { fsRoot: "./admin/public" });
      } else {
        console.info("Session validation failed");
        return new Response("Unauthorized", { status: 401 });
      }
    } else if (url.pathname.startsWith("/api/")) {
      return handleApiRequest(req);
    } else if (
      url.pathname == "/panel/products/" ||
      (url.pathname == "/panel/products" && req.method === "GET")
    ) {
      try {
        const sessionToken = req.headers
          .get("cookie")
          ?.match(/session=([^;]+)/)?.[1];
        if (!sessionToken) {
          return new Response("Unauthorized", { status: 401 });
        }
        const validatedSessionToken = await validateSession(sessionToken);
        console.info("Session token sent to validateSession:", sessionToken);
        console.info("Validated session token:", validatedSessionToken);
        if (!validatedSessionToken) {
          console.info("Session validation failed");
          return new Response("Unauthorized", { status: 401 });
        }
        const products = await mysql.query("SELECT * FROM Products");
        // console.info(Deno.inspect(products, { depth: Infinity, colors: true }));
        const body = await renderFileToString(
          "./admin/public/panel/products/index.ejs",
          { shopItems: products, shopTopText: "Available Products" }
        );
        return new Response(body, {
          headers: { "Content-Type": "text/html; charset=utf-8" },
        });
      } catch (error) {
        console.error("Template rendering error:", error);
        return new Response("Error rendering template", { status: 500 });
      }
    } else if (
      url.pathname == "/panel/news/" ||
      (url.pathname == "/panel/news" && req.method === "GET")
    ) {
      try {
        const sessionToken = req.headers
          .get("cookie")
          ?.match(/session=([^;]+)/)?.[1];
        if (!sessionToken) {
          return new Response("Unauthorized", { status: 401 });
        }
        const validatedSessionToken = await validateSession(sessionToken);
        console.info("Session token sent to validateSession:", sessionToken);
        console.info("Validated session token:", validatedSessionToken);
        if (!validatedSessionToken) {
          console.info("Session validation failed");
          return new Response("Unauthorized", { status: 401 });
        }
        const news = await mysql.query("SELECT * FROM News");
        const body = await renderFileToString(
          "./admin/public/panel/news/index.ejs",
          { newsItems: news, newsTopText: "Available News" }
        );
        return new Response(body, {
          headers: { "Content-Type": "text/html; charset=utf-8" },
        });
      } catch (error) {
        console.error("Template rendering error:", error);
        return new Response("Error rendering template", { status: 500 });
      }
    } else if (
      url.pathname == "/panel/discount/" ||
      (url.pathname == "/panel/discount" && req.method === "GET")
    ) {
      try {
        const sessionToken = req.headers
          .get("cookie")
          ?.match(/session=([^;]+)/)?.[1];
        if (!sessionToken) {
          return new Response("Unauthorized", { status: 401 });
        }
        const validatedSessionToken = await validateSession(sessionToken);
        console.info("Session token sent to validateSession:", sessionToken);
        console.info("Validated session token:", validatedSessionToken);
        if (!validatedSessionToken) {
          console.info("Session validation failed");
          return new Response("Unauthorized", { status: 401 });
        }
        const discounts = await mysql.query("SELECT * FROM Discount");
        const body = await renderFileToString(
          "./admin/public/panel/discount/index.ejs",
          { discountItems: discounts, discountTopText: "Available Discounts" }
        );
        return new Response(body, {
          headers: { "Content-Type": "text/html; charset=utf-8" },
        });
      } catch (error) {
        console.error("Template rendering error:", error);
        return new Response("Error rendering template", { status: 500 });
      }
    } else if (
      url.pathname == "/panel/stickers/" ||
      (url.pathname == "/panel/stickers" && req.method === "GET")
    ) {
      try {
        const sessionToken = req.headers
          .get("cookie")
          ?.match(/session=([^;]+)/)?.[1];
        if (!sessionToken) {
          return new Response("Unauthorized", { status: 401 });
        }
        const validatedSessionToken = await validateSession(sessionToken);
        console.info("Session token sent to validateSession:", sessionToken);
        console.info("Validated session token:", validatedSessionToken);
        if (!validatedSessionToken) {
          console.info("Session validation failed");
          return new Response("Unauthorized", { status: 401 });
        }
        const stickers = await mysql.query("SELECT * FROM Stickers");
        const body = await renderFileToString(
          "./admin/public/panel/stickers/index.ejs",
          { stickerItems: stickers, stickerTopText: "Available Stickers" }
        );
        return new Response(body, {
          headers: { "Content-Type": "text/html; charset=utf-8" },
        });
      } catch (error) {
        console.error("Template rendering error:", error);
        return new Response("Error rendering template", { status: 500 });
      }
    }
    // Serve files from the 'public' directory for all other paths
    return serveDir(req, { fsRoot: "./admin/public" });
  } catch (error) {
    console.error("Error handling request:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
});
