document.getElementById("productForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);

  try {
    const response = await fetch("/api/products", {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const result = await response.json();
    if (response.ok) {
      alert("Product created successfully!");
      e.target.reset();
    } else {
      alert(`Error: ${result.error}`);
    }
  } catch (error) {
    alert("Failed to create product: " + error.message);
  }
});
document.getElementById("checkStatus").addEventListener("click", async () => {
  console.log("Checking API status");
  try {
    const response = await fetch("/api/status", {
      credentials: "include", // This ensures cookies are sent with the request
    });

    const data = await response.json();
    const statusDiv = document.getElementById("statusResult");

    if (response.ok) {
      statusDiv.innerHTML = `<div class="alert alert-success">API Status: ${data.status}</div>`;
    } else {
      statusDiv.innerHTML = `<div class="alert alert-danger">Error: ${data.error}</div>`;
    }
  } catch (error) {
    document.getElementById(
      "statusResult"
    ).innerHTML = `<div class="alert alert-danger">Error connecting to API: ${error.message}</div>`;
  }
});
document.getElementById("getProducts").addEventListener("click", async () => {
  try {
    const getProductsStatusDiv = document.getElementById(
      "getProductsStatusResult"
    );

    const response = await fetch("/api/products", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const products = await response.json();
    getProductsStatusDiv.innerHTML = `<div class="alert alert-success">Fetching products Status: OK </div>`;
    const tableHTML = `
      <table class="table table-dark table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Description</th>
            <th>Quantity</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${products
            .map(
              (product) => `
            <tr>
              <td>${product.ID || "-"}</td>
              <td>${product.Name || "-"}</td>
              <td>${product.Price || "-"}</td>
              <td>${product.Description || "-"}</td>
              <td>${product.Quantity || "0"}</td>
              <td>${product.Status ? "Active" : "Inactive"}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;

    document.getElementById("productsTable").innerHTML = tableHTML;
  } catch (error) {

    
    const getProductsStatusDiv = document.getElementById(
      "getProductsStatusResult"
    );

    getProductsStatusDiv.innerHTML = `<div class="alert alert-danger">Fetching products Status: ${error} </div>`;

    console.error("Error:", error);
  }
});
document.getElementById("getDiscounts").addEventListener("click", async () => {
  try {
    const statusDiv = document.getElementById("getDiscountsStatusResult");
    const response = await fetch("/api/discounts", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const discounts = await response.json();
    statusDiv.innerHTML = `<div class="alert alert-success">Fetching discounts Status: OK </div>`;
    const tableHTML = `
      <table class="table table-dark table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Discount Percent</th>
            <th>Discount Amount</th>
            <th>Sticker ID</th>
          </tr>
        </thead>
        <tbody>
          ${discounts.map(discount => `
            <tr>
              <td>${discount.ID || "-"}</td>
              <td>${discount.Name || "-"}</td>
              <td>${discount.Description || "-"}</td>
              <td>${discount.Discount_Percent || "-"}</td>
              <td>${discount.Discount_Amount || "-"}</td>
              <td>${discount.Sticker_ID || "-"}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
    document.getElementById("discountsTable").innerHTML = tableHTML;
  } catch (error) {
    const statusDiv = document.getElementById("getDiscountsStatusResult");
    statusDiv.innerHTML = `<div class="alert alert-danger">Fetching discounts Status: ${error}</div>`;
    console.error("Error:", error);
  }
});
document.getElementById("getStickers").addEventListener("click", async () => {
  try {
    const statusDiv = document.getElementById("getStickersStatusResult");
    const response = await fetch("/api/stickers", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const stickers = await response.json();
    statusDiv.innerHTML = `<div class="alert alert-success">Fetching stickers Status: OK </div>`;
    const tableHTML = `
      <table class="table table-dark table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          ${stickers.map(sticker => `
            <tr>
              <td>${sticker.ID || "-"}</td>
              <td>${sticker.Name || "-"}</td>
              <td>${sticker.Description || "-"}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
    document.getElementById("stickersTable").innerHTML = tableHTML;
  } catch (error) {
    const statusDiv = document.getElementById("getStickersStatusResult");
    statusDiv.innerHTML = `<div class="alert alert-danger">Fetching stickers Status: ${error}</div>`;
    console.error("Error:", error);
  }
});
document.getElementById("getNews").addEventListener("click", async () => {
  try {
    const statusDiv = document.getElementById("getNewsStatusResult");
    const response = await fetch("/api/news", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const news = await response.json();
    statusDiv.innerHTML = `<div class="alert alert-success">Fetching news Status: OK </div>`;
    const tableHTML = `
      <table class="table table-dark table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Header</th>
            <th>Info Text</th>
            <th>Activated</th>
          </tr>
        </thead>
        <tbody>
          ${news.map(item => `
            <tr>
              <td>${item.ID || "-"}</td>
              <td>${item.Name || "-"}</td>
              <td>${item.Description || "-"}</td>
              <td>${item.News_Header || "-"}</td>
              <td>${item.News_InfoText || "-"}</td>
              <td>${item.Activated ? "Yes" : "No"}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
    document.getElementById("newsTable").innerHTML = tableHTML;
  } catch (error) {
    const statusDiv = document.getElementById("getNewsStatusResult");
    statusDiv.innerHTML = `<div class="alert alert-danger">Fetching news Status: ${error}</div>`;
    console.error("Error:", error);
  }
});
document.getElementById("getBanner").addEventListener("click", async () => {
  try {
    const statusDiv = document.getElementById("getBannerStatusResult");
    const response = await fetch("/api/banner", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const banners = await response.json();
    statusDiv.innerHTML = `<div class="alert alert-success">Fetching banner Status: OK </div>`;
    const tableHTML = `
      <table class="table table-dark table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Header</th>
            <th>Text</th>
            <th>Activated</th>
          </tr>
        </thead>
        <tbody>
          ${banners.map(banner => `
            <tr>
              <td>${banner.ID || "-"}</td>
              <td>${banner.Name || "-"}</td>
              <td>${banner.Description || "-"}</td>
              <td>${banner.Banner_Header || "-"}</td>
              <td>${banner.Banner_Text || "-"}</td>
              <td>${banner.Activated ? "Yes" : "No"}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
    document.getElementById("bannerTable").innerHTML = tableHTML;
  } catch (error) {
    const statusDiv = document.getElementById("getBannerStatusResult");
    statusDiv.innerHTML = `<div class="alert alert-danger">Fetching banner Status: ${error}</div>`;
    console.error("Error:", error);
  }
});
document.getElementById("getFeaturedProduct").addEventListener("click", async () => {
  try {
    const statusDiv = document.getElementById("getFeaturedProductStatusResult");
    const response = await fetch("/api/featured_product", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const featuredProducts = await response.json();
    statusDiv.innerHTML = `<div class="alert alert-success">Fetching featured products Status: OK </div>`;
    const tableHTML = `
      <table class="table table-dark table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Product ID</th>
            <th>Activated</th>
          </tr>
        </thead>
        <tbody>
          ${featuredProducts.map(product => `
            <tr>
              <td>${product.ID || "-"}</td>
              <td>${product.Product_ID || "-"}</td>
              <td>${product.Activated ? "Yes" : "No"}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
    document.getElementById("featuredProductTable").innerHTML = tableHTML;
  } catch (error) {
    const statusDiv = document.getElementById("getFeaturedProductStatusResult");
    statusDiv.innerHTML = `<div class="alert alert-danger">Fetching featured products Status: ${error}</div>`;
    console.error("Error:", error);
  }
}
);
document.getElementById("getTransactions").addEventListener("click", async () => {
  try {
    const statusDiv = document.getElementById("getTransactionsStatusResult");
    const response = await fetch("/api/transactions", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const transactions = await response.json();
    statusDiv.innerHTML = `<div class="alert alert-success">Fetching transactions Status: OK </div>`;
    const tableHTML = `
      <table class="table table-dark table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Product ID</th>
            <th>User ID</th>
            <th>Status</th>
            <th>Initiated</th>
            <th>Payed Price</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          ${transactions.map(transaction => `
            <tr>
              <td>${transaction.ID || "-"}</td>
              <td>${transaction.Product_ID || "-"}</td>
              <td>${transaction.User_ID || "-"}</td>
              <td>${transaction.Status || "0"}</td>
              <td>${transaction.Initiated || "-"}</td>
              <td>${transaction.Payed_Price || "-"}</td>
              <td>${transaction.Quantity || "1"}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
    document.getElementById("transactionsTable").innerHTML = tableHTML;
  } catch (error) {
    const statusDiv = document.getElementById("getTransactionsStatusResult");
    statusDiv.innerHTML = `<div class="alert alert-danger">Fetching transactions Status: ${error}</div>`;
    console.error("Error:", error);
  }
});
document.getElementById("getSessions").addEventListener("click", async () => {
  try {
    const statusDiv = document.getElementById("getSessionsStatusResult");
    const response = await fetch("/api/sessions", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const sessions = await response.json();
    statusDiv.innerHTML = `<div class="alert alert-success">Fetching sessions Status: OK </div>`;
    const tableHTML = `
      <table class="table table-dark table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Created At</th>
            <th>Duration (seconds)</th>
            <th>Active</th>
            <th>Token</th>
          </tr>
        </thead>
        <tbody>
          ${sessions.map(session => `
            <tr>
              <td>${session.ID || "-"}</td>
              <td>${session.Created_At || "-"}</td>
              <td>${session.Duration_Seconds || "-"}</td>
              <td>${session.Active ? "Yes" : "No"}</td>
              <td>${session.Token || "-"}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
    document.getElementById("sessionsTable").innerHTML = tableHTML;
  } catch (error) {
    const statusDiv = document.getElementById("getSessionsStatusResult");
    statusDiv.innerHTML = `<div class="alert alert-danger">Fetching sessions Status: ${error}</div>`;
    console.error("Error:", error);
  }
});
document.getElementById("getUsers").addEventListener("click", async () => {
  try {
    const statusDiv = document.getElementById("getUsersStatusResult");
    const response = await fetch("/api/users", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const users = await response.json();
    statusDiv.innerHTML = `<div class="alert alert-success">Fetching users Status: OK </div>`;
    const tableHTML = `
      <table class="table table-dark table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cookie ID</th>
            <th>First Visit</th>
            <th>Last Visit</th>
            <th>Total Visits</th>
            <th>Cart ID</th>
          </tr>
        </thead>
        <tbody>
          ${users.map(user => `
            <tr>
              <td>${user.ID || "-"}</td>
              <td>${user.Cookie_ID || "-"}</td>
              <td>${user.First_Visit || "-"}</td>
              <td>${user.Last_Visit || "-"}</td>
              <td>${user.Total_Visits || "0"}</td>
              <td>${user.Cart_ID || "-"}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
    document.getElementById("usersTable").innerHTML = tableHTML;
  } catch (error) {
    const statusDiv = document.getElementById("getUsersStatusResult");
    statusDiv.innerHTML = `<div class="alert alert-danger">Fetching users Status: ${error}</div>`;
    console.error("Error:", error);
  }
});