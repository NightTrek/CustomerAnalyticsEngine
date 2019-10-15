DROP DATABASE IF EXISTS buyers_db;

CREATE DATABASE buyers_db;

USE buyers_db;

CREATE TABLE users(
	id 				INTEGER AUTO_INCREMENT,
    fullName 		varchar(42) NOT NULL,
    genderPref 		VARCHAR(42),
    dob 			varchar(32),
    phone 			varchar(16),
    email 			varchar(42),
    allowMarketing 	varchar(3),
    streetAddress 	varchar(60),
    city 			varchar(42),
    state 			varchar(42),
    zip 			varchar(15),
    dl  			varchar(42),
    medRecNum 		varchar(64),
    medRecExp 		varchar(32),
    location		VARCHAR(64),
    PRIMARY KEY 	(id)
);

DROP TABLE userData;

CREATE TABLE userData(
	id							INTEGER auto_increment,
    userID						INTEGER NOT NULL,
    totalVisitsPerMonth			VARCHAR(20) NOT NULL,
    totalLifeTimeVisits			INTEGER NOT NULL,
    timeBetweenFirstAndLast		INTEGER NOT NULL,
    timeBetweenVisits			VARCHAR(10000) NOT NULL,
    totalSpentPerVisit			VARCHAR(10000) NOT NULL,
    visitsInMonth				VARCHAR(10000) NOT NULL,
    totalSpent					VARCHAR(20) NOT NULL,
    location					VARCHAR(64) NOT NULL,
    PRIMARY KEY(id)
);

Select * FROM users;

SELECT COUNT(*) FROM users;

DROP TABLE invoices;
CREATE TABLE invoices(
	id 				integer auto_increment,
    invoiceID 		VARCHAR(100) NOT NULL,
    receiptID 		VARCHAR(100),
    total 			VARCHAR(42) NOT NULL,
    paymentType 	VARCHAR(42),
    customerName 	VARCHAR(64) NOT NULL,
    customerRef 	VARCHAR(64) NOT NULL,
    createdOn		VARCHAR(128) NOT NULL,
    location		VARCHAR(64) NOT NULL,
    primary key (id)
);

SELECT * FROM invoices;

CREATE TABLE itemsSold(
	id				integer auto_increment,
    itemName		VARCHAR(128) NOT NULL,
    catagory		VARCHAR(64) NOT NULL,
    salePrice		VARCHAR(10) NOT NULL,
    listPrice		VARCHAR(10)	NOT NULL,
    totalDiscount	VARCHAR(10) NOT NULL,
    quantity		INTEGER NOT NULL,
    invoiceID		VARCHAR(64) NOT NULL,
    receiptID		VARCHAR(64) NOT NULL,
    productID/SKU	VARCHAR(42) NOT NULL,
    location		VARCHAR(64)	NOT NULL,
    primary key (id)
);
