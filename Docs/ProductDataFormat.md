# Product Data Format Documentation

Here is the documentation for how the Product data format (products Table) works:

```json
{
  // This is the output for the product table in the database. Here you can get a rough idea of what we can store in the database.
  "ID": 1,                          // Unique identifier for the product
  "Name": "Sample Product",         // Name of the product
  "Price": 19.99,                   // Price of the product
  "Description": "This is a sample product description.",  // Description of the product
  "Quantity": 100,                  // Available quantity of the product
  "Image_Path": "/images/sample_product.jpg",  // Path to the product image
  "Created-At": "2025-01-20 14:34:33",  // Timestamp when the product was created
  "Modified-At": "2025-01-20 14:34:33", // Timestamp when the product was last modified
  "Status": 1,                      // Status of the product (e.g., 1 for active, 0 for inactive)
  "Discount": 5.00,                 // Discount amount on the product
  "Discount-ID": 2,                 // ID associated with the discount
  "Sticker-ID": 3                   // ID associated with the sticker
}
