import { createSqlConnection } from "./dbscripts/DbConnection.ts";
import {
  serveDir,
  serveFile,
} from "https://deno.land/std@0.224.0/http/file_server.ts";
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
const mysql = await createSqlConnection();
if (mysql) {
  console.info("Database connection established!");
} else {
  console.error("Failed to connect to the database.");
}

interface ProductData {
  name: string;
  price: number;
  description?: string;
  quantity?: number;
  image_path?: string;
  discount?: number;
  discount_id?: number;
  sticker_id?: number;
  description_json?: string; // Add this field
}

async function getProducts(): Promise<ProductData[]> {
  try {
    const result = await mysql.query("SELECT * FROM Products");
    // Convert price to number and ensure all numeric fields are properly typed
    return (result as any[]).map(item => ({
      ...item,
      Price: Number(item.Price),
      Quantity: Number(item.Quantity),
      Discount: item.Discount ? Number(item.Discount) : null
    }));
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

async function getNews() {
  try {
    const result = await mysql.query("SELECT * FROM News WHERE Activated = 1");
    return result;
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}

async function getProductById(id: string): Promise<ProductData | null> {
  try {
    const result = await mysql.query("SELECT * FROM Products WHERE ID = ?", [id]);
    if (!result || result.length === 0) {
      return null;
    }
    // Convert numeric fields
    const product = result[0];
    return {
      ...product,
      Price: Number(product.Price),
      Quantity: Number(product.Quantity),
      Discount: product.Discount ? Number(product.Discount) : null,
      Description_JSON: product.Description_JSON ? JSON.parse(product.Description_JSON) : null // Parse JSON string
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}
Deno.serve(async (req: Request) => {
  const url = new URL(req.url);
  if (url.pathname.startsWith("/public/") || url.pathname.startsWith("/images/")) {
    try {
      // Remove /public/ from the path if it exists
      const actualPath = url.pathname.startsWith("/public/") 
        ? `.${url.pathname}`  // Keep the /public/ in path
        : `./public${url.pathname}`; // Add /public/ for images

      const response = await serveFile(req, actualPath);
      // Add cache headers for static assets
      response.headers.set("Cache-Control", "public, max-age=31536000");
      return response;
    } catch (error) {
      console.error("Static file serving error:", error);
      return new Response("File not found", { status: 404 });
    }
  }
  if (req.method === "GET" && url.pathname === "/") {
    try {
      const products = await getProducts();
      const news = await getNews();
      
      const templateData = {
        title: "Apinor - Home",
        shopTopText: "Our Products",
        shopItems: products,
        news: news,
        newsCarousel: [], // Empty array if you're not using this yet
        footer: {
          companyInfo: "© 2024 Apinor AS"
        }
      };

      const body = await renderFileToString(
        "public/views/index.ejs",
        templateData
      );
      return new Response(body, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    } catch (error) {
      console.error("Template rendering error:", error);
      return new Response("Error rendering template", { status: 500 });
    }
  }
  if (req.method === "GET" && url.pathname === "/") {
    try {
      const products = await getProducts();
      const templateData = {
        title: "Apinor - Home",
        shopTopText: "Our Products",
        shopItems: products,
        // ...other template data
      };

      const body = await renderFileToString(
        "public/views/index.ejs",
        templateData
      );
      return new Response(body, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    } catch (error) {
      console.error("Template rendering error:", error);
      return new Response("Error rendering template", { status: 500 });
    }
  } else if (req.method === "GET" && url.pathname.startsWith("/public")) {
    try {
      const filePath = "./public/";
      const file = await serveFile(req, filePath);
      return file;
    } catch (error) {
      console.error("File serving error:", error);
      return new Response("File not found", { status: 404 });
    }
  } else if (req.method === "GET" && url.pathname.startsWith("/public/views")) {
    try {
      const filePath = "./public/views/";
      const file = await serveFile(req, filePath);
      return file;
    } catch (error) {
      console.error("File serving error:", error);
      return new Response("File not found", { status: 404 });
    }
  } else if (req.method === "GET" && url.pathname === "/productPage") {
    try {
      const productId = url.searchParams.get("id");
      if (!productId) {
        return new Response("Product ID is required", { status: 400 });
      }
  
      const product = await getProductById(productId);
      if (!product) {
        return new Response("Product not found", { status: 404 });
      }
  
      const templateData = {
        title: `${product.name} - Apinor`,
        product: product,
        description: product.Description_JSON, // Pass the JSON description
        footer: {
          companyInfo: "© 2024 Apinor AS"
        }
      };
  
      const body = await renderFileToString(
        "public/views/productPage.ejs",
        templateData
      );
      return new Response(body, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    } catch (error) {
      console.error("Product page error:", error);
      return new Response("Error loading product page", { status: 500 });
    }
  }
  
  return serveDir(req, { fsRoot: "./public" });
});
