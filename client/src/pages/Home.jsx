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
  const [privateChatUser, setPrivateChatUser] = useState(null);

  const fetchChats = async () => {
    const { data } = await api.get('/api/groups');
    setChats(data);
  };

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (socket && currentChat && !privateChatUser) {
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
    if (socket && privateChatUser) {
      socket.on('new private message', (message) => {
        setMessages((prev) => [...prev, message]);
      });
      socket.on('user typing in private', ({ sender }) => {
        setTypingUsers((prev) => [...new Set([...prev, sender])]);
      });
      socket.on('user stop typing in private', ({ sender }) => {
        setTypingUsers((prev) => prev.filter((u) => u !== sender));
      });
      return () => {
        socket.off('new private message');
        socket.off('user typing in private');
        socket.off('user stop typing in private');
      };
    }
  }, [socket, currentChat, privateChatUser]);

  const handleSelectChat = async (chat) => {
    setPrivateChatUser(null);
    setCurrentChat(chat);
    const { data } = await api.get(`/api/messages/group/${chat._id}`);
    setMessages(data);
  };

  const handleSelectPrivate = async (user) => {
    setCurrentChat(null);
    setPrivateChatUser(user);
    const { data } = await api.get(`/api/messages/private/${user._id}`);
    setMessages(data);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-black via-green-900 to-black">
      <ChatList
        chats={chats}
        onSelectChat={handleSelectChat}
        refetchChats={fetchChats}
        onSelectPrivate={handleSelectPrivate}
      />
      <ChatWindow
        currentChat={currentChat}
        privateChatUser={privateChatUser}
        messages={messages}
        typingUsers={typingUsers}
      />
    </div>
  );
};

export default Home;