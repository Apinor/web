import { renderFileToString } from "https://deno.land/x/dejs@0.10.3/mod.ts";

// Mock data structure
const templateData = {
  title: "Apinor",
  newsCarousel: [
    "New Product Launch Coming Soon!",
    "Holiday Special Offers",
    "Join Our Newsletter"
  ],
  shopTopText: "Welcome to Apinor Shop",
  shopItems: [
    {
      title: "Premium Honey",
      description: "Pure natural honey from Norwegian bees",
      price: "299 kr",
      image: "/images/products/honey1.jpg"
    },
    {
      title: "Beeswax Candles",
      description: "Hand-crafted natural beeswax candles",
      price: "159 kr",
      image: "/images/products/candles1.jpg"
    },
    {
      title: "Bee Pollen",
      description: "Fresh bee pollen supplements",
      price: "199 kr",
      image: "/images/products/pollen1.jpg"
    }
  ],
  news: [
    {
      title: "Sustainable Beekeeping Workshop",
      date: "2025-02-15",
      content: "Join us for a day of learning about sustainable beekeeping practices."
    },
    {
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
  if (req.method === "GET" && new URL(req.url).pathname === "/") {
    try {
      const body = await renderFileToString("public/views/index.ejs", templateData);
      return new Response(body, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    } catch (error) {
      console.error("Template rendering error:", error);
      return new Response("Error rendering template", { status: 500 });
    }
  }

  return new Response("Not Found", { status: 404 });
});

console.log("Server running at http://localhost:8000");
