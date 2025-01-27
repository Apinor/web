import { createSqlConnection } from "../dbscripts/DbConnection.ts";
import { validateSession } from "../utils/sessionUtils.ts";
import console from "../utils/logging.ts";

const mysql = await createSqlConnection();

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

  // Handle different API endpoints
  switch (url.pathname) {
    case "/api/status":
      return new Response(JSON.stringify({ status: "ok" }), {
        headers: { "Content-Type": "application/json" },
      });

    // Add more API endpoints here
    default:
      return new Response(JSON.stringify({ error: "Not Found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
  }
}
