/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

// SIGN IN ROUTES
Route.get('/google-signin', 'GoogleSignInsController.redirect')
//OAuth CALLBACK
Route.get('/google-signin-callback', 'GoogleSignInsController.handleCallback')
Route.get('/user', 'AuthController.getUser').middleware('auth')

// AUTH ROUTES
Route.post('/register', 'AuthController.register')
Route.post('/login', 'AuthController.login')

// USER ROUTES
Route.get('/users', 'UsersController.index').middleware('auth')

// MESSAGE ROUTES
Route.post('/messages', 'MessagesController.storeMessage').middleware('auth')
Route.get('/messages', 'MessagesController.getMessages').middleware('auth')
