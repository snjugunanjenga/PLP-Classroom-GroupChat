import { Avatar } from '../UI/Avatar';

const ChatList = ({ chats, onSelectChat }) => {
  return (
    <div className="w-1/4 bg-white border-r border-gray-200 p-4 overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Chats</h2>
      {chats.map((chat) => (
        <div
          key={chat._id}
          onClick={() => onSelectChat(chat)}
          className="flex items-center p-3 cursor-pointer hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Avatar name={chat.name} />
          <div className="ml-3">
            <p className="font-medium text-gray-800">{chat.name}</p>
            <p className="text-sm text-gray-500">Last message preview...</p> {/* Add later */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatList;