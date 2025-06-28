import { useState, useEffect } from 'react';
import { useSocket } from '../../context/SocketContext';
import Message from './Message';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';

const ChatWindow = ({ currentChat, messages, typingUsers }) => {
  const socket = useSocket();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (socket && currentChat) {
      if (message.length > 0 && !isTyping) {
        socket.emit('typing in group', { groupId: currentChat._id });
        setIsTyping(true);
      } else if (message.length === 0 && isTyping) {
        socket.emit('stop typing in group', { groupId: currentChat._id });
        setIsTyping(false);
      }
    }
  }, [socket, currentChat, message, isTyping]);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('send group message', { groupId: currentChat._id, content: message });
      setMessage('');
    }
  };

  return (
    <div className="w-3/4 flex flex-col bg-gray-50">
      <div className="p-4 bg-white border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-800">{currentChat?.name || 'Select a chat'}</h1>
      </div>
      <div className="flex-1 p-4 overflow-y-auto bg-[url('https://whatsapp.com/chat-bg.png')] bg-opacity-10">
        {messages.map((msg) => (
          <Message key={msg._id} message={msg} />
        ))}
        {typingUsers.length > 0 && (
          <p className="text-sm text-green-500 italic">
            {typingUsers.join(', ')} {typingUsers.length > 1 ? 'are' : 'is'} typing...
          </p>
        )}
      </div>
      {currentChat && (
        <div className="p-4 bg-white border-t border-gray-200 flex items-center">
          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message"
            className="flex-1 mr-2"
          />
          <Button onClick={sendMessage} className="bg-green-500 hover:bg-green regulates-600">
            Send
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;