const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const config = require('./utils/config');

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'FARMP Bot';

// Run when client connects
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room, image }) => {
    if(image === undefined || image === '' || image.onerror) {
      image = config.config.image
    }
    const user = userJoin(socket.id, username, room, image);

    console.log(user)

    socket.join(user.room);

    // Welcome current user
    socket.emit('message', formatMessage(botName, `Hello ${user.username}, Welcome in FARMP Chat`, config.config.imageBot));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(botName, `${user.username} has joined the chat`, config.config.image)
      );

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
    
  });

  // Listen for chatMessage
  socket.on('chatMessage', msg => {
    var user = getCurrentUser(socket.id);
    if(user === undefined) return socket.emit('message', 
    formatMessage(botName, `User is not defined restart your session!`, config.config.imageBot));
   if(msg.includes('https') || msg.includes('http')) return socket.emit('message', 
   formatMessage(botName, `You don't have the permission to content a link!`, config.config.imageBot));
    console.log(formatMessage(user.username, msg, user.image))
    io.to(user.room).emit('message', formatMessage(user.username, msg, user.image));
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} has left the chat`, config.config.image)
      );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });

});


const PORT = process.env.PORT || 80;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
