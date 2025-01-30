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
