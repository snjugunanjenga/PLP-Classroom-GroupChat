import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

console.log('VITE_API_URL (SocketContext):', import.meta.env.VITE_API_URL); // Debug log

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (user) {
      const newSocket = io(import.meta.env.VITE_API_URL, {
        auth: { token: localStorage.getItem('token') },
      });
      setSocket(newSocket);
      return () => newSocket.close();
    }
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);