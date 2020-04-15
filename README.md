# Hoods Frontend + BackEnd



## Getting Started
Here are the instructions to get the development environment up and running.

### Prerequisites

* [Node](https://nodejs.org/)
* [Angular](https://angular.io/) 
* [MySQL](https://www.mysql.com/) 

### Initial setup

Clone the repository and install the dependencies on both projects

```bash
git clone https://github.com/martinLeht/koa-passport-jwt-auth.git
```

```bash
cd auth-server
npm install
```

```bash
cd client
npm install
```
### Creating SQL Database
Run SQL queries from `sql/create-user-details.sql`




### Running Node Server

```bash
cd auth-server
npm start
```

### Running Angular Frontend

```bash
cd client
ng serve
```

### Building Angular Frontend for production

```bash
cd client
ng build --prot
```
Built files can be found from `client/dist/hoods-login`


## API Documentation
Below is a short description of the different API endpoints in the server.
There is also examples of how a valid JSON object should look like when sending 
and what kind of objects are returned.

### Users
```http
GET /users/
```


```http
GET /users/1
```

```http
POST /users/
```


```http
PUT /users/1
```


```http
DELETE /users/1
```

### Reviews

* GET request to fetch all reviews without the ratings (ratings are only displayed when opening a specific review)
```http
GET /reviews/
```
* JSON Response body:
```json
{
    "reviews": [
        {
            "reviewId": 2,
            "hoodId": 666,
            "userId": 7,
            "title": "Test Review From Mordor",
            "text": "One Ring to rule them all, One Ring to find them, One Ring to bring them all and in the darkness bind them.",
            "verified": 0
        }
    ]
}
```

GET request to fetch a review with id of 2
```http
GET /reviews/2
```
* JSON Response body:
```json
{
    {
    "review": {
        "reviewId": 2,
        "hoodId": 666,
        "userId": 7,
        "title": "Test Review From Mordor",
        "text": "One Ring to rule them all, One Ring to find them, One Ring to bring them all and in the darkness bind them.",
        "verified": 0,
        "ratings": [
            {
                "ratingId": 9,
                "reviewId": 2,
                "value": 5,
                "category": {
                    "categoryId": 1,
                    "name": "safety"
                }
            },
            {
                "ratingId": 10,
                "reviewId": 2,
                "value": 1,
                "category": {
                    "categoryId": 6,
                    "name": "services"
                }
            },
            {
                "ratingId": 11,
                "reviewId": 2,
                "value": 1,
                "category": {
                    "categoryId": 7,
                    "name": "activities"
                }
            },
            {
                "ratingId": 12,
                "reviewId": 2,
                "value": 2,
                "category": {
                    "categoryId": 4,
                    "name": "school"
                }
            },
            {
                "ratingId": 13,
                "reviewId": 2,
                "value": 1,
                "category": {
                    "categoryId": 8,
                    "name": "family friendly"
                }
            },
            {
                "ratingId": 14,
                "reviewId": 2,
                "value": 1,
                "category": {
                    "categoryId": 5,
                    "name": "transportation"
                }
            },
            {
                "ratingId": 15,
                "reviewId": 2,
                "value": 4,
                "category": {
                    "categoryId": 2,
                    "name": "cleanliness"
                }
            },
            {
                "ratingId": 16,
                "reviewId": 2,
                "value": 3,
                "category": {
                    "categoryId": 3,
                    "name": "nature"
                }
            }
        ]
    }
}
```

POST request to create a review entry to database
```http
POST /reviews/
```
* Mandatory request data: hoodId, userId, title, text, ratings (from all categories)
* JSON Request body:
```json
{
	"hoodId": 666,
	"userId": 7,
	"title": "Test Review From Mordor",
	"text": "One Ring to rule them all, One Ring to find them, One Ring to bring them all and in the darkness bind them.",
	"ratings": [
		{
			"value": 5,
			"category": {
				"categoryId": 1,
				"name": "safety"
			}
		},
		{
			"value": 4,
			"category": {
				"categoryId": 2,
				"name": "cleanliness"
			}
		},
		{
			"value": 3,
			"category": {
				"categoryId": 3,
				"name": "nature"
			}
		},
		{
			"value": 2,
			"category": {
				"categoryId": 4,
				"name": "school"
			}
		},
		{
			"value": 1,
			"category": {
				"categoryId": 5,
				"name": "transportation"
			}
		},
		{
			"value": 1,
			"category": {
				"categoryId": 6,
				"name": "services"
			}
		},
		{
			"value": 1,
			"category": {
				"categoryId": 7,
				"name": "activities"
			}
		},
		{
			"value": 1,
			"category": {
				"categoryId": 8,
				"name": "family friendly"
			}
		}
	]
}
```

* JSON response body:

```json
{
    "review": {
        "reviewId": 2,
        "hoodId": 666,
        "userId": 7,
        "title": "Test Review From Mordor",
        "text": "One Ring to rule them all, One Ring to find them, One Ring to bring them all and in the darkness bind them.",
        "verified": 0,
        "ratings": [
            {
                "ratingId": 9,
                "value": 5,
                "category": {
                    "categoryId": 1,
                    "name": "safety"
                }
            },
            {
                "ratingId": 10,
                "value": 1,
                "category": {
                    "categoryId": 6,
                    "name": "services"
                }
            },
            {
                "ratingId": 11,
                "value": 1,
                "category": {
                    "categoryId": 7,
                    "name": "activities"
                }
            },
            {
                "ratingId": 12,
                "value": 2,
                "category": {
                    "categoryId": 4,
                    "name": "school"
                }
            },
            {
                "ratingId": 13,
                "value": 1,
                "category": {
                    "categoryId": 8,
                    "name": "family friendly"
                }
            },
            {
                "ratingId": 14,
                "value": 1,
                "category": {
                    "categoryId": 5,
                    "name": "transportation"
                }
            },
            {
                "ratingId": 15,
                "value": 4,
                "category": {
                    "categoryId": 2,
                    "name": "cleanliness"
                }
            },
            {
                "ratingId": 16,
                "value": 3,
                "category": {
                    "categoryId": 3,
                    "name": "nature"
                }
            }
        ]
    }
}
```

* Updates a review with id of 2
```http
PUT /reviews/2
```
* JSON Request body:
```json
{
	"title": "Review From Mordor",
	"text": "One Ring to rule them all, One Ring to find them, One Ring to bring them all and in the darkness bind them!",
	"ratings": [
		{
	    	"ratingId": 9,
	        "reviewId": 2,
	        "value": 5,
	        "category": {
	            "categoryId": 1,
	            "name": "safety"
	        }
	    },
	    {
	        "ratingId": 10,
	        "reviewId": 2,
	        "value": 1,
	        "category": {
	            "categoryId": 6,
	            "name": "services"
	        }
	    },
	    {
	        "ratingId": 11,
	        "reviewId": 2,
	        "value": 1,
	        "category": {
	            "categoryId": 7,
	            "name": "activities"
	        }
	    },
	    {
	        "ratingId": 12,
	        "reviewId": 2,
	        "value": 2,
	        "category": {
	            "categoryId": 4,
	            "name": "school"
	        }
	    },
	    {
	        "ratingId": 13,
	        "reviewId": 2,
	        "value": 1,
	        "category": {
	            "categoryId": 8,
	            "name": "family friendly"
	        }
	    },
	    {
	        "ratingId": 14,
	        "reviewId": 2,
	        "value": 1,
	        "category": {
	            "categoryId": 5,
	            "name": "transportation"
	        }
	    },
	    {
	        "ratingId": 15,
	        "reviewId": 2,
	        "value": 4,
	        "category": {
	            "categoryId": 2,
	            "name": "cleanliness"
	        }
	    },
	    {
	        "ratingId": 16,
	        "reviewId": 2,
	        "value": 3,
	        "category": {
	            "categoryId": 3,
	            "name": "nature"
	        }
	    }
	]
}
```

* JSON Response body:
```json
{
    "review": {
        "reviewId": 2,
        "hoodId": 666,
        "userId": 7,
        "title": "Review From Mordor",
        "text": "One Ring to rule them all, One Ring to find them, One Ring to bring them all and in the darkness bind them!",
        "verified": 0,
        "ratings": [
            {
                "ratingId": 9,
                "reviewId": 2,
                "value": 5,
                "category": {
                    "categoryId": 1,
                    "name": "safety"
                }
            },
            {
                "ratingId": 10,
                "reviewId": 2,
                "value": 1,
                "category": {
                    "categoryId": 6,
                    "name": "services"
                }
            },
            {
                "ratingId": 11,
                "reviewId": 2,
                "value": 1,
                "category": {
                    "categoryId": 7,
                    "name": "activities"
                }
            },
            {
                "ratingId": 12,
                "reviewId": 2,
                "value": 2,
                "category": {
                    "categoryId": 4,
                    "name": "school"
                }
            },
            {
                "ratingId": 13,
                "reviewId": 2,
                "value": 1,
                "category": {
                    "categoryId": 8,
                    "name": "family friendly"
                }
            },
            {
                "ratingId": 14,
                "reviewId": 2,
                "value": 1,
                "category": {
                    "categoryId": 5,
                    "name": "transportation"
                }
            },
            {
                "ratingId": 15,
                "reviewId": 2,
                "value": 4,
                "category": {
                    "categoryId": 2,
                    "name": "cleanliness"
                }
            },
            {
                "ratingId": 16,
                "reviewId": 2,
                "value": 3,
                "category": {
                    "categoryId": 3,
                    "name": "nature"
                }
            }
        ]
    },
    "success": "Successfully updated!"
}
```


```http
DELETE /reviews/1
```
* JSON Response body:
* On Success
```json
{
    "success": "Successfully deleted your rating!"
}
```

* When user not found
```json
{
    "error": "Not Found"
}
```

### Authentication

```http
POST /auth/login
```


```http
GET /auth/facebook
```

```http
GET /auth/facebook/callback
```


```http
POST /auth/refresh-token
```


```http
DELETE /users/1
```

