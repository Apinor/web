import { serveDir } from "https://deno.land/std@0.224.0/http/file_server.ts";
import { renderFile } from "https://deno.land/x/dejs@0.10.3/mod.ts";

Deno.serve(async (req: Request) => {
  try {
    const url = new URL(req.url);

    // Serve the EJS template for the root route
    if (url.pathname === "/") {
      const body = await renderFile("./views/index.ejs", { title: "Apinor" });

      return new Response(body, { 
        headers: { "Content-Type": "text/html" } 
      });
    }

    // Serve static files from the 'public' directory
    return serveDir(req, { fsRoot: "./public" });

  } catch (error) {
    console.error("Error handling request:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
});
