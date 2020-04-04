use capstonedb;

DROP TABLE IF EXISTS UserDetails;
DROP TABLE IF EXISTS JwtRefreshTokens;
DROP TABLE IF EXISTS Users;


CREATE TABLE Users (
	`id` INT NOT NULL AUTO_INCREMENT,
    `facebook_id` BIGINT,
    `username` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
	`activationToken` VARCHAR(24),
	`active` BOOLEAN NOT NULL DEFAULT 0,
    PRIMARY KEY (id)
);

CREATE TABLE UserDetails (
	`user_id` INT NOT NULL,
    `details_id` INT NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(100),
    `last_name` VARCHAR(100),
    `suburb` VARCHAR(100), 
	`zipcode` INT(10),
    PRIMARY KEY (details_id),
    CONSTRAINT FK_Users FOREIGN KEY (user_id) REFERENCES Users(id)
    ON DELETE CASCADE
);

CREATE TABLE JwtRefreshTokens (
	`token_id` INT NOT NULL AUTO_INCREMENT,
	`uuid` VARCHAR(36) NOT NULL,
    `user_id` INT NOT NULL,
    `refresh_token` VARCHAR(255),
    PRIMARY KEY (token_id, uuid),
    CONSTRAINT FK_Users_JWT FOREIGN KEY (user_id) REFERENCES Users(id)
    ON DELETE CASCADE
);

SELECT * FROM Users;
