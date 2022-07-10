# Task2
A stock market tracking system where user’s can trade stocks or shares.

# Getting started

To get the Node server running locally:

- Clone this repo
- `npm install` to install all required dependencies
- Install MongoDB Community Edition ([instructions](https://docs.mongodb.com/manual/installation/#tutorials)) and run it by executing `mongod`
- `npm run start` to start the local server
- Install Postman to play it

# API Guide

### Register a user

`POST /users`

Use `Post` method on postman with `Body` option `x-www-form-urlencoded`

`userid: userid` & `password: password`

```js
http://localhost:8000/users
```

### Login a user

`POST /users/login`

Use `Post` method on postman with `Body` option `x-www-form-urlencoded`

`userid: userid` & `password: password`

```js
http://localhost:8000/users/login
```

### Logout a user

`POST /users/login`

Use `Post` method on postman

```js
http://localhost:8000/users/logout
```

### Check User Porfolio

`GET /users/login`

Use `GET` method on postman

Can only work after login

Will only show the latest 5 subscription due to stock API limited

```js
http://localhost:8000/users/portfolio
```

### Create Tweet

`POST /tweets`

Use `Post` method on postman with `Body` option `x-www-form-urlencoded`

Can only work after login

`content: YourContentHere`

```js
http://localhost:4000/tweets
```

### Add Balance

`POST /wallets/addbalance`

Use `Post` method on postman with `Body` option `x-www-form-urlencoded`

Can only work after login

`amount: YourTopupMoneyAmount`

```js
http://localhost:4000/wallets/addbalance
```

### Check Stock

`GET /stocks/:stockSymbol`

symbols e.g. `AAPL` `MSFT` `GOOGL` `AMD` `TSLA` `TSM` `AMZN` `META`

Use `GET` method on postman

Can only work after login

```js
http://localhost:4000/stocks/:stockSymbol
```

### Buy Shares

`PUT /stocks/:stockSymbol/buy`

Use `PUT` method on postman with `Body` option `x-www-form-urlencoded`

Can only work after login

`amount: sharesAmount`

```js
http://localhost:4000/stocks/:stockSymbol/buy
```

### Sell Shares

`PUT /stocks/:stockSymbol/sell`

Use `PUT` method on postman with `Body` option `x-www-form-urlencoded`

Can only work after login

`amount: sharesAmount`

```js
http://localhost:4000/stocks/:stockSymbol/sell
```

### Subscribe Stock

`POST /stocks/:stockSymbol/sell`

Use `POST` method on postman

Can only work after login, Will only show the latest 5 subscription due to stock API limited

```js
http://localhost:4000/stocks/:stockSymbol/subcribe
```
