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
  status varchar(11) NOT NULL,
  created_by bigint NOT NULL,
  winner bigint,
  PRIMARY KEY (auctionID),
  CONSTRAINT created_by FOREIGN KEY (created_by) REFERENCES tbl_user (userID),
  CONSTRAINT winner FOREIGN KEY (winner) REFERENCES tbl_user (userID),
  CONSTRAINT chk_status CHECK (status in ('INACTIVE', 'ACTIVE', 'FINISHED', 'REALIZED')) 
)ENGINE=INNODB;

CREATE TABLE tbl_user (
  userID bigint NOT NULL AUTO_INCREMENT,
  name varchar(30) NOT NULL,
  surname varchar(30) NOT NULL,
  email varchar(50) NOT NULL,
  PRIMARY KEY (userID),
  UNIQUE KEY (email)
)ENGINE=INNODB;

CREATE TABLE tbl_user_auction (
  user_auction_ID bigint NOT NULL AUTO_INCREMENT,
  userID bigint NOT NULL,
  auctionID bigint NOT NULL,
  price decimal(10,2) NOT NULL,
  time datetime NOT NULL,
  PRIMARY KEY (user_auction_ID),
  CONSTRAINT userID FOREIGN KEY (userID) REFERENCES tbl_user (userID),
  CONSTRAINT auctionID FOREIGN KEY (auctionID) REFERENCES tbl_auction (auctionID)
)ENGINE=INNODB;

SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
