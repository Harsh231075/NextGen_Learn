import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, Send, Loader2 } from 'lucide-react';

const AIAssistant = () => {
  const [userInput, setUserInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [displayTexts, setDisplayTexts] = useState({});
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);
  const apiUrl = import.meta.env.VITE_API_URL + '/api/ai/chat';

  const handleInputChange = (e) => setUserInput(e.target.value);

  // Parses text to identify and format highlighted sections between ** **
  const parseHighlightedText = (text) => {
    if (!text) return [];

    // Regex to match text between ** ** (non-greedy)
    const parts = text.split(/(\*\*.*?\*\*)/g);

    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        // This is a highlighted section
        const highlightedText = part.slice(2, -2); // Remove ** from both ends
        return (
          <span
            key={index}
            className="bg-gradient-to-r from-purple-100 to-indigo-100 px-1 py-0.5 rounded font-medium text-indigo-800 border-l-2 border-purple-500"
          >
            {highlightedText}
          </span>
        );
      } else {
        // Regular text
        return <span key={index}>{part}</span>;
      }
    });
  };

  // Improved typing animation with variable speed
  const typeMessage = (messageId, text) => {
    let index = 0;
    const minDelay = 5;
    const maxDelay = 15;

    const typeNextChar = () => {
      if (index <= text.length) {
        setDisplayTexts(prev => ({
          ...prev,
          [messageId]: text.substring(0, index)
        }));
        index++;

        // Variable typing speed for natural effect
        const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
        setTimeout(typeNextChar, delay);
      }
    };

    typeNextChar();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userMessage = { id: Date.now(), text: userInput, sender: 'user' };
    setChatMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        apiUrl,
        { prompt: userInput },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Extract only the final response
      const fullResponse = response.data.response;
      console.log(fullResponse);
      const finalResponse = fullResponse.includes('Therefore, the best response is:')
        ? fullResponse.split('Therefore, the best response is:').pop().trim().replace(/^["']|["']$/g, '')
        : fullResponse;

      const botMessage = {
        id: Date.now(),
        text: finalResponse,
        sender: 'bot'
      };

      setChatMessages(prev => [...prev, botMessage]);
      typeMessage(botMessage.id, botMessage.text);
    } catch (error) {
      console.error('Chatbot API Error:', error);
      const errorMessage = {
        id: Date.now(),
        text: 'Maaf kijiye, kuch technical dikkat aa gayi. Kya aap dobara koshish karenge?',
        sender: 'bot'
      };
      setChatMessages(prev => [...prev, errorMessage]);
      typeMessage(errorMessage.id, errorMessage.text);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, displayTexts]);

  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Get current time for message timestamp
  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Helper function to render the message content with proper formatting
  const renderMessage = (message, displayText) => {
    // For user messages, just show the plain text
    if (message.sender === 'user') {
      return message.text;
    }

    // For bot messages that are still typing, parse for highlighting
    if (displayText) {
      // Handle code blocks first
      if (displayText.includes('```')) {
        const codeBlockRegex = /(```(?:[\w-]+)?\n[\s\S]*?\n```)/g;
        const parts = displayText.split(codeBlockRegex);

        return parts.map((part, index) => {
          if (part.startsWith('```') && part.endsWith('```')) {
            // This is a code block - don't apply highlighting within code
            return (
              <pre key={index} className="bg-gray-100 p-3 rounded-lg my-2 overflow-x-auto text-sm text-gray-800 font-mono">
                {part.replace(/```(?:[\w-]+)?\n|```$/g, '')}
              </pre>
            );
          } else {
            // This is regular text - apply highlighting
            return (
              <div key={index}>
                {parseHighlightedText(part)}
              </div>
            );
          }
        });
      } else {
        // No code blocks, just apply highlighting
        return parseHighlightedText(displayText);
      }
    }

    return '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 sm:p-6 flex flex-col">
      <div className="max-w-6xl mx-auto w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col flex-grow">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 sm:p-5 text-white flex items-center gap-3 border-b border-purple-700">
          <div className="bg-white/20 p-2 rounded-full">
            <MessageSquare className="h-6 w-6 sm:h-7 sm:w-7" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">AI Assistant</h2>
            <p className="text-xs sm:text-sm text-purple-100">Your personal learning companion</p>
          </div>
        </div>

        {/* Chat area */}
        <div
          ref={chatContainerRef}
          className="flex-grow p-4 sm:p-6 overflow-y-auto bg-gradient-to-b from-indigo-50/50 to-purple-50/50"
        >
          {/* Welcome message if no messages */}
          {!chatMessages.length && !loading && (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                <MessageSquare className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Welcome to AI Assistant</h3>
              <p className="text-gray-600 max-w-md mb-4">
                I'm here to help with your learning journey. Ask me anything about your studies or get personalized guidance.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-md w-full">
                <button
                  onClick={() => setUserInput("How can you help me with my studies?")}
                  className="bg-white border border-indigo-200 hover:border-indigo-300 p-3 rounded-lg text-left text-sm text-gray-700 shadow-sm hover:bg-indigo-50 transition-all"
                >
                  How can you help me with my studies?
                </button>
                <button
                  onClick={() => setUserInput("Give me some study tips for better focus")}
                  className="bg-white border border-indigo-200 hover:border-indigo-300 p-3 rounded-lg text-left text-sm text-gray-700 shadow-sm hover:bg-indigo-50 transition-all"
                >
                  Give me study tips for better focus
                </button>
              </div>
            </div>
          )}

          {/* Chat messages */}
          <div className="space-y-4">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              >
                <div className={`flex items-start gap-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user'
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md'
                    : 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-md'
                    }`}>
                    {msg.sender === 'user' ? '👤' : '🤖'}
                  </div>
                  <div>
                    <div className={`p-3 sm:p-4 rounded-2xl shadow-sm ${msg.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                      : 'bg-white border border-purple-100'
                      }`}>
                      <div className={`text-sm sm:text-base whitespace-pre-wrap ${msg.sender === 'user' ? 'text-white' : 'text-gray-800'}`}>
                        {renderMessage(msg, msg.sender === 'bot' ? displayTexts[msg.id] : msg.text)}
                      </div>
                    </div>
                    <div className={`text-xs text-gray-500 mt-1 ${msg.sender === 'user' ? 'text-right mr-2' : 'ml-2'}`}>
                      {getCurrentTime()}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {loading && (
              <div className="flex justify-start animate-fadeIn">
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
                    🤖
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-sm">
                    <div className="flex gap-2">
                      <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-purple-400 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-indigo-400 rounded-full animate-bounce delay-150"></span>
                      <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-blue-400 rounded-full animate-bounce delay-300"></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input area */}
        <div className="p-3 sm:p-4 border-t border-gray-200 bg-white">
          <form onSubmit={handleSubmit} className="flex gap-2 sm:gap-3">
            <input
              ref={inputRef}
              type="text"
              placeholder="Type your message here..."
              className="flex-1 rounded-full border border-indigo-200 p-3 text-sm sm:text-base shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              value={userInput}
              onChange={handleInputChange}
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white p-3 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 disabled:opacity-70 transition-all"
              disabled={loading || !userInput.trim()}
            >
              {loading ?
                <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin" /> :
                <Send className="h-5 w-5 sm:h-6 sm:w-6" />
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// Add these animations to your global CSS or tailwind config
const globalStyles = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out forwards;
}
`;

export default AIAssistant;