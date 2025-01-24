import { serveDir } from "https://deno.land/std@0.224.0/http/file_server.ts";
import { load } from "https://deno.land/std@0.224.0/dotenv/mod.ts";
import { Client } from "https://deno.land/x/mysql@v2.12.1/mod.ts";


Deno.serve(async (req: Request) => {
  try {
    const url = new URL(req.url);
  
    // Serve files from the 'public' directory for all other paths
    return serveDir(req, { fsRoot: "./public" });
  } catch (error) {
    console.error("Error handling request:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
});