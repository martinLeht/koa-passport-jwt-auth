use capstonedb;

DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS UserDetails;


CREATE TABLE UserDetails (
    `details_id` INT NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(100),
    `last_name` VARCHAR(100),
    `suburb` VARCHAR(100) NOT NULL, 
    PRIMARY KEY (details_id)
);


CREATE TABLE Users (
	`id` INT NOT NULL AUTO_INCREMENT, 
    `details_id` INT,
    `username` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT FK_UserDetails FOREIGN KEY (details_id)
    REFERENCES UserDetails(details_id)
    ON DELETE CASCADE
);

INSERT INTO Users (username, email, password) VALUES ('Saitama', 'saitama@opm.com', 'test666');
INSERT INTO Users (username, email, password) VALUES ('Frodo', 'frodo.baggins@lotr.com', 'test666');

SELECT * FROM Users;
