import { renderFileToString } from "https://deno.land/x/dejs@0.10.3/mod.ts";

Deno.serve({ port: 8000 }, async (req: Request) => {
  if (req.method === "GET" && new URL(req.url).pathname === "/") {
    // Data to pass to the EJS template
    const data = { title: "Welcome", name: "Deno User" };

    // Render the EJS template to a string
    const body = await renderFileToString("public/views/index.ejs", data);

    // Return the HTML response
    return new Response(body, {
      headers: { "Content-Type": "text/html" },
    });
  }

  // Handle 404 for other routes
  return new Response("Not Found", { status: 404 });
});

console.log("Server running at http://localhost:8000");
