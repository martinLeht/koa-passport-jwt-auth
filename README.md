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

Before running start commands, you need to create a config.ts file that holds all API-credentials/-keys

Create file Config.ts:

```typescript
import fs from 'fs';

export const JWT_SECRET = 'testSecret';

export let SECRET = '';

// USE THIS for azure, requires ssl 
export let dbPoolConfig = {
    connectionLimit: 5,
    host: 'XXX.mysql.database.azure.com',
    user: 'XXX@XXX',
    password: 'XXX', 
    database: 'XXX',
    port: 3306,
    ssl: {
        ca : fs.readFileSync(__dirname + '\\certificates\\BaltimoreCyberTrustRoot.crt.pem')
    }
};

// Local mysql config
export let localDbPoolConfig = {
    connectionLimit: 5,
    host: '127.0.0.1',
    user: 'root',
    password: 'XXX', 
    database: 'XXX',
    port: 3308
};

export const SENDGRID_API_KEY = 'XXX';

export const FACEBOOK_ID = "XXX";
export const FACEBOOK_SECRET = "XXX";
export const FACEBOOK_CALLBACK_URL = "XXX";

export const CLIENT_URL = "http://localhost:4200";
```

Now you should have all environment variables set for a successful server start

```bash
cd auth-server
npm start
```

### Running Node Server as js files with nodemon (building ts to js files)

```bash
cd auth-server
npm run start-dev
```
* User will get prompted if the certificate that is being copied to dist is a file or directory, it is a DIRECTORY
```bash
Does .\dist\Config\certificates specify a file name
or directory name on the target
(F = file, D = directory)? D
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

GET Request to get users without details
```http
GET /users/
```
* JSON Response body:
```json
{
    "users": [
        {
            "id": 1,
            "facebookId": null,
            "username": "sam123",
            "email": "sam.gamgee@lotr.com",
            "active": 1
        },
        {
            "id": 9,
            "facebookId": 123456789123456,
            "username": "Frodo.baggins",
            "email": "frodo.baggins@lotr.org",
            "active": 1
        }
    ]
}
```

GET Request to get user by id
```http
GET /users/1
```
* JSON Response body:
```json
{
    "user": {
        "id": 1,
        "facebookId": null,
        "username": "sam123",
        "email": "sam.gamgee@lotr.com",
        "active": 1
    }
}
```

GET Request to get users details with user id
```http
GET /users/1/details
```
* Requires auth
* JSON Response body:
```json
{
    "details": {
        "userId": 1,
        "detailsId": 8,
        "firstName": "Sam",
        "lastName": "Gamgee",
        "suburb": "Kazadum",
        "zipcode": 66611
    }
}
```

GET Request to get user with details by user id
```http
GET /users/1/all
```
* Requires auth
* JSON Response body:
```json
{
    "user": {
        "id": 1,
        "facebookId": 123456789123456,
        "username": "sam123",
        "email": "sam.gamgee@lotr.com",
        "active": 1,
        "details": {
            "userId": 1,
            "detailsId": 9,
            "firstName": "Sam",
            "lastName": "Gamgee",
            "suburb": "Kazadum",
            "zipcode": 66611
        }
    }
}
```

POST Request to create user
```http
POST /users/
```
* Mandatory data: username, email, password
* JSON Request body:
```json
{
    "username": "Gimli",
    "email": "gimli.gloin@lotr.com",
    "password": "test123"
}
```
* JSON Response body on success:
```json
{
    "success": "Successfully registered! Verify your email to activate your account and log in."
}
```

PUT Request to update user by id
```http
PUT /users/1
```
* Requires auth
* Sensitive data cannot be updated through this: email, password, activationToken, active and all ID:s
* Optional data: username, firstname, lastname, hood, zip
* JSON Request body:
```json
{
    "username": "GimliDwarf",
    "firstname": "Gimli",
    "lastname": "Gloin",
    "hood": "Moria",
    "zip": 12345
}
```
* JSON Response body:
```json
{
    "user": {
        "id": 1,
        "facebookId": null,
        "username": "GimliDwarf",
        "email": "gimli.gloin@lotr.com",
        "active": 0
    },
    "success": "Successfully updated!"
}
```

DELETE Request to delete user by id
```http
DELETE /users/1
```
* Requires auth
* JSON Response body:
```json
{
    "success": "Successfully deleted your account!"
}
```

GET Reqeust to verify users email, user gets token in email message
```http
GET /users/1/verify?activationToken=<activationToken>
```
* On success sets users field active = 1, activationToken = "".
  Then redirects to login page (URL hardcoded in USersController acitivateUser() -method)
* JSON Response body on error:
```json
{
    "error": "Activation tokens did not match!"
}
```

### Reviews

GET request to fetch all reviews without the ratings (ratings are only displayed when opening a specific review)
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

GET request to fetch reviews from specific hood
```http
GET /reviews/hood/1
```
* JSON Response body:
```json
{
    "reviews": [
        {
            "reviewId": 2,
            "hoodId": 1,
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
        }
    ]
}
```

POST request to create a review entry to database
```http
POST /reviews/
```
* Requires auth
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

PUT Request to update review with id of 2
```http
PUT /reviews/2
```
* Requires auth
* Mandatory Request data: ratings
* Optional Request data: title, text
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

DELETE Request to delete review with id 1
```http
DELETE /reviews/1
```
* Requires auth
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

POST request to login using local strategy
```http
POST /auth/login
```
* Mandatory data: email, password
* Returns user with minimal data, newly generated access token with 15min expiration time and refresh token with 1day expiration time
* JSON Request body:
```json
{
"email": "frodo.baggins@lotr.com",
"password": "test123!"
}
```
* JSON Response body:
```json
{
    "user": {
        "id": 1,
        "username": "frodo123",
        "email": "frodo.baggins@lort.com",
        "active": 1
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiaWF0IjoxNTg3MDYzNzA5LCJleHAiOjE1ODcwNjQ2MDl9.mPKcXqaV893oyOTQZnb9nd7LflScKmoC_GVGI_wakps",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjo3LCJpYXQiOjE1ODcwNjM3MDksImV4cCI6MTU4NzE1MDEwOX0.YDDceIjXl_-iJ51Q_c17T7cLNuZjjI-DtpgTZE8zs6A"
}
```

GET reqeust that redirects to facebook logging in page
```http
GET /auth/facebook
```

GET request will be called as callback when user provides facebook credentials in logging page 
```http
GET /auth/facebook/callback
```
* Registers user with a facebook id
* If user already exists with the facebook id, user will just be authenticated
* Redirects a successful login to client login page and passes tokens and user data through query params: 'localhost:4200/login?jwt=<accessToken>&refreshToken=<refreshToken>&id=<userId>&username=<username>&email=<email>&active=<true>'
* If user with provided email exists, but does not have a facebook id (account linked with facebook), it returns JSON Response (user can not be linked with facebook account through Account settings yet):
```json
{ 
    message: "There is already an account using this email address. Sign in to that account and link it with Facebook manually from Account Settings." 
}
```

POST request to generate a new access- and refresh-token
```http
POST /auth/refresh-token
```
* Returns newly generated access token with 15min expiration time and refresh token with 1day expiration time
* JSON Response body:
```json
{
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiaWF0IjoxNTg3MDYzNzA5LCJleHAiOjE1ODcwNjQ2MDl9.mPKcXqaV893oyOTQZnb9nd7LflScKmoC_GVGI_wakps",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjo3LCJpYXQiOjE1ODcwNjM3MDksImV4cCI6MTU4NzE1MDEwOX0.YDDceIjXl_-iJ51Q_c17T7cLNuZjjI-DtpgTZE8zs6A"
}
```

