import { createSqlConnection } from "../dbscripts/DbConnection.ts";
import { validateSession } from "../utils/sessionUtils.ts";
import console from "../utils/logging.ts";

interface ProductData {
  name: string;
  price: number;
  description?: string;
  quantity?: number;
  image_path?: string;
  discount?: number;
  discount_id?: number;
  sticker_id?: number;
}

const mysql = await createSqlConnection();

async function createProduct(data: ProductData): Promise<number | null> {
  try {
    const result = await mysql.query(
      `INSERT INTO Products (
                Name, Price, Description, Quantity, Image_Path,
                Created_At, Modified_At, Status, Discount, Discount_ID, Sticker_ID
            ) VALUES (?, ?, ?, ?, ?, NOW(), NOW(), ?, ?, ?, ?)`,
      [
        data.name,
        data.price,
        data.description || null,
        data.quantity || 0,
        data.image_path || null,
        1, // Status
        data.discount || null,
        data.discount_id || null,
        data.sticker_id || null,
      ]
    );

    // console.info("Insert result:", JSON.stringify(result, null, 2));
    // console.info("Result something", JSON.stringify(result))
    // console.info("Result something2", result.affectedRows)
    return result.affectedRows || null;
  } catch (error) {
    console.error("Error creating product:", error);
    console.error("Product data:", JSON.stringify(data, null, 2));
    return null;
  }
}
async function getProducts(): Promise<ProductData[]> {
  try {
    const result = await mysql.query("SELECT * FROM Products");
    // console.info("Result from getting products", JSON.stringify(result))
    return result as ProductData[];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}
async function getDiscounts() {
  try {
    const result = await mysql.query("SELECT * FROM Discount");
    return result;
  } catch (error) {
    console.error("Error fetching discounts:", error);
    return [];
  }
}

async function getTransactions() {
  try {
    const result = await mysql.query("SELECT * FROM Transactions");
    return result;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
}

async function getStickers() {
  try {
    const result = await mysql.query("SELECT * FROM Stickers");
    return result;
  } catch (error) {
    console.error("Error fetching stickers:", error);
    return [];
  }
}

async function getNews() {
  try {
    const result = await mysql.query("SELECT * FROM News");
    return result;
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}

async function getUsers() {
  try {
    const result = await mysql.query("SELECT * FROM Users");
    return result;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

async function getSessions() {
  try {
    const result = await mysql.query("SELECT * FROM Sessions");
    return result;
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return [];
  }
}

async function getBanner() {
  try {
    const result = await mysql.query("SELECT * FROM Banner");
    return result;
  } catch (error) {
    console.error("Error fetching banner:", error);
    return [];
  }
}

async function getFeatured_product() {
  try {
    const result = await mysql.query("SELECT * FROM Featured_Product");
    return result;
  } catch (error) {
    console.error("Error fetching featured product:", error);
    return [];
  }
}
export async function handleApiRequest(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const sessionToken = req.headers.get("cookie")?.match(/session=([^;]+)/)?.[1];

  // Check authentication for all API routes
  if (!sessionToken || !(await validateSession(sessionToken))) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (url.pathname === "/api/products" && req.method === "POST") {
    try {
      const formData = await req.formData();
      // Log the received form data
      console.info("Received form data:", Object.fromEntries(formData));

      const productData: ProductData = {
        name: formData.get("name") as string,
        price: parseFloat(formData.get("price") as string),
        description: (formData.get("description") as string) || undefined,
        quantity: parseInt(formData.get("quantity") as string) || 0,
        image_path: (formData.get("image_path") as string) || undefined,
        discount: parseFloat(formData.get("discount") as string) || undefined,
        discount_id:
          parseInt(formData.get("discount_id") as string) || undefined,
        sticker_id: parseInt(formData.get("sticker_id") as string) || undefined,
      };

      // Log the parsed product data
      console.info("Parsed product data:", JSON.stringify(productData));

      // Validate required fields
      if (!productData.name || isNaN(productData.price)) {
        return new Response(
          JSON.stringify({
            error: "Name and valid price are required",
            received: productData,
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      const productId = await createProduct(productData);
      console.info("Product ID:", productId);
      if (productId) {
        return new Response(
          JSON.stringify({
            success: true,
            message: "Product created successfully",
            product_id: productId,
          }),
          {
            status: 201,
            headers: { "Content-Type": "application/json" },
          }
        );
      } else {
        throw new Error("Failed to create product in database");
      }
    } catch (error) {
      console.error("Product creation error:", error);
      return new Response(
        JSON.stringify({
          error: error instanceof Error ? error.message : "Unknown error",
          details: error instanceof Error ? error.stack : undefined,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }
  if (url.pathname === "/api/products" && req.method === "GET") {
    const products = await getProducts();
    return new Response(JSON.stringify(products), {
      headers: { "Content-Type": "application/json" },
    });
  }
  if (url.pathname === "/api/discounts" && req.method === "GET") {
    const discounts = await getDiscounts();
    return new Response(JSON.stringify(discounts), {
      headers: { "Content-Type": "application/json" },
    });
  }
  if (url.pathname === "/api/transactions" && req.method === "GET") {
    const transactions = await getTransactions();
    return new Response(JSON.stringify(transactions), {
      headers: { "Content-Type": "application/json" },
    });
  }
  if (url.pathname === "/api/stickers" && req.method === "GET") {
    const stickers = await getStickers();
    return new Response(JSON.stringify(stickers), {
      headers: { "Content-Type": "application/json" },
    });
  }
  if (url.pathname === "/api/news" && req.method === "GET") {
    const news = await getNews();
    return new Response(JSON.stringify(news), {
      headers: { "Content-Type": "application/json" },
    });
  }
  if (url.pathname === "/api/users" && req.method === "GET") {
    const users = await getUsers();
    return new Response(JSON.stringify(users), {
      headers: { "Content-Type": "application/json" },
    });
  }
  if (url.pathname === "/api/sessions" && req.method === "GET") {
    const sessions = await getSessions();
    return new Response(JSON.stringify(sessions), {
      headers: { "Content-Type": "application/json" },
    });
  }
  if (url.pathname === "/api/banner" && req.method === "GET") {
    const banner = await getBanner();
    return new Response(JSON.stringify(banner), {
      headers: { "Content-Type": "application/json" },
    });
  }
  if (url.pathname === "/api/featured_product" && req.method === "GET") {
    const featured_product = await getFeatured_product();
    return new Response(JSON.stringify(featured_product), {
      headers: { "Content-Type": "application/json" },
    });
  }
  // Handle different API endpoints
  switch (url.pathname) {
    case "/api/status":
      return new Response(JSON.stringify({ status: "ok" }), {
        headers: { "Content-Type": "application/json" },
      });
    default:
      return new Response(JSON.stringify({ error: "Not Found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
  }
}
