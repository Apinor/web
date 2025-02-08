
// main.ts
import { renderFileToString } from "https://deno.land/x/dejs@0.10.3/mod.ts";

const html = await renderFileToString("./views/index.ejs", {});

Deno.serve({ port: 8000 }, () => new Response(html, { headers: { "content-type": "text/html" } }));
