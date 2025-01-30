import { renderFileToString } from "https://deno.land/x/dejs@0.10.3/mod.ts";
import { serveFile } from "https://deno.land/std@0.114.0/http/file_server.ts";

// Mock data structure
const templateData = {
  title: "Apinor",
  newsCarousel: [
    "New Product Launch Coming Soon!",
    "Holiday Special Offers",
    "Join Our Newsletter"
  ],
  shopTopText: "Velkommen til Apinor!",
  shopItems: [
    {
      title: "Premium Honey",
      description: "Pure natural honey from Norwegian bees",
      price: "299 kr",
      image: "public/images/products/Apifor.png"
    },
    {
      title: "Beeswax Candles",
      description: "Hand-crafted natural beeswax candles",
      price: "159 kr",
      image: "public/images/products/Apifor.png"
    },
    {
      title: "Bee Pollen",
      description: "Fresh bee pollen supplements",
      price: "199 kr",
      image: "public/images/products/Apifor.png"
    },
    {
      title: "Bee bolan braut",
      description: "Fresh bee pollen supplements",
      price: "199 kr",
      image: "public/images/products/Apifor.png"
    }
  ],
  news: [
    {
      image: "public/images/news/DrippBag.jpg",
      title: "Sustainable Beekeeping Workshop",
      date: "2025-02-15",
      content: "Join us for a day of learning about sustainable beekeeping practices."
    },
    {
      image: "public/images/news/ApiForNews.png",
      title: "New Honey Harvest",
      date: "2025-01-20",
      content: "Our latest honey harvest is now available in stores!"
    }
  ],
  footer: {
    companyInfo: "© 2025 Apinor AS",
    contact: {
      email: "post@apinor.no",
      phone: "+47 123 45 678"
    },
    social: {
      facebook: "apinor.facebook",
      instagram: "apinor.insta"
    }
  }
};

Deno.serve({ port: 8000 }, async (req: Request) => {
  const url = new URL(req.url);
  const pathname = url.pathname;

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

console.log("Server running at http://localhost:8000");