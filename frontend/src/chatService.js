import io from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';

class ChatService {
  constructor() {
    this.socket = null;
  }

  connect(userId) {
    this.socket = io(SOCKET_URL);
    this.socket.emit('user_connected', userId);
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  sendPrivateMessage(to, message) {
    this.socket.emit('private_message', { to, message });
  }

  createGroup(groupName, members) {
    this.socket.emit('create_group', { groupName, members });
  }

  sendGroupMessage(roomId, message) {
    this.socket.emit('group_message', { roomId, message });
  }
}

export default new ChatService();