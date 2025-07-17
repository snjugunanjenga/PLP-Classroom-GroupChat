import { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../context/SocketContext';
import Message from './Message';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';

const ChatWindow = ({ currentChat, privateChatUser, messages, typingUsers, onlineUsers = [] }) => {
  const socket = useSocket();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const lastChatId = useRef(null);

  useEffect(() => {
    if (socket && currentChat && !privateChatUser) {
      if (message.length > 0 && !isTyping) {
        socket.emit('typing in group', { groupId: currentChat._id });
        setIsTyping(true);
      } else if (message.length === 0 && isTyping) {
        socket.emit('stop typing in group', { groupId: currentChat._id });
        setIsTyping(false);
      }
    }
    if (socket && privateChatUser) {
      if (message.length > 0 && !isTyping) {
        socket.emit('typing in private', { recipientId: privateChatUser._id });
        setIsTyping(true);
      } else if (message.length === 0 && isTyping) {
        socket.emit('stop typing in private', { recipientId: privateChatUser._id });
        setIsTyping(false);
      }
    }
  }, [socket, currentChat, privateChatUser, message, isTyping]);

  useEffect(() => {
    if (!socket) return;
    const handleNewGroupMessage = (msg) => {
      if (!currentChat || msg.group !== currentChat._id) {
        // In-app notification
        alert(`New message in group: ${msg.group}`);
        // Browser notification
        if (window.Notification && Notification.permission === 'granted') {
          new Notification('New message', { body: msg.content });
        } else if (window.Notification && Notification.permission !== 'denied') {
          Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
              new Notification('New message', { body: msg.content });
            }
          });
        }
      }
    };
    socket.on('new group message', handleNewGroupMessage);
    return () => {
      socket.off('new group message', handleNewGroupMessage);
    };
  }, [socket, currentChat]);

  const sendMessage = () => {
    if (message.trim()) {
      if (privateChatUser) {
        socket.emit('send private message', { recipientId: privateChatUser._id, content: message });
      } else if (currentChat) {
        socket.emit('send group message', { groupId: currentChat._id, content: message });
      }
      setMessage('');
    }
  };

  return (
    <div className="w-3/4 flex flex-col bg-gray-50 h-full max-h-screen md:w-3/4 sm:w-full">
      <div className="p-4 bg-green-600 border-b border-green-700 sticky top-0 z-10 flex items-center">
        <h1 className="text-xl font-semibold text-white truncate">
          {privateChatUser ? privateChatUser.username : currentChat?.name || 'Select a chat'}
        </h1>
        {/* Show Group ID and Copy button if in group chat */}
        {!privateChatUser && currentChat?.groupId && (
          <div className="ml-4 flex items-center">
            <span className="text-xs text-green-200 bg-green-800 px-2 py-1 rounded select-all">ID: {currentChat.groupId}</span>
            <button
              className="ml-2 px-2 py-1 text-xs bg-green-700 text-white rounded hover:bg-green-800"
              onClick={() => {navigator.clipboard.writeText(currentChat.groupId)}}
              title="Copy Group ID"
            >
              Copy
            </button>
          </div>
        )}
        {/* Online status for group chat */}
        {!privateChatUser && currentChat?.members && onlineUsers.length > 0 && (
          (() => {
            const onlineGroupMembers = currentChat.members.filter(
              m => onlineUsers.includes(m._id || m) // m can be object or id
            );
            return onlineGroupMembers.length > 0 ? (
              <span className="ml-4 flex items-center text-green-200 text-xs">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-1 inline-block"></span>
                Online
              </span>
            ) : null;
          })()
        )}
      </div>
      <div className="flex-1 p-4 overflow-y-auto bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-gray-100" style={{ backgroundSize: 'auto' }}>
        {messages.map((msg) => (
          <Message key={msg._id} message={msg} />
        ))}
        {typingUsers.length > 0 && (
          <div className="flex items-center mt-2">
            <span className="text-sm text-green-600 italic mr-2">
              {typingUsers.join(', ')} {typingUsers.length > 1 ? 'are' : 'is'} typing...
            </span>
            <span className="flex space-x-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
              <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
            </span>
          </div>
        )}
      </div>
      {(currentChat || privateChatUser) && (
        <div className="p-4 bg-white border-t border-gray-200 flex items-center sticky bottom-0 z-10">
          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message"
            className="flex-1 mr-2 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <Button onClick={sendMessage} className="bg-green-500 hover:bg-green-600 text-white rounded-full px-6 py-2 shadow">
            Send
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;