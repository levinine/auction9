SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS; 
SET FOREIGN_KEY_CHECKS=0;  

use auction9;
DROP DATABASE auction9;
CREATE DATABASE auction9;
use auction9;

CREATE TABLE tbl_auction (
  auctionID bigint NOT NULL AUTO_INCREMENT,
  title varchar(40) NOT NULL,
  description varchar(300) NOT NULL,
  date_from datetime NOT NULL,
  date_to datetime NOT NULL,
  price decimal(10,2) NOT NULL,
  stopped tinyint(4),
  realized tinyint(4),
  created_by varchar(50) NOT NULL,
  winner varchar(50),
  PRIMARY KEY (auctionID),
  CONSTRAINT created_by FOREIGN KEY (created_by) REFERENCES tbl_user (email),
  CONSTRAINT winner FOREIGN KEY (winner) REFERENCES tbl_user (email)
)ENGINE=INNODB;

CREATE TABLE tbl_user (
  userID bigint NOT NULL AUTO_INCREMENT,
  name varchar(30),
  surname varchar(30),
  email varchar(50) NOT NULL,
  external_id varchar(64),
  PRIMARY KEY (userID),
  UNIQUE KEY (email)
)ENGINE=INNODB;

CREATE TABLE tbl_user_auction (
  user_auction_ID bigint NOT NULL AUTO_INCREMENT,
  email varchar(50) NOT NULL,
  auctionID bigint NOT NULL,
  price decimal(10,2) NOT NULL,
  time datetime NOT NULL,
  PRIMARY KEY (user_auction_ID),
  CONSTRAINT email FOREIGN KEY (email) REFERENCES tbl_user (email),
  CONSTRAINT auctionID FOREIGN KEY (auctionID) REFERENCES tbl_auction (auctionID)
)ENGINE=INNODB;

SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
