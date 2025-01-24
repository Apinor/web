import { createSqlConnection } from "./DbConnection.ts";
import console from "../utils/logging.ts";

const mysql = await createSqlConnection();
if (!mysql) {
  console.error("Failed to connect to the database.");
}

async function insertTestData() {
  try {
    await mysql.query('USE apinor_DB');

    // Insert Stickers
    await mysql.query(`
      INSERT INTO Stickers (Name, Description) VALUES
      ('Nyheter', 'Merke for nye produkter'),
      ('Tilbud', 'Merke for produkter på tilbud'),
      ('Utsolgt', 'Merke for utsolgte produkter'),
      ('Bestselger', 'Merke for populære produkter');
    `);

    // Insert Discounts
    await mysql.query(`
      INSERT INTO Discount (Name, Description, Discount_Percent, Discount_Amount, Sticker_ID) VALUES
      ('Sommersalg', 'Sommerkampanje 2024', 20.00, NULL, 2),
      ('Student', 'Studentrabatt', 15.00, NULL, 2),
      ('Outlet', 'Outlet-priser', NULL, 100.00, 2);
    `);

    // Insert Products
    await mysql.query(`
      INSERT INTO Products (Name, Price, Description, Quantity, Image_Path, Created_At, Modified_At, Status, Discount_ID, Sticker_ID) VALUES
      ('Norsk Genser', 599.00, 'Varm ullgenser for kalde vinterdager', 50, '/images/genser.jpg', NOW(), NOW(), 1, 1, 4),
      ('Fjellsko', 1299.00, 'Vanntette fjellsko for turer', 30, '/images/fjellsko.jpg', NOW(), NOW(), 1, 2, 1),
      ('Ullsokker', 149.00, 'Komfortable ullsokker', 100, '/images/sokker.jpg', NOW(), NOW(), 1, NULL, NULL),
      ('Ryggsekk', 899.00, 'Slitesterk ryggsekk for dagsturer', 25, '/images/ryggsekk.jpg', NOW(), NOW(), 1, 3, 4);
    `);

    // Insert Users
    await mysql.query(`
      INSERT INTO Users (Cookie_ID, First_Visit, Last_Visit, Total_Visits) VALUES
      (UUID(), NOW(), NOW(), 1),
      (UUID(), NOW(), NOW(), 3),
      (UUID(), NOW(), NOW(), 5);
    `);

    // Insert Carts
    await mysql.query(`
      INSERT INTO Cart (User_ID) VALUES
      (1), (2), (3);
    `);

    // Update Users with Cart_ID
    await mysql.query(`
        UPDATE Users 
        SET Cart_ID = CASE 
          WHEN ID = 1 THEN 1
          WHEN ID = 2 THEN 2
          WHEN ID = 3 THEN 3
        END
        WHERE ID IN (1, 2, 3);
      `);

    // Insert Cart Items
    await mysql.query(`
      INSERT INTO CartItems (Cart_ID, Product_ID, Quantity, Added_to_cart) VALUES
      (1, 1, 2, NOW()),
      (1, 3, 1, NOW()),
      (2, 2, 1, NOW()),
      (3, 4, 1, NOW());
    `);

    // Insert Transactions
    await mysql.query(`
      INSERT INTO Transactions (Product_ID, User_ID, Status, Initiated, Payed_Price, Quantity) VALUES
      (1, 1, 1, NOW(), 599.00, 1),
      (2, 2, 1, NOW(), 1299.00, 1),
      (3, 3, 0, NOW(), 149.00, 2);
    `);

    // Insert Banner
    await mysql.query(`
      INSERT INTO Banner (Name, Description, Banner_Header, Banner_Text, Banner_Img_Path, Activated) VALUES
      ('Sommerkampanje', 'Hovedbanner for sommeren', 'Sommerens Beste Tilbud!', 'Opptil 50% avslag på utvalgte varer', '/images/summer-banner.jpg', 1),
      ('Vinterkoleksjon', 'Vinterbanner', 'Ny Vinterkolleksjon', 'Se våre nye vinterprodukter', '/images/winter-banner.jpg', 0);
    `);

    // Insert News
    await mysql.query(`
      INSERT INTO News (Name, Description, News_Header, News_InfoText, News_Background_Image_Path, News_Spotlight_Image_Path, News_Spotlight_Image_Sticker_ID, Activated) VALUES
      ('Høstnytt', 'Nyheter for høsten', 'Høstens Nyheter Er Her!', 'Opplev vår nye høstkolleksjon med varme og komfortable plagg.', '/images/autumn-bg.jpg', '/images/autumn-spotlight.jpg', 1, 1),
      ('Fjellsport', 'Nyheter om fjellsport', 'Nye Fjellsko Er Ankommet', 'Utforsk vårt nye utvalg av fjellsko for alle forhold.', '/images/hiking-bg.jpg', '/images/shoes-spotlight.jpg', 1, 1);
    `);

    // Insert Featured Products
    await mysql.query(`
      INSERT INTO Featured_Product (Product_ID, Activated) VALUES
      (1, 1),
      (4, 1);
    `);

    console.info('Test data inserted successfully!');
  } catch (error) {
    console.error('Error inserting test data:', error);
  } finally {
    mysql.close();
  }
}

insertTestData();