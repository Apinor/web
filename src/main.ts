import { serveDir } from "https://deno.land/std@0.224.0/http/file_server.ts";
import { renderFile } from "https://deno.land/x/dejs@0.10.3/mod.ts";

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

    // Serve the EJS template for the root route
    if (url.pathname === "/") {
      const body = await renderFile("public/views/index.ejs", templateData); // Pass `templateData` here
      console.log("Template Data:", templateData);


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
