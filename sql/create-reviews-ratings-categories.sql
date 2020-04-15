use capstonedb;

DROP TABLE IF EXISTS Ratings;
DROP TABLE IF EXISTS Categories;
DROP TABLE IF EXISTS Reviews;

CREATE TABLE Reviews (
	`review_id` INT NOT NULL AUTO_INCREMENT,
    `hood_id` INT NOT NULL,
    `user_id` INT NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `text` TEXT NOT NULL,
    `verified` BOOLEAN NOT NULL,
    PRIMARY KEY (review_id),
    CONSTRAINT FK_Users FOREIGN KEY (user_id) REFERENCES Users(id)
    ON DELETE CASCADE
);


CREATE TABLE Ratings (
	`rating_id` INT NOT NULL AUTO_INCREMENT,
	`review_id` INT NOT NULL,
    `category_id` INT NOT NULL,
    `value` INT NOT NULL,
    PRIMARY KEY (rating_id),
    CONSTRAINT FK_Reviews FOREIGN KEY (review_id) REFERENCES Reviews(review_id)
    ON DELETE CASCADE,
    CONSTRAINT FK_Categories FOREIGN KEY (category_id) REFERENCES Categories(category_id)
    ON DELETE CASCADE
);


CREATE TABLE Categories (
	`category_id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    PRIMARY KEY (category_id)
);

