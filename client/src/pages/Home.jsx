import { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import ChatList from '../components/Chat/ChatList';
import ChatWindow from '../components/Chat/ChatWindow';
import api from '../utils/api';

const Home = () => {
  const socket = useSocket();
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);

  useEffect(() => {
    const fetchChats = async () => {
      const { data } = await api.get('/api/groups');
      setChats(data);
    };
    fetchChats();
  }, []);

  useEffect(() => {
    if (socket && currentChat) {
      socket.emit('join group', currentChat._id);
      socket.on('new group message', (message) => {
        setMessages((prev) => [...prev, message]);
      });
      socket.on('user typing in group', ({ user }) => {
        setTypingUsers((prev) => [...new Set([...prev, user])]);
      });
      socket.on('user stop typing in group', ({ user }) => {
        setTypingUsers((prev) => prev.filter((u) => u !== user));
      });
      return () => {
        socket.off('new group message');
        socket.off('user typing in group');
        socket.off('user stop typing in group');
      };
    }
  }, [socket, currentChat]);

  const handleSelectChat = async (chat) => {
    setCurrentChat(chat);
    const { data } = await api.get(`/api/messages/group/${chat._id}`);
    setMessages(data);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <ChatList chats={chats} onSelectChat={handleSelectChat} />
      <ChatWindow
        currentChat={currentChat}
        messages={messages}
        typingUsers={typingUsers}
      />
    </div>
  );
};

export default Home;