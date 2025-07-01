import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/UI/Button';
import { Input } from '../components/UI/Input';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { user, login, register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      await login(username, password);
    } else {
      await register(username, password);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="p-8 bg-white rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
          {isLogin ? 'Login' : 'Register'}
        </h2>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-4 w-full"
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-6 w-full"
        />
        <Button type="submit" className="w-full mb-4 bg-green-500 hover:bg-green-600">
          {isLogin ? 'Login' : 'Register'}
        </Button>
        <Button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="w-full bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          {isLogin ? 'Switch to Register' : 'Switch to Login'}
        </Button>
      </form>
    </div>
  );
};

export default Auth;