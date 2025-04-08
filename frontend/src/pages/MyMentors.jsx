import React, { useState } from 'react';
import { MessageCircle, Phone, Video, Paperclip, Send, Mic, ArrowLeft, MoreVertical, Search, Check, X, ChevronRight } from 'lucide-react';

const MentorChatUI = () => {
  const [message, setMessage] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);
  const [currentMentor, setCurrentMentor] = useState({
    id: 1,
    name: 'Prof. Sarah Johnson',
    specialty: 'Computer Science',
    status: 'Online',
    avatar: '/api/placeholder/100/100'
  });

  const [messages, setMessages] = useState([
    { id: 1, sender: 'mentor', content: 'Hello! How can I help you with your studies today?', time: '10:30 AM' },
    { id: 2, sender: 'user', content: 'Hi! I have a question about the assignment we received yesterday.', time: '10:32 AM' },
    { id: 3, sender: 'mentor', content: 'Sure, I\'d be happy to help. What\'s your question?', time: '10:33 AM' },
  ]);

  const mentors = [
    {
      id: 1,
      name: 'Prof. Sarah Johnson',
      specialty: 'Computer Science',
      status: 'Online',
      avatar: '/api/placeholder/100/100'
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'Mathematics',
      status: 'Online',
      avatar: '/api/placeholder/100/100'
    },
    {
      id: 3,
      name: 'Dr. Emily Rodriguez',
      specialty: 'Physics',
      status: 'Away',
      avatar: '/api/placeholder/100/100'
    },
    {
      id: 4,
      name: 'Prof. David Williams',
      specialty: 'Chemistry',
      status: 'Offline',
      avatar: '/api/placeholder/100/100'
    }
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: 'user',
        content: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMessage]);
      setMessage('');

      // Simulate mentor response
      setTimeout(() => {
        const mentorResponse = {
          id: messages.length + 2,
          sender: 'mentor',
          content: 'I received your message. Let me think about that and get back to you soon.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prevMessages => [...prevMessages, mentorResponse]);
      }, 1000);
    }
  };

  const switchMentor = (mentor) => {
    setCurrentMentor(mentor);
    // Reset chat for new mentor
    setMessages([
      {
        id: 1,
        sender: 'mentor',
        content: `Hello! I'm ${mentor.name}. How can I help you with your ${mentor.specialty} studies today?`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setShowSidebar(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for mentors list (hidden on mobile by default) */}
      <div className={`${showSidebar ? 'block' : 'hidden'} md:block w-full md:w-64 bg-white border-r border-gray-200 z-10 md:relative absolute`}>
        <div className="p-4 bg-blue-600 text-white flex justify-between items-center">
          <h2 className="font-bold text-lg">My Mentors</h2>
          <X
            className="md:hidden cursor-pointer"
            size={20}
            onClick={() => setShowSidebar(false)}
          />
        </div>

        <div className="overflow-y-auto h-full pb-20">
          {mentors.map(mentor => (
            <div
              key={mentor.id}
              className={`p-3 flex items-center cursor-pointer hover:bg-gray-100 ${currentMentor.id === mentor.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''}`}
              onClick={() => switchMentor(mentor)}
            >
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3 relative">
                <img
                  src={mentor.avatar}
                  alt={`${mentor.name} avatar`}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${mentor.status === 'Online' ? 'bg-green-500' :
                  mentor.status === 'Away' ? 'bg-yellow-500' : 'bg-gray-500'
                  }`}></div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{mentor.name}</h3>
                <p className="text-xs text-gray-600">{mentor.specialty}</p>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </div>
          ))}
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 flex items-center">
          <div
            className="md:hidden mr-3 cursor-pointer"
            onClick={() => setShowSidebar(true)}
          >
            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-white bg-opacity-20">
              <ChevronRight className="text-white" size={16} />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 overflow-hidden relative">
                <img
                  src={currentMentor.avatar}
                  alt="Mentor avatar"
                  className="w-full h-full object-cover"
                />
                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-blue-600 ${currentMentor.status === 'Online' ? 'bg-green-500' :
                  currentMentor.status === 'Away' ? 'bg-yellow-500' : 'bg-gray-500'
                  }`}></div>
              </div>
              <div>
                <h2 className="font-bold">{currentMentor.name}</h2>
                <p className="text-xs text-blue-200">{currentMentor.specialty} • {currentMentor.status}</p>
              </div>
            </div>
          </div>
          <div className="flex space-x-4">
            <Video className="cursor-pointer" size={20} />
            <Phone className="cursor-pointer" size={20} />
            <Search className="cursor-pointer" size={20} />
            <MoreVertical className="cursor-pointer" size={20} />
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto p-4 bg-white">
          <div className="flex flex-col space-y-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-xs md:max-w-md rounded-lg p-3 ${msg.sender === 'user'
                  ? 'bg-blue-100 ml-auto rounded-tr-none'
                  : 'bg-gray-100 mr-auto rounded-tl-none'
                  }`}
              >
                <p className="text-gray-800">{msg.content}</p>
                <div className="text-right mt-1">
                  <span className="text-xs text-gray-500">{msg.time}</span>
                  {msg.sender === 'user' && (
                    <Check className="inline ml-1 text-blue-500" size={12} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Input area */}
        <div className="bg-white p-3 border-t border-gray-200">
          <div className="flex items-center bg-gray-100 rounded-full p-2">
            <div className="flex items-center space-x-2 mx-2">
              <Paperclip className="text-gray-500 cursor-pointer" size={20} />
              <Mic className="text-gray-500 cursor-pointer" size={20} />
            </div>
            <input
              type="text"
              placeholder="Type a message"
              className="flex-1 outline-none px-2 py-1 bg-transparent"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className={`rounded-full p-2 ${message.trim() ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'}`}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorChatUI;