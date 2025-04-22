// socketHandlers.js
export const setupSocket = (io) => {
  const connectedUsers = new Map();

  io.on('connection', (socket) => {
    console.log('New client connected');

    // Handle user connection
    socket.on('user_connected', (userId) => {
      connectedUsers.set(userId, socket.id);
      socket.userId = userId;

      // Broadcast user online status
      socket.broadcast.emit('user_status', {
        userId,
        status: 'online'
      });
    });

    // Handle private messages
    socket.on('private_message', ({ receiver, content }) => {
      const receiverSocketId = connectedUsers.get(receiver);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('private_message_received', {
          sender: socket.userId,
          content
        });
      }
    });

    // Handle group messages
    socket.on('group_message', ({ groupId, content }) => {
      socket.to(groupId).emit('group_message_received', {
        sender: socket.userId,
        groupId,
        content
      });
    });

    // Handle joining group
    socket.on('join_group', (groupId) => {
      socket.join(groupId);
    });

    // Handle leaving group
    socket.on('leave_group', (groupId) => {
      socket.leave(groupId);
    });

    // Handle typing status
    socket.on('typing', ({ receiver, isTyping }) => {
      const receiverSocketId = connectedUsers.get(receiver);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('typing_status', {
          sender: socket.userId,
          isTyping
        });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      if (socket.userId) {
        connectedUsers.delete(socket.userId);
        // Broadcast user offline status
        socket.broadcast.emit('user_status', {
          userId: socket.userId,
          status: 'offline'
        });
      }
      console.log('Client disconnected');
    });
  });
};