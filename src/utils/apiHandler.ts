import { createSqlConnection } from "../dbscripts/DbConnection.ts";
import { validateSession } from "../utils/sessionUtils.ts";
import console from "../utils/logging.ts";

const mysql = await createSqlConnection();
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
interface Discount {
  name: string;
  description?: string;
  Discount_Percent?: number;
  Discount_Amount?: number;
  Sticker_ID?: number;
}
interface Stickers {
  name: string;
  description?: string;
}
interface Users {
  Cookie_ID: string;
  First_Visit: string;
  Last_Visit: string;
  Total_Visits: number;
  Cart_ID: number;
}

interface Cart {
  User_ID: number;
}
interface CartItems {
  Cart_ID: number;
  Product_ID: number;
  Quantity: number;
  Added_to_cart: string;
}

interface Transactions {
  Product_ID: number;
  User_ID: number;
  Status: number;
  Initiated: string;
  Payed_Price: number;
  Quantity: number;
}

interface Banner {
  Name: string;
  Description: string;
  Banner_Header: string;
  Banner_Text: string;
  Banner_Image_Path: string;
  Activated: number;
}

interface News {
  Name?: string;
  Description?: string;
  News_Background_Image_Path?: string;
  News_Spotlight_Image_Path?: string;
  News_Spotlight_Image_Sticker_ID?: number;
  News_InfoText?: string;
  News_Header?: string;
  Activated?: number;
}

interface FeaturedProduct {
  Product_ID: number;
  Activated: number;
}

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
async function createSticker(data: Stickers): Promise<number | null> {
  try {
    const result = await mysql.query(
      "INSERT INTO Stickers (Name, Description) VALUES (?, ?)",
      [data.name, data.description || null]
    );
    return result.lastInsertId || null;
  } catch (error) {
    console.error("Error creating sticker:", error);
    return null;
  }
}

async function createDiscount(data: Discount): Promise<number | null> {
  try {
    const result = await mysql.query(
      `INSERT INTO Discount (Name, Description, Discount_Percent, 
        Discount_Amount, Sticker_ID) VALUES (?, ?, ?, ?, ?)`,
      [
        data.name,
        data.description || null,
        data.Discount_Percent || null,
        data.Discount_Amount || null,
        data.Sticker_ID || null
      ]
    );
    return result.lastInsertId || null;
  } catch (error) {
    console.error("Error creating discount:", error);
    return null;
  }
}

async function createNews(data: News): Promise<number | null> {
  try {
    const result = await mysql.query(
      `INSERT INTO News (Name, Description, News_Background_Image_Path, 
        News_Spotlight_Image_Path, News_Spotlight_Image_Sticker_ID, 
        News_InfoText, News_Header, Activated) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.Name,
        data.Description,
        data.News_Background_Image_Path,
        data.News_Spotlight_Image_Path,
        data.News_Spotlight_Image_Sticker_ID,
        data.News_InfoText,
        data.News_Header,
        data.Activated || 0
      ]
    );
    return result.lastInsertId || null;
  } catch (error) {
    console.error("Error creating news:", error);
    return null;
  }
}

async function createBanner(data: Banner): Promise<number | null> {
  try {
    const result = await mysql.query(
      `INSERT INTO Banner (Name, Description, Banner_Header, 
        Banner_Text, Banner_Img_Path, Activated) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        data.Name,
        data.Description,
        data.Banner_Header,
        data.Banner_Text,
        data.Banner_Image_Path,
        data.Activated || 0
      ]
    );
    return result.lastInsertId || null;
  } catch (error) {
    console.error("Error creating banner:", error);
    return null;
  }
}

async function createFeaturedProduct(data: FeaturedProduct): Promise<number | null> {
  try {
    const result = await mysql.query(
      "INSERT INTO Featured_Product (Product_ID, Activated) VALUES (?, ?)",
      [data.Product_ID, data.Activated || 0]
    );
    return result.lastInsertId || null;
  } catch (error) {
    console.error("Error creating featured product:", error);
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

async function deleteProduct(id: string): Promise<boolean> {
  try {
    const result = await mysql.query(
      "DELETE FROM Products WHERE ID = ?",
      [id]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error deleting product:", error);
    return false;
  }
}

async function deleteDiscount(id: string): Promise<boolean> {
  try {
    const result = await mysql.query(
      "DELETE FROM Discount WHERE ID = ?",
      [id]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error deleting discount:", error);
    return false;
  }
}

async function deleteSticker(id: string): Promise<boolean> {
  try {
    const result = await mysql.query(
      "DELETE FROM Stickers WHERE ID = ?",
      [id]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error deleting sticker:", error);
    return false;
  }
}

async function deleteNews(id: string): Promise<boolean> {
  try {
    const result = await mysql.query(
      "DELETE FROM News WHERE ID = ?",
      [id]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error deleting news:", error);
    return false;
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
  if (url.pathname === "/api/stickers" && req.method === "POST") {
    try {
      const formData = await req.formData();
      const stickerData: Stickers = {
        name: formData.get("name") as string,
        description: formData.get("description") as string || undefined,
      };

      if (!stickerData.name) {
        return new Response(
          JSON.stringify({
            error: "Name is required",
            received: stickerData,
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      const stickerId = await createSticker(stickerData);
      if (stickerId) {
        return new Response(
          JSON.stringify({
            success: true,
            message: "Sticker created successfully",
            sticker_id: stickerId,
          }),
          {
            status: 201,
            headers: { "Content-Type": "application/json" },
          }
        );
      } else {
        throw new Error("Failed to create sticker in database");
      }
    } catch (error) {
      console.error("Sticker creation error:", error);
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

  if (url.pathname === "/api/discounts" && req.method === "POST") {
    try {
      const formData = await req.formData();
      const discountData: Discount = {
        name: formData.get("name") as string,
        description: formData.get("description") as string || undefined,
        Discount_Percent: parseFloat(formData.get("discount_percent") as string) || undefined,
        Discount_Amount: parseFloat(formData.get("discount_amount") as string) || undefined,
        Sticker_ID: parseInt(formData.get("sticker_id") as string) || undefined,
      };

      if (!discountData.name) {
        return new Response(
          JSON.stringify({
            error: "Name is required",
            received: discountData,
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      const discountId = await createDiscount(discountData);
      if (discountId) {
        return new Response(
          JSON.stringify({
            success: true,
            message: "Discount created successfully",
            discount_id: discountId,
          }),
          {
            status: 201,
            headers: { "Content-Type": "application/json" },
          }
        );
      } else {
        throw new Error("Failed to create discount in database");
      }
    } catch (error) {
      console.error("Discount creation error:", error);
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
  if (url.pathname === "/api/news" && req.method === "POST") {
    try {
      const formData = await req.formData();
      const newsData: News = {
        Name: formData.get("name") as string,
        Description: formData.get("description") as string || undefined,
        News_Spotlight_Image_Sticker_ID: parseInt(formData.get("News_Spotlight_Image_Sticker_ID") as string) || undefined,
        News_InfoText: formData.get("News_InfoText") as string || undefined,
        News_Header: formData.get("News_Header") as string || undefined,
        Activated: 1, // Default to activated when created
      };
  
      // Validate required fields based on your form
      if (!newsData.Name || !newsData.News_Header || !newsData.News_InfoText || !newsData.News_Spotlight_Image_Sticker_ID) {
        return new Response(
          JSON.stringify({
            error: "All required fields must be filled",
            received: newsData,
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
  
      // Verify sticker ID exists before creating news
      const stickerExists = await mysql.query(
        "SELECT ID FROM Stickers WHERE ID = ?",
        [newsData.News_Spotlight_Image_Sticker_ID]
      );
  
      if (!stickerExists.length) {
        return new Response(
          JSON.stringify({
            error: "Selected sticker ID does not exist",
            received: newsData,
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
  
      const newsId = await createNews(newsData);
      if (newsId) {
        return new Response(
          JSON.stringify({
            success: true,
            message: "News created successfully",
            news_id: newsId,
          }),
          {
            status: 201,
            headers: { "Content-Type": "application/json" },
          }
        );
      } else {
        throw new Error("Failed to create news in database");
      }
    } catch (error) {
      console.error("News creation error:", error);
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
  if (req.method === "DELETE") {
    switch (url.pathname){
      case "/api/products/":{
        const data = await req.json();
        const productId = data.id;
        if (!productId) {
          return new Response(JSON.stringify({ error: "Product ID is required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }
        const success = await deleteProduct(productId);
        if (success) {
          return new Response(JSON.stringify({ success: true }), {
            headers: { "Content-Type": "application/json" },
          });
        } else {
          return new Response(JSON.stringify({ error: "Failed to delete product" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      }
      case "/api/discount/":{
        const data = await req.json();
        const discountId = data.id;
        if (!discountId) {
          return new Response(JSON.stringify({ error: "Discount ID is required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }
        const success = await deleteDiscount(discountId);
        if (success) {
          return new Response(JSON.stringify({ success: true }), {
            headers: { "Content-Type": "application/json" },
          });
        } else {
          return new Response(JSON.stringify({ error: "Failed to delete discount" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      }
      case "/api/stickers/":{
        const data = await req.json();
        const stickerId = data.id;
        if (!stickerId) {
          return new Response(JSON.stringify({ error: "Sticker ID is required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }
        const success = await deleteSticker(stickerId);
        if (success) {
          return new Response(JSON.stringify({ success: true }), {
            headers: { "Content-Type": "application/json" },
          });
        } else {
          return new Response(JSON.stringify({ error: "Failed to delete sticker" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      }
      case "/api/news/":{
        const data = await req.json();
        const newsId = data.id;
        if (!newsId) {
          return new Response(JSON.stringify({ error: "News ID is required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }
        const success = await deleteNews(newsId);
        if (success) {
          return new Response(JSON.stringify({ success: true }), {
            headers: { "Content-Type": "application/json" },
          });
        } else {
          return new Response(JSON.stringify({ error: "Failed to delete news" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      }
    }
  }
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
