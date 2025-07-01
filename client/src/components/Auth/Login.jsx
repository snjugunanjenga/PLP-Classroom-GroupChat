import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { Input } from '../UI/Input.jsx';
import { Button } from '../UI/Button.jsx';

const Login = ({ onSwitchToRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(username, password);
      // Redirect handled by Auth.jsx or routing
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">Login</h2>
      {error && (
        <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
      )}
      <form onSubmit={handleSubmit}>
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
        <Button type="submit" className="w-full mb-4 bg-green-500 hover:bg-green-600 text-white">
          Login
        </Button>
        <Button
          type="button"
          onClick={onSwitchToRegister}
          className="w-full bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          Switch to Register
        </Button>
      </form>
    </div>
  );
};

export default Login;