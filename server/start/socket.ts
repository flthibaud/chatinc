import Ws from 'App/Services/Ws'
import { onlineUsersService } from 'App/Services/OnlineUsersService'
Ws.boot()

/**
 * Listen for incoming socket connections
 */
Ws.io.on('connection', (socket) => {
  socket.on('add-user', (userId) => {
    onlineUsersService.addUser(userId, socket.id)
  })

  socket.on('send-msg', (data) => {
    console.log(data)
    const sendUserSocket = onlineUsersService.getUser(data.receiver_id)
    console.log(sendUserSocket)
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit('msg-received', data)
    }
  })
})
