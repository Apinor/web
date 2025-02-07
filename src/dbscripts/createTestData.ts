import { createSqlConnection } from "./DbConnection.ts";
import console from "../utils/logging.ts";

const mysql = await createSqlConnection();
if (!mysql) {
  console.error("Failed to connect to the database.");
}

// JSON Descriptions for Products
const productDescriptions = {
  "Norsk Genser": {
    header: {
      content: "Norsk Genser",
      style: "headerStyle"
    },
    mainSection: {
      content: "A traditional Norwegian sweater, hand-knit with intricate patterns inspired by the snowy landscapes and rich cultural heritage of Norway. Perfect for keeping warm during cold winters.",
      style: "paragraphStyle"
    },
    featuresSection: {
      content: "Material: 100% Wool | Weight: Medium | Colors: Classic Nordic Patterns (Red, Blue, White)",
      style: "highlightStyle"
    },
    loreSection: {
      content: "Crafted by skilled artisans in the fjord regions of Norway, this sweater is a symbol of warmth, tradition, and timeless style. Each pattern tells a story of the mountains, forests, and rivers of Norway.",
      style: "paragraphStyle"
    },
    footer: {
      content: "Care Instructions: Hand wash cold, lay flat to dry | Origin: Norway | Craftsmanship: Handmade",
      style: "footerStyle"
    }
  },
  "Fjellsko": {
    header: {
      content: "Fjellsko",
      style: "headerStyle"
    },
    mainSection: {
      content: "Durable and waterproof mountain boots designed for rugged terrains. Perfect for hiking, trekking, and outdoor adventures.",
      style: "paragraphStyle"
    },
    featuresSection: {
      content: "Material: Leather and Gore-Tex | Weight: Heavy | Colors: Brown, Black",
      style: "highlightStyle"
    },
    loreSection: {
      content: "Inspired by the Norwegian mountains, these boots are built to withstand the harshest weather conditions while providing maximum comfort.",
      style: "paragraphStyle"
    },
    footer: {
      content: "Care Instructions: Clean with a damp cloth, apply leather conditioner | Origin: Norway | Craftsmanship: Handmade",
      style: "footerStyle"
    }
  },
  "Ullsokker": {
    header: {
      content: "Ullsokker",
      style: "headerStyle"
    },
    mainSection: {
      content: "Warm and comfortable woolen socks, perfect for keeping your feet cozy during winter.",
      style: "paragraphStyle"
    },
    featuresSection: {
      content: "Material: 100% Wool | Weight: Light | Colors: Gray, Black, White",
      style: "highlightStyle"
    },
    loreSection: {
      content: "Made from the finest Norwegian wool, these socks are a must-have for cold weather.",
      style: "paragraphStyle"
    },
    footer: {
      content: "Care Instructions: Machine wash cold, lay flat to dry | Origin: Norway | Craftsmanship: Handmade",
      style: "footerStyle"
    }
  },
  "Ryggsekk": {
    header: {
      content: "Ryggsekk",
      style: "headerStyle"
    },
    mainSection: {
      content: "A sturdy and spacious backpack designed for day trips and outdoor adventures. Features multiple compartments and durable materials.",
      style: "paragraphStyle"
    },
    featuresSection: {
      content: "Material: Nylon | Weight: Medium | Colors: Green, Blue, Black",
      style: "highlightStyle"
    },
    loreSection: {
      content: "Designed for adventurers, this backpack is built to carry all your essentials while exploring the great outdoors.",
      style: "paragraphStyle"
    },
    footer: {
      content: "Care Instructions: Wipe clean with a damp cloth | Origin: Norway | Craftsmanship: Handmade",
      style: "footerStyle"
    }
  }
};

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

    // Insert Products with JSON Descriptions
    await mysql.query(`
      INSERT INTO Products (Name, Price, Description, Quantity, Image_Path, Created_At, Modified_At, Status, Discount_ID, Sticker_ID, Description_JSON) VALUES
      ('Norsk Genser', 599.00, 'Varm ullgenser for kalde vinterdager', 50, '/public/images/products/Apifor.png', NOW(), NOW(), 1, 1, 4, ?),
      ('Fjellsko', 1299.00, 'Vanntette fjellsko for turer', 30, '/public/images/products/Apifor.png', NOW(), NOW(), 1, 2, 1, ?),
      ('Ullsokker', 149.00, 'Komfortable ullsokker', 100, '/public/images/products/Apifor.png', NOW(), NOW(), 1, NULL, NULL, ?),
      ('Ryggsekk', 899.00, 'Slitesterk ryggsekk for dagsturer', 25, '/public/images/products/Apifor.png', NOW(), NOW(), 1, 3, 4, ?);
    `, [
      JSON.stringify(productDescriptions["Norsk Genser"]),
      JSON.stringify(productDescriptions["Fjellsko"]),
      JSON.stringify(productDescriptions["Ullsokker"]),
      JSON.stringify(productDescriptions["Ryggsekk"])
    ]);

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
      ('Høstnytt', 'Nyheter for høsten', 'Høstens Nyheter Er Her!', 'Opplev vår nye høstkolleksjon med varme og komfortable plagg.', '/public/images/news/ApiForNews.png', '/images/autumn-spotlight.jpg', 1, 1),
      ('Fjellsport', 'Nyheter om fjellsport', 'Nye Fjellsko Er Ankommet', 'Utforsk vårt nye utvalg av fjellsko for alle forhold.', '/public/images/news/DrippBag.jpg', '/images/shoes-spotlight.jpg', 1, 1);
    `);

    // Insert Featured Products
    await mysql.query(`
        INSERT INTO Sessions (Created_At, Duration_Seconds, Active, Token) VALUES
        (NOW(), 7200, 1, '5d39c2656d166424598a47d83378829c8fa09ed8f7b6c9412e54d5d105893727'),
        (NOW(), 7200, 1, 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0'),
        (DATE_SUB(NOW(), INTERVAL 3 HOUR), 7200, 0, 'expired_token_should_not_be_valid_anymore_due_to_duration');
      `);

    console.info('Test data inserted successfully!');
  } catch (error) {
    console.error('Error inserting test data:', error);
  } finally {
    mysql.close();
  }
}

insertTestData();