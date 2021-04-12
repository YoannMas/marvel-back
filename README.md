# Marvel - Backend

This backend uses Marvel's API to render characters and comics. 
More information about this project on <a href="https://github.com/YoannMas/marvel-front">Frontend repository</a>

## Dependencies

- express
- express formidable
- mongoose
- axios
- cors
- crypto-js
- uid2
- dotenv

## Routes 

### Characters
- Get all characters : /characters

### Comics
- Get all comics : /comics
- Get comic by character ID : /comics/:id 

### Favorites
- Get user's favorites : /favorites/:token
- Remove a favorite : /favorites/remove/:id

### Users
- Create an account : /user/signup
- Login : /user/login
- Add a favorite : /user/favorites

## Setup instructions

Clone this repository 

```
git clone https://github.com/YoannMas/marvel-back.git
```

Install dependencies

```
yarn install
```

Run it

```
yarn start
```
