import { serveDir } from "https://deno.land/std@0.224.0/http/file_server.ts";
import { join } from "https://deno.land/std@0.224.0/path/join.ts";
import { configure, renderFile } from "https://deno.land/x/eta@v2.2.0/mod.ts";

// Configure Eta
configure({
  views: join(Deno.cwd(), "public", "views"),
  cache: true,
});
const templateData = {
  title: "Apinor",
  newsCarousel: ["News Item 1", "News Item 2", "News Item 3"],
  shopTopText: "Welcome to the shop!",
  shopItems: [
    { title: "Item 1", description: "Description 1", price: "$10" },
    { title: "Item 2", description: "Description 2", price: "$20" },
  ],
  news: [
    { title: "Breaking News", content: "Something big happened!" },
    { title: "Update", content: "Here's what's new." },
  ],
  footer: "© 2025 Apinor",
};


Deno.serve(async (req: Request) => {
  try {
    const url = new URL(req.url);

    if (url.pathname === "/") {
      try {
        const body = await renderFile("index.ejs", templateData);
        
        if (!body) {
          throw new Error("Template rendered empty content");
        }

        console.log("Template rendered successfully");
        
        return new Response(body, { 
          headers: { "Content-Type": "text/html; charset=utf-8" } 
        });
      } catch (err) {
        console.error("Template rendering error:", err);
        return new Response("Error rendering template", { status: 500 });
      }
    }

    return serveDir(req, { fsRoot: "./public" });
  } catch (error) {
    console.error("Error handling request:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
});