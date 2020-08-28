## Flavorites App API

This is the back end part of a simple Recipe MERN App.

[Front end part](https://github.com/voldev8/recipes-client)

This is a basic CRUD API

### ENDPOINTS and FIELDS

#### Recipes

GET '/recipes/'

POST '/recipes/' (auth)

```javascript
{
  name, ingredients, instructions, tags, image, link;
}
```

GET '/recipes/:id'

DELETE '/recipes/:id'

PUT '/recipes/:id'

```javascript
{
  name, ingredients, instructions, tags, image, link;
}
```

#### Users

(all auth)

GET '/users/'

GET '/users/fav'

PUT '/users/fav'

PUT '/users/addfav'

```javascript
{
  recipeId;
}
```

PUT '/users/removefav'

```javascript
{
  recipeId;
}
```

PUT '/users/update'

```javascript
{
  name, email;
}
```

PUT '/users/updatepassword'

```javascript
{
  password, newPassword;
}
```

#### Auth

POST '/auth/signup'

```javascript
{
  name, email, password;
}
```

POST '/auth/login'

```javascript
{
  name, password;
}
```

GET '/auth/logout'

POST '/auth/forgotpassword'

```javascript
{
  email;
}
```

PUT '/auth/resetpassword/:resettoken'

```javascript
{
  password;
}
```

## Tech/framework used

MongoDB, Express and NodeJs

"@sendgrid/mail": email service,

"bcryptjs": hashing passwords,

"config": for configuration files,

"dotenv": for environment variables,

"express-validator": middleware for easy validate,

"helmet": security,

"html-to-text": for email service,

"jsonwebtoken": jwt,

"mongoose": Mongodb database connection,

"morgan": logger,

"pug": used for email format,

"slugify": slug links (not used)

## Installation

### Clone

you can download the repo to your computer with the command below

```shell
git clone https://github.com/voldev8/recipes-api
```

### Requirements

Create an .env file in root folder

environment values need to be filled

[MongoDB](https://www.mongodb.com/)

PORT=
MONGO_URI='your mongo uri'

JWT_SECRET='secret for hashing'
JWT_COOKIE_EXPIRE=
JWT_EXPIRE=

Sendgrid installation and create an account

[SendGrid documentation](https://sendgrid.com/docs/)

SENDGRID_API_KEY=

FROM_EMAIL=noreply@flavorites.io
FROM_NAME=FlavoritesApp

### Setup

> now install npm

```shell
$ npm install
```

> starting the app

```shell
$ npm run start
```

Instead of starting the front end and back end separately, concurrently npm can be used [More info](https://www.npmjs.com/package/concurrently)

## License

MIT ©2020 Volkan Uyarer
