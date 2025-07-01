import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../UI/Avatar';

const Message = ({ message }) => {
  const { user } = useAuth();
  const isSender = user && (message?.sender?.username === user.username || message?.sender === user.username);
  const senderName = message?.sender?.username || message?.sender || 'Unknown';
  const timestamp = message?.timestamp ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <div className={`mb-3 flex items-end ${isSender ? 'justify-end' : 'justify-start'}`}>
      {!isSender && (
        <Avatar name={senderName} className="bg-gray-700 text-gray-300 w-8 h-8 mr-2" />
      )}
      <div
        className={`max-w-xs p-3 rounded-lg relative ${
          isSender ? 'bg-green-700 text-white rounded-br-none' : 'bg-gray-800 text-gray-200 rounded-bl-none'
        } shadow-sm`}
      >
        <p className="text-xs text-gray-400 mb-1">{senderName}</p>
        <p className="text-base break-words mb-1">{message?.content || ''}</p>
        <span className="absolute bottom-1 right-2 text-[10px] text-gray-400">{timestamp}</span>
      </div>
      {isSender && (
        <Avatar name={senderName} className="bg-green-900 text-green-200 w-8 h-8 ml-2" />
      )}
    </div>
  );
};

export default Message;