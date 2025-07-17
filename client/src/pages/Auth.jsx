import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/UI/Button';
import { Input } from '../components/UI/Input';
import { useNavigate } from 'react-router-dom';

const FEATURES = [
  'Create and join group chats for your classroom or study group',
  'Share messages in real-time with group members',
  'See who is online and who is typing',
  'Invite others to groups using a unique Group ID',
  'Private messaging between users',
  'Modern, responsive chat interface',
];

const TUTORIAL_STEPS = [
  'Register or login to your account.',
  'Create a new group or join an existing group using a Group ID.',
  'Share the Group ID with classmates to invite them.',
  'Start chatting! See who is online and typing in real-time.',
  'Use the chat list to switch between groups and private chats.',
  'Access Help or About Us from the footer for more information.',
];

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const [showTutorial, setShowTutorial] = useState(false);

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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-100 via-white to-green-200">
      <header className="py-8 bg-green-700 text-white text-center shadow">
        <h1 className="text-4xl font-bold mb-2 tracking-wide">PLP Classroom Group Chats</h1>
        <p className="text-lg max-w-2xl mx-auto">A modern platform for students and educators to collaborate, chat, and learn together in real-time group chats.</p>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-4xl flex flex-col md:flex-row gap-8 items-center justify-center">
          {/* Intro and Features */}
          <div className="flex-1 bg-white rounded-lg shadow-lg p-8 mb-8 md:mb-0 md:mr-4">
            <h2 className="text-2xl font-semibold mb-4 text-green-700">Welcome to PLP Classroom Group Chats!</h2>
            <ul className="mb-6 list-disc list-inside text-gray-700">
              {FEATURES.map((feature, i) => (
                <li key={i} className="mb-2">{feature}</li>
              ))}
            </ul>
            <Button onClick={() => setShowTutorial(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow">How to use the app</Button>
          </div>
          {/* Login/Register Form */}
          <div className="flex-1 bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit} className="w-full">
              <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
                {isLogin ? 'Login' : 'Register'}
              </h2>
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mb-4 p-4 w-full font-bold"
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mb-6 p-4 w-full font-bold"
              />
              <Button type="submit" className="w-full mb-4 p-2 bg-green-500 hover:bg-green-600">
                {isLogin ? 'Login' : 'Register'}
              </Button>
              <Button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="w-full mb-4 p-2 bg-blue-500 text-white hover:bg-blue-600"
              >
                {isLogin ? 'Switch to Register' : 'Switch to Login'}
              </Button>
            </form>
          </div>
        </div>
        {/* Tutorial Modal */}
        {showTutorial && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full relative">
              <button onClick={() => setShowTutorial(false)} className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-2xl">&times;</button>
              <h3 className="text-xl font-semibold mb-4 text-green-700">How to use PLP Classroom Group Chats</h3>
              <ol className="list-decimal list-inside text-gray-700 mb-4">
                {TUTORIAL_STEPS.map((step, i) => (
                  <li key={i} className="mb-2">{step}</li>
                ))}
              </ol>
              <Button onClick={() => setShowTutorial(false)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow w-full">Close</Button>
            </div>
          </div>
        )}
      </main>
      <footer className="bg-green-800 text-white py-4 mt-8 text-center">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <a href="#help" className="hover:underline text-sm">Help</a>
          <span className="hidden md:inline">|</span>
          <a href="#about-us" className="hover:underline text-sm">About Us</a>
        </div>
        <div className="mt-2 text-xs">&copy; {new Date().getFullYear()} PLP Classroom Group Chats. All rights reserved.</div>
      </footer>
    </div>
  );
};

export default Auth;