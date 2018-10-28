DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
 item_id INT AUTO_INCREMENT NOT NULL,
 product_name VARCHAR(255),
 department_name VARCHAR(50),
 price INT,
 stock_quantity INT,
 PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Optoma HD142X 1080p 3000 Lumens 3D DLP Home Theater Projector", "Electronics", 54900, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('72" Cat Tree', "Pet Products", 6499, 50);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("PlayStation VR - Doom Bundle", "Video Games", 28397, 70);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("PlayStation 4 Pro 1TB Console", "Video Games", 39999, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("DualShock 4 Wireless Controller for PlayStation 4 - 20th Anniversary Edition", "Video Games", 19900, 6);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Raspberry Pi 3 Model B Motherboard", "Electronics", 35.20, 6);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("AO 7-1/4 in Black BAT 2 blade Knife 10523BK", "Sports & Outdoors", 719, 200);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Onkyo HT-S3800 5.1 Channel Home Theater Package", "Electronics", 24900, 60);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Echo (2nd Generation) – Charcoal Fabric + Echo Dot", "Amazon Devices", 12998, 500);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Pandemic", "Toys & Games", 2999, 100);

SELECT * FROM products;