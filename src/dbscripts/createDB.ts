import { load } from "https://deno.land/std@0.204.0/dotenv/mod.ts";
import { Client } from "https://deno.land/x/mysql@v2.11.0/mod.ts";
import console from "../utils/logging.ts";
const env = await load();

// Logging for testing .env connection status and variables, uncomment for use in testing if needed.
// console.info("hostname: ", env.DB_HOST);
// console.info("port: ", env.DB_PORT);
// console.info("username: ", env.DB_USER);
// console.info("password: ", env.DB_PASSWORD);

async function createSqlConnection() {
  try {
    const client = await new Client().connect({
      hostname: env["DB_HOST"],
      port: parseInt(env["DB_PORT"] || "3306"),
      username: env["DB_USER"],
      password: env["DB_PASSWORD"],
    });

    console.info("Connected to MySQL database!");
    return client;
  } catch (error) {
    console.error("Database connection error:", error);
    throw error; // Re-throw to handle it in the calling code
  }
}
const mysql = await createSqlConnection();
async function createDatabase() {
  try {
    await mysql.query("DROP DATABASE IF EXISTS apinor_DB");
    await mysql.query("CREATE DATABASE apinor_DB");
    await mysql.query("USE apinor_DB");

    await mysql.query(`
            CREATE TABLE Stickers (
                ID INT AUTO_INCREMENT PRIMARY KEY,
                Name VARCHAR(255) NOT NULL,
                Description TEXT
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

    await mysql.query(`
            CREATE TABLE Discount (
                ID INT AUTO_INCREMENT PRIMARY KEY,
                Name VARCHAR(255) NOT NULL,
                Description TEXT,
                Discount_Percent DECIMAL(5,2),
                Discount_Amount DECIMAL(10,2),
                Sticker_ID INT,
                CONSTRAINT fk_discount_sticker
                FOREIGN KEY (Sticker_ID)
                REFERENCES Stickers(ID)
                ON DELETE SET NULL
                ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

    await mysql.query(`
            CREATE TABLE Products (
                ID INT AUTO_INCREMENT PRIMARY KEY,
                Name VARCHAR(255) NOT NULL,
                Price DECIMAL(10,2) NOT NULL,
                Description TEXT,
                Quantity INT DEFAULT 0,
                Image_Path VARCHAR(255),
                Description_JSON JSON,
                Created_At DATETIME,
                Modified_At DATETIME,
                Status TINYINT DEFAULT 1,
                Discount DECIMAL(10,2),
                Discount_ID INT,
                Sticker_ID INT,
                Featured TINYINT DEFAULT 0,
                CONSTRAINT fk_products_discount
                FOREIGN KEY (Discount_ID)
                REFERENCES Discount(ID)
                ON DELETE SET NULL
                ON UPDATE CASCADE,
                CONSTRAINT fk_products_sticker
                FOREIGN KEY (Sticker_ID)
                REFERENCES Stickers(ID)
                ON DELETE SET NULL
                ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

    await mysql.query(`
            CREATE TABLE Users (
                ID INT AUTO_INCREMENT PRIMARY KEY,
                Cookie_ID VARCHAR(255),
                First_Visit DATETIME,
                Last_Visit DATETIME,
                Total_Visits INT DEFAULT 0,
                Cart_ID INT
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

    await mysql.query(`
            CREATE TABLE Cart (
                ID INT AUTO_INCREMENT PRIMARY KEY,
                User_ID INT NOT NULL,
                CONSTRAINT fk_cart_user
                FOREIGN KEY (User_ID)
                REFERENCES Users(ID)
                ON DELETE CASCADE
                ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

    await mysql.query(`
            CREATE TABLE CartItems (
                ID INT AUTO_INCREMENT PRIMARY KEY,
                Cart_ID INT NOT NULL,
                Product_ID INT NOT NULL,
                Quantity INT DEFAULT 1,
                Added_to_cart DATETIME,
                CONSTRAINT fk_cartitems_cart
                FOREIGN KEY (Cart_ID)
                REFERENCES Cart(ID)
                ON DELETE CASCADE
                ON UPDATE CASCADE,
                CONSTRAINT fk_cartitems_product
                FOREIGN KEY (Product_ID)
                REFERENCES Products(ID)
                ON DELETE CASCADE
                ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

    await mysql.query(`
            CREATE TABLE Transactions (
                ID INT AUTO_INCREMENT PRIMARY KEY,
                Product_ID INT NOT NULL,
                User_ID INT NOT NULL,
                Status TINYINT DEFAULT 0,
                Initiated DATETIME,
                Payed_Price DECIMAL(10,2),
                Quantity INT DEFAULT 1,
                CONSTRAINT fk_transactions_product
                FOREIGN KEY (Product_ID)
                REFERENCES Products(ID)
                ON DELETE CASCADE
                ON UPDATE CASCADE,
                CONSTRAINT fk_transactions_user
                FOREIGN KEY (User_ID)
                REFERENCES Users(ID)
                ON DELETE CASCADE
                ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

    await mysql.query(`
            CREATE TABLE Banner (
                ID INT AUTO_INCREMENT PRIMARY KEY,
                Name VARCHAR(255) NOT NULL,
                Description TEXT,
                Banner_Header VARCHAR(255),
                Banner_Text TEXT,
                Banner_Img_Path VARCHAR(255),
                Activated TINYINT DEFAULT 0
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

    await mysql.query(`
            CREATE TABLE News (
                ID INT AUTO_INCREMENT PRIMARY KEY,
                Name VARCHAR(255) NOT NULL,
                Description TEXT,
                News_Background_Image_Path VARCHAR(255),
                News_Spotlight_Image_Path VARCHAR(255),
                News_Spotlight_Image_Sticker_ID INT,
                News_InfoText TEXT,
                News_Header VARCHAR(255),
                Activated TINYINT DEFAULT 0,
                CONSTRAINT fk_news_spotlight_sticker
                FOREIGN KEY (News_Spotlight_Image_Sticker_ID)
                REFERENCES Stickers(ID)
                ON DELETE SET NULL
                ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

    await mysql.query(`
            CREATE TABLE Sessions (
                ID INT AUTO_INCREMENT PRIMARY KEY,
                Created_At DATETIME,
                Duration_Seconds INT,
                Active TINYINT DEFAULT 1,
                Token VARCHAR(64) NOT NULL,
                UNIQUE INDEX idx_token (Token)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

    console.info("Database and tables created successfully.");
  } catch (error) {
    console.error("Error creating database and tables:", error);
  } finally {
    await mysql.close();
  }
}
createDatabase();
