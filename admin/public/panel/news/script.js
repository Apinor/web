document.addEventListener("DOMContentLoaded", function () {
    // Fetch available stickers
  
    // Form submission
    const form = document.getElementById("newsForm");
    const messageDiv = document.getElementById("responseMessage");
  
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
  
      if (!form.checkValidity()) {
        e.stopPropagation();
        form.classList.add("was-validated");
        return;
      }
  
      const formData = new FormData(form);
  
      try {
        const response = await fetch("/api/news", {
          method: "POST",
          body: formData,
        });
  
        const result = await response.json();
  
        messageDiv.style.display = "block";
        if (response.ok) {
          messageDiv.className = "alert alert-success mt-3";
          messageDiv.textContent = "News created successfully!";
          form.reset();
          form.classList.remove("was-validated");
        } else {
          messageDiv.className = "alert alert-danger mt-3";
          messageDiv.textContent = result.error || "Error creating news";
        }
      } catch (error) {
        messageDiv.style.display = "block";
        messageDiv.className = "alert alert-danger mt-3";
        messageDiv.textContent = "Error creating news";
        console.error("Error:", error);
      }
    });
  });

  function deleteItem(id){
    console.log("Delete button clicked with id: ", id);
    fetch(`/api/news/`, {
      method: "DELETE",
      body: JSON.stringify({ id: id }),
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          alert("News deleted successfully!");
        } else {
          response.json().then((error) => {
            alert(`Error: ${error.error}`);
          });
        }
      })
      .catch((error) => {
        alert("Failed to delete news: " + error.message);
      });
  }