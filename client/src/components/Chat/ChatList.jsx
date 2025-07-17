import { Avatar } from '../UI/Avatar';
import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ChatList = ({ chats, onSelectChat, refetchChats, onSelectPrivate }) => {
  const [unreadCounts, setUnreadCounts] = useState({});
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [joinGroupId, setJoinGroupId] = useState('');
  const socket = useSocket();
  const [users, setUsers] = useState([]);
  const { user, logout } = useAuth();
  const [settingsGroup, setSettingsGroup] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUnreadCounts = async () => {
      try {
        const { data } = await api.get('/api/groups/unread-counts');
        setUnreadCounts(data);
      } catch (err) {
        setUnreadCounts({});
      }
    };
    fetchUnreadCounts();
  }, [chats]);

  useEffect(() => {
    const fetchOnlineUsers = async () => {
      try {
        const { data } = await api.get('/api/users/online');
        setOnlineUsers(data);
      } catch (err) {
        setOnlineUsers([]);
      }
    };
    fetchOnlineUsers();
    if (!socket) return;
    const handleUserOnline = (userId) => setOnlineUsers((prev) => [...new Set([...prev, userId])]);
    const handleUserOffline = (userId) => setOnlineUsers((prev) => prev.filter((id) => id !== userId));
    socket.on('user-online', handleUserOnline);
    socket.on('user-offline', handleUserOffline);
    return () => {
      socket.off('user-online', handleUserOnline);
      socket.off('user-offline', handleUserOffline);
    };
  }, [socket]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get('/api/users');
        setUsers(data);
      } catch (err) {
        setUsers([]);
      }
    };
    fetchUsers();
  }, []);

  const handleSelect = async (chat) => {
    await api.post(`/api/messages/group/${chat._id}/mark-read`);
    onSelectChat(chat);
    const { data } = await api.get('/api/groups/unread-counts');
    setUnreadCounts(data);
  };

  const handleCreateGroup = async () => {
    if (!groupName) return;
    await api.post('/api/groups', { name: groupName });
    setGroupName('');
    refetchChats();
  };

  const handleJoinGroup = async () => {
    if (!joinGroupId) return;
    try {
      await api.post('/api/groups/join', { groupId: joinGroupId });
      alert('Successfully joined group!');
      setJoinGroupId('');
      refetchChats();
    } catch (err) {
      alert('Failed to join group. Please check the Group ID.');
    }
  };

  const handleLeaveGroup = async (chat) => {
    await api.post(`/api/groups/${chat._id}/leave`);
    refetchChats();
  };

  const openSettings = (group) => {
    setSettingsGroup(group);
    setShowSettings(true);
  };
  const closeSettings = () => {
    setSettingsGroup(null);
    setShowSettings(false);
  };

  const handleRemoveMember = async (userId) => {
    await api.post(`/api/groups/${settingsGroup._id}/remove-member`, { userId });
    refetchChats();
    closeSettings();
  };

  const handleTransferAdmin = async (userId) => {
    await api.post(`/api/groups/${settingsGroup._id}/transfer-admin`, { userId });
    refetchChats();
    closeSettings();
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className="w-1/4 min-w-[250px] max-w-xs bg-gray-800 border-r border-gray-800 p-4 overflow-y-auto h-full max-h-screen md:w-1/4 sm:w-full sm:max-w-full sticky top-0 z-20">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-green-400">Chats</h2>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
      <div className="mb-4 flex flex-col gap-2">
        <input
          type="text"
          placeholder="New group name"
          value={groupName}
          onChange={e => setGroupName(e.target.value)}
          className="border p-2 rounded w-full mb-2 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-900 text-white placeholder-gray-400"
        />
        <button onClick={handleCreateGroup} className="bg-green-600 text-white px-3 py-2 rounded shadow hover:bg-green-700 transition">Create</button>
      </div>
      <div className="mb-4 flex flex-col gap-2">
        <input
          type="text"
          placeholder="Group ID to join"
          value={joinGroupId}
          onChange={e => setJoinGroupId(e.target.value)}
          className="border p-2 rounded w-full mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-900 text-white placeholder-gray-400"
        />
        <button onClick={handleJoinGroup} className="bg-blue-600 text-white px-3 py-2 rounded shadow hover:bg-blue-700 transition">Join</button>
      </div>
      <div className="mb-6">
        <h3 className="text-md font-semibold text-gray-400 mb-2">Private Chats</h3>
        <div className="flex flex-col gap-2">
          {users.filter(u => u.username !== user?.username).map((u) => (
            <div
              key={u._id}
              onClick={() => onSelectPrivate(u)}
              className="flex items-center p-3 cursor-pointer hover:bg-green-900 active:bg-green-800 rounded-lg transition-colors group"
            >
              <Avatar name={u.username} className="bg-gray-700 text-gray-300" />
              <div className="ml-3 flex-1 flex items-center">
                <p className="font-medium text-gray-200 truncate">{u.username}</p>
                {onlineUsers.includes(u._id) && (
                  <span className="w-2 h-2 bg-green-400 rounded-full ml-2 inline-block" title="Online"></span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {chats.map((chat) => (
          <div
            key={chat._id}
            className="flex items-center p-3 cursor-pointer hover:bg-green-900 active:bg-green-800 rounded-lg transition-colors group"
          >
            <div onClick={() => handleSelect(chat)} className="flex flex-1 items-center">
              <Avatar name={chat.name} className="bg-gray-700 text-gray-300" />
              <div className="ml-3 flex-1">
                <div className="flex items-center">
                  <p className="font-medium text-gray-200 truncate">{chat.name}</p>
                  {onlineUsers.includes(chat._id) && (
                    <span className="w-2 h-2 bg-green-400 rounded-full ml-2 inline-block"></span>
                  )}
                  {unreadCounts[chat._id] > 0 && (
                    <span className="ml-2 bg-green-600 text-white rounded-full px-2 text-xs">
                      {unreadCounts[chat._id]}
                    </span>
                  )}
                </div>
                <button onClick={e => { e.stopPropagation(); handleLeaveGroup(chat); }} className="text-red-400 text-xs mt-1 hover:underline">Leave</button>
              </div>
            </div>
            {chat.admin === user?.id || chat.admin === user?._id ? (
              <button
                onClick={() => openSettings(chat)}
                className="ml-2 text-gray-400 hover:text-green-400"
                title="Group Settings"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                </svg>
              </button>
            ) : null}
          </div>
        ))}
      </div>
      {showSettings && settingsGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold text-green-400 mb-4">Group Settings: {settingsGroup.name}</h2>
            <h3 className="text-md text-gray-300 mb-2">Members</h3>
            <ul className="mb-4">
              {settingsGroup.members.map((member) => (
                <li key={member._id || member} className="flex items-center justify-between py-1">
                  <span className="flex items-center">
                    <Avatar name={member.username || member} className="bg-gray-700 text-gray-300 w-6 h-6 mr-2" />
                    <span className="text-gray-200 text-sm">{member.username || member}</span>
                    {settingsGroup.admin === (member._id || member) && (
                      <span className="ml-2 px-2 py-0.5 bg-green-700 text-green-100 rounded text-xs">Admin</span>
                    )}
                  </span>
                  {settingsGroup.admin === (user?.id || user?._id) && (member._id || member) !== (user?.id || user?._id) && (
                    <span>
                      <button
                        onClick={() => handleRemoveMember(member._id || member)}
                        className="text-red-400 text-xs hover:underline mr-2"
                      >
                        Remove
                      </button>
                      <button
                        onClick={() => handleTransferAdmin(member._id || member)}
                        className="text-blue-400 text-xs hover:underline"
                      >
                        Make Admin
                      </button>
                    </span>
                  )}
                </li>
              ))}
            </ul>
            <button onClick={closeSettings} className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 w-full">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatList;