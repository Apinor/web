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
