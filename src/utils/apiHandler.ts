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
                data.sticker_id || null
            ]
        );

        // Remove array destructuring and access result directly
        console.info("Insert result:", JSON.stringify(result, null, 2));
        return result[0]?.insertId || null;
    } catch (error) {
        console.error("Error creating product:", error);
        console.error("Product data:", JSON.stringify(data, null, 2));
        return null;
    }
}
export async function handleApiRequest(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const sessionToken = req.headers.get("cookie")?.match(/session=([^;]+)/)?.[1];

    // Check authentication for all API routes
    if (!sessionToken || !(await validateSession(sessionToken))) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" }
        });
    }

    // Handle different API endpoints
    switch (url.pathname) {
        case "/api/status":
            return new Response(JSON.stringify({ status: "ok" }), {
                headers: { "Content-Type": "application/json" }
            });

            case "/api/products":
                if (req.method !== "POST") {
                    return new Response(JSON.stringify({ error: "Method not allowed" }), {
                        status: 405,
                        headers: { "Content-Type": "application/json" }
                    });
                }
            
                try {
                    const formData = await req.formData();
                    // Log the received form data
                    console.info("Received form data:", Object.fromEntries(formData));
            
                    const productData: ProductData = {
                        name: formData.get("name") as string,
                        price: parseFloat(formData.get("price") as string),
                        description: formData.get("description") as string || undefined,
                        quantity: parseInt(formData.get("quantity") as string) || 0,
                        image_path: formData.get("image_path") as string || undefined,
                        discount: parseFloat(formData.get("discount") as string) || undefined,
                        discount_id: parseInt(formData.get("discount_id") as string) || undefined,
                        sticker_id: parseInt(formData.get("sticker_id") as string) || undefined
                    };
            
                    // Log the parsed product data
                    console.info("Parsed product data:", productData);
            
                    // Validate required fields
                    if (!productData.name || isNaN(productData.price)) {
                        return new Response(JSON.stringify({ 
                            error: "Name and valid price are required",
                            received: productData 
                        }), {
                            status: 400,
                            headers: { "Content-Type": "application/json" }
                        });
                    }
            
                    const productId = await createProduct(productData);
                    if (productId) {
                        return new Response(JSON.stringify({ 
                            success: true, 
                            message: "Product created successfully",
                            product_id: productId 
                        }), {
                            status: 201,
                            headers: { "Content-Type": "application/json" }
                        });
                    } else {
                        throw new Error("Failed to create product in database");
                    }
                } catch (error) {
                    console.error("Product creation error:", error);
                    return new Response(JSON.stringify({ 
                        error: error instanceof Error ? error.message : "Unknown error",
                        details: error instanceof Error ? error.stack : undefined
                    }), {
                        status: 500,
                        headers: { "Content-Type": "application/json" }
                    });
                }
        default:
            return new Response(JSON.stringify({ error: "Not Found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" }
            });
    }
}