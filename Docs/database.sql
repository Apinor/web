
-- 1) Drop the database if it already exists (optional)
DROP DATABASE IF EXISTS apinor_DB;

-- 2) Create a new database
CREATE DATABASE apinor_DB;
USE apinor_DB;

-- 3) Create the "Stickers" table first (no dependencies)
CREATE TABLE Stickers (
ID INT AUTO_INCREMENT PRIMARY KEY,
Name VARCHAR(255) NOT NULL,
Description TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4) Create the "Discount" table (depends on "Stickers")
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

-- 5) Create the "Products" table (depends on "Discount" & "Stickers")
CREATE TABLE Products (
ID INT AUTO_INCREMENT PRIMARY KEY,
Name VARCHAR(255) NOT NULL,
Price DECIMAL(10,2) NOT NULL,
Description TEXT,
Quantity INT DEFAULT 0,
Image_Path VARCHAR(255),
Created_At DATETIME,
Modified_At DATETIME,
Status TINYINT DEFAULT 1, -- Could represent 'active/inactive'
Discount DECIMAL(10,2), -- Shortcut for additional discount info
Discount_ID INT,
Sticker_ID INT,
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

-- 6) Create the "Users" table (no direct dependencies)
CREATE TABLE Users (
ID INT AUTO_INCREMENT PRIMARY KEY,
Cookie_ID VARCHAR(255),
First_Visit DATETIME,
Last_Visit DATETIME,
Total_Visits INT DEFAULT 0,
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7) Create the "Cart" table (depends on "Users")
CREATE TABLE Cart (
ID INT AUTO_INCREMENT PRIMARY KEY,
User_ID INT NOT NULL,
CONSTRAINT fk_cart_user
FOREIGN KEY (User_ID)
REFERENCES Users(ID)
ON DELETE CASCADE
ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8) Create the "CartItems" table (depends on "Cart" & "Products")
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

-- 9) Create the "Transactions" table (depends on "Products" & "Users")
CREATE TABLE Transactions (
ID INT AUTO_INCREMENT PRIMARY KEY,
Product_ID INT NOT NULL,
User_ID INT NOT NULL,
Status TINYINT DEFAULT 0, -- e.g. 0 = pending, 1 = completed, etc.
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

-- 10) Create the "Banner" table (no FK here)
CREATE TABLE Banner (
ID INT AUTO_INCREMENT PRIMARY KEY,
Name VARCHAR(255) NOT NULL,
Description TEXT,
Banner_Header VARCHAR(255),
Banner_Text TEXT,
Banner_Img_Path VARCHAR(255),
Activated TINYINT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11) Create the "News" table (depends on "Stickers" if referencing the sticker)
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

-- 12) Create the "Featured_Product" table (depends on "Products")
CREATE TABLE Featured_Product (
ID INT AUTO_INCREMENT PRIMARY KEY,
Product_ID INT NOT NULL,
Activated TINYINT DEFAULT 0,
CONSTRAINT fk_featured_product
FOREIGN KEY (Product_ID)
REFERENCES Products(ID)
ON DELETE CASCADE
ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- End of script