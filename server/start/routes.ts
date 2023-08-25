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
Route.get('/ws-ticket', 'AuthController.getWebSocketTicket').middleware('auth')

// AUTH ROUTES
Route.post('/register', 'AuthController.register')
Route.post('/login', 'AuthController.login')

// USER ROUTES
Route.get('/users', 'UsersController.index').middleware('auth')

// MESSAGE ROUTES
Route.post('/messages', 'MessagesController.storeMessage').middleware('auth')
Route.get('/messages', 'MessagesController.getMessages').middleware('auth')
Route.post('/image-message', 'MessagesController.storeImageMessage').middleware('auth')
Route.post('/audio-message', 'MessagesController.storeAudioMessage').middleware('auth')
Route.get('/uploads/images/:filename', 'UploadsController.getImage')
Route.get('/uploads/audios/:filename', 'UploadsController.getAudio')

// Routes for groups
Route.group(() => {
  Route.get('/groups', 'GroupsController.index')
  Route.post('/groups', 'GroupsController.create')
  Route.delete('/groups/:groupId', 'GroupsController.delete')
}).middleware(['auth'])

Route.group(() => {
  Route.post('/groups/:groupId/messages', 'GroupMessagesController.create')
  Route.get('/groups/:groupId/messages', 'GroupMessagesController.index')
}).middleware(['auth', 'isGroupMember'])

// Routes for group members
Route.group(() => {
  Route.get('/groups/:groupId/members', 'GroupMemberController.index')
  Route.post('/groups/:groupId/members', 'GroupMemberController.create')
  Route.delete('/group-members/:id', 'GroupMemberController.delete')
}).middleware(['auth', 'isGroupMember'])
