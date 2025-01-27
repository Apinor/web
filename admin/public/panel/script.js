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
