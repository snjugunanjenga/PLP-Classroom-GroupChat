const Message = ({ message }) => {
  const isSender = message.sender === 'You'; // Replace with real user check later
  return (
    <div className={`mb-3 flex ${isSender ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs p-3 rounded-lg ${
          isSender ? 'bg-green-100 text-right' : 'bg-white text-left'
        } shadow-sm`}
      >
        <p className="text-sm text-gray-500 mb-1">{message.sender}</p>
        <p className="text-gray-800">{message.content}</p>
        {/* Add timestamp and reactions later */}
      </div>
    </div>
  );
};

export default Message;