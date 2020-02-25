# create the database
CREATE DATABASE IF NOT EXISTS citychan;
USE citychan;

# create the database user
CREATE USER IF NOT EXISTS 'citychan'@'localhost' IDENTIFIED BY 'citychan';
GRANT ALL PRIVILEGES ON citychan.* TO 'citychan'@'localhost';
