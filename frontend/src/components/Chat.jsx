import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

// Replace with your actual server URLs
const SOCKET_URL = 'http://localhost:4000';
const USERS_API_URL = 'http://localhost:4000/api/chat/online-users';
const SEND_MESSAGE_API = 'http://localhost:4000/api/chat/messages/send';
const GET_MESSAGES_API = 'http://localhost:4000/api/chat/messages';

function ChatApp() {
  const [socket, setSocket] = useState(null);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [conversations, setConversations] = useState({});
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messageEndRef = useRef(null);
  const [unreadMessages, setUnreadMessages] = useState({});

  // Connect to socket and fetch users
  useEffect(() => {
    // Get current user from localStorage or authentication system
    const loggedInUser = JSON.parse(localStorage.getItem('currentUser')) || { id: '1', name: 'Current User' };
    setCurrentUser(loggedInUser);

    // Initialize socket connection
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    // Socket event listeners
    newSocket.on('connect', () => {
      console.log('Connected to socket server');
      setIsConnected(true);

      // Emit a join event with the current user's ID
      newSocket.emit('join', { userId: loggedInUser.id });
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from socket server');
      setIsConnected(false);
    });

    newSocket.on('message', (data) => {
      receiveMessage(data);

      // Update unread messages count
      if (selectedUser?.id !== data.from) {
        setUnreadMessages(prev => ({
          ...prev,
          [data.from]: (prev[data.from] || 0) + 1
        }));
      }
    });

    // Fetch all users
    fetchUsers();

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Scroll to bottom of messages
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, selectedUser]);

  // Load previous messages when a user is selected
  useEffect(() => {
    if (selectedUser && currentUser) {
      fetchMessages(selectedUser.id);

      // Clear unread count for this conversation
      setUnreadMessages(prev => ({
        ...prev,
        [selectedUser.id]: 0
      }));
    }
  }, [selectedUser, currentUser]);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(USERS_API_URL);
      const data = await response.json();

      if (data.users && Array.isArray(data.users)) {
        setUsers(data.users);
      } else {
        console.error('Invalid user data format:', data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch previous messages from database
  const fetchMessages = async (userId) => {
    if (!currentUser) return;

    try {
      setIsLoading(true);
      const response = await fetch(`${GET_MESSAGES_API}?userId1=${currentUser.id}&userId2=${userId}`);
      const data = await response.json();

      if (data.success && data.messages) {
        // Update conversations with fetched messages
        setConversations(prev => ({
          ...prev,
          [userId]: data.messages.map(msg => ({
            sender: msg.senderId,
            text: msg.content,
            timestamp: msg.timestamp
          }))
        }));
      } else {
        console.error('Error fetching messages:', data.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle incoming messages
  const receiveMessage = (data) => {
    const { from, to, text, timestamp } = data;

    setConversations(prev => {
      const conversationId = from === currentUser?.id ? to : from;
      const existingMessages = prev[conversationId] || [];

      return {
        ...prev,
        [conversationId]: [
          ...existingMessages,
          { sender: from, text, timestamp }
        ]
      };
    });
  };

  // Send message and store in database
  const sendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim() || !selectedUser || !currentUser) return;

    const messageData = {
      senderId: currentUser.id,
      receiverId: selectedUser.id,
      content: message,
      timestamp: new Date().toISOString()
    };

    try {
      // Send via API to store in database
      const response = await fetch(SEND_MESSAGE_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messageData)
      });

      const data = await response.json();

      if (data.success) {
        // Send via socket for real-time communication
        socket.emit('message', {
          from: currentUser.id,
          to: selectedUser.id,
          text: message,
          timestamp: messageData.timestamp
        });

        // Update local state
        setConversations(prev => {
          const existingMessages = prev[selectedUser.id] || [];
          return {
            ...prev,
            [selectedUser.id]: [
              ...existingMessages,
              { sender: currentUser.id, text: message, timestamp: messageData.timestamp }
            ]
          };
        });
      } else {
        console.error('Failed to send message:', data.message || 'Unknown error');
        alert('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error sending message. Please check your connection.');
    }

    setMessage('');
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get last message for a conversation
  const getLastMessage = (userId) => {
    const conv = conversations[userId] || [];
    return conv.length > 0 ? conv[conv.length - 1] : null;
  };

  // Get messages for selected conversation
  const currentMessages = selectedUser ? (conversations[selectedUser.id] || []) : [];

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Sidebar - User List */}
      <div className="w-full md:w-1/3 lg:w-1/4 bg-white border-r border-gray-200 overflow-hidden flex flex-col">
        <div className="p-4 bg-blue-600 text-white">
          <h2 className="text-xl font-bold">Messages</h2>
          <p className="text-sm">{isConnected ? 'Connected' : 'Disconnected'}</p>
        </div>

        {isLoading && users.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="overflow-y-auto flex-1">
            {users.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No users available</div>
            ) : (
              users.filter(user => user.id !== currentUser?.id).map(user => {
                const lastMessage = getLastMessage(user.id);
                const unreadCount = unreadMessages[user.id] || 0;

                return (
                  <div
                    key={user.id}
                    className={`flex items-center p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${selectedUser?.id === user.id ? 'bg-blue-50' : ''
                      }`}
                    onClick={() => setSelectedUser(user)}
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-3">
                      {user.name?.charAt(0) || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium truncate">{user.name}</h3>
                        {lastMessage && (
                          <span className="text-xs text-gray-500">
                            {formatTime(lastMessage.timestamp)}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {lastMessage
                          ? `${lastMessage.sender === currentUser?.id ? 'You: ' : ''}${lastMessage.text}`
                          : 'Start a conversation'}
                      </p>
                    </div>
                    {unreadCount > 0 && (
                      <div className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        {selectedUser ? (
          <>
            <div className="p-4 bg-white border-b border-gray-200 flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-3">
                {selectedUser.name?.charAt(0) || '?'}
              </div>
              <div className="flex-1">
                <h2 className="font-medium text-lg">{selectedUser.name}</h2>
                <p className="text-sm text-gray-500">{selectedUser.status || 'Online'}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {isLoading && currentMessages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : currentMessages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-400">
                  Start a conversation with {selectedUser.name}
                </div>
              ) : (
                <>
                  {currentMessages.map((msg, index) => {
                    const isCurrentUser = msg.sender === currentUser?.id;
                    const showAvatar = index === 0 || currentMessages[index - 1].sender !== msg.sender;

                    return (
                      <div key={index} className={`mb-4 flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                        {!isCurrentUser && showAvatar && (
                          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold mr-2 self-end">
                            {selectedUser.name?.charAt(0) || '?'}
                          </div>
                        )}
                        <div
                          className={`max-w-xs md:max-w-md rounded-lg p-3 ${isCurrentUser
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-white border border-gray-200 rounded-bl-none'
                            }`}
                        >
                          <p className="break-words">{msg.text}</p>
                          <p className={`text-xs mt-1 text-right ${isCurrentUser ? 'text-blue-100' : 'text-gray-500'}`}>
                            {formatTime(msg.timestamp)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messageEndRef} />
                </>
              )}
            </div>

            {/* Message Input */}
            <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-200">
              <div className="flex">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 border border-gray-300 rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!isConnected}
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 focus:outline-none transition-colors duration-200"
                  disabled={!message.trim() || !isConnected}
                >
                  Send
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50 text-gray-400 p-4 text-center">
            <div>
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
              <p className="text-lg">Select a user to start chatting</p>
              <p className="text-sm mt-2">Your conversations will be saved and synchronized across devices</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatApp;