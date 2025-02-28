console.log("Products script loaded");
document.getElementById("productForm").addEventListener("submit", async (e) => {
  console.log("Product form submitted");
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
      // alert("Product created successfully!");
      e.target.reset();
    } else {
      alert(`Error: ${result.error}`);
    }
  } catch (error) {
    alert("Failed to create product: " + error.message);
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
function deleteItem(id){
  console.log("Delete button clicked with id: ", id);
  fetch(`/api/products/`, {
    method: "DELETE",
    body: JSON.stringify({ id: id }),
    credentials: "include",
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      const productElement = document.getElementById(`productID-${id}`);
      if (productElement) {
        productElement.remove();
      }
    } else {
      console.error('Deletion failed:', data.error);
    }
  })
    .catch((error) => {
      alert("Failed to delete product: " + error.message);
    });
}