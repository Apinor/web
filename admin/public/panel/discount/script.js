document.addEventListener('DOMContentLoaded', async function() {
    // Fetch available stickers
    try {
      const response = await fetch('/api/stickers');
      const stickers = await response.json();
      const stickerSelect = document.getElementById('sticker_id');
      
      stickers.forEach(sticker => {
        const option = document.createElement('option');
        option.value = sticker.ID;
        option.textContent = sticker.Name;
        stickerSelect.appendChild(option);
      });
    } catch (error) {
      console.error('Error fetching stickers:', error);
    }

    // Form submission
    const form = document.getElementById('discountForm');
    const messageDiv = document.getElementById('responseMessage');

    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      if (!form.checkValidity()) {
        e.stopPropagation();
        form.classList.add('was-validated');
        return;
      }

      const formData = new FormData(form);
      
      try {
        const response = await fetch('/api/discounts', {
          method: 'POST',
          body: formData
        });

        const result = await response.json();

        messageDiv.style.display = 'block';
        if (response.ok) {
          messageDiv.className = 'alert alert-success mt-3';
          messageDiv.textContent = 'Discount created successfully!';
          form.reset();
          form.classList.remove('was-validated');
        } else {
          messageDiv.className = 'alert alert-danger mt-3';
          messageDiv.textContent = result.error || 'Error creating discount';
        }
      } catch (error) {
        messageDiv.style.display = 'block';
        messageDiv.className = 'alert alert-danger mt-3';
        messageDiv.textContent = 'Error creating discount';
        console.error('Error:', error);
      }
    });
  });
  function deleteItem(id){
    console.log("Delete button clicked with id: ", id);
    fetch(`/api/discount/`, {
      method: "DELETE",
      body: JSON.stringify({ id: id }),
      credentials: "include",
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        const productElement = document.getElementById(`discountID-${id}`);
        if (productElement) {
          productElement.remove();
        }
      } else {
        console.error('Deletion failed:', data.error);
      }
    })
      .catch((error) => {
        alert("Failed to delete discount: " + error.message);
      });
  }