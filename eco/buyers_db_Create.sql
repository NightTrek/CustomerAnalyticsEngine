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
    PRIMARY KEY 	(id)
);

Select * FROM users;

SELECT COUNT(*) FROM users;

CREATE TABLE invoices(
	id 				integer auto_increment,
    invoiceID 		VARCHAR(100) NOT NULL,
    receiptID 		VARCHAR(100),
    total 			VARCHAR(42) NOT NULL,
    paymentType 	VARCHAR(42),
    customerName 	VARCHAR(128) NOT NULL,
    customerRef 	VARCHAR(128) NOT NULL,
    createdOn		VARCHAR(128) NOT NULL,
    primary key (id)
);
