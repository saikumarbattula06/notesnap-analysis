import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../components/Logo';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post('http://127.0.0.1:5000/signin', { email, password });
      localStorage.setItem('user', JSON.stringify({ name: response.data.name, email }));
      navigate('/home');
    } catch (error) {
      alert(error.response?.data?.error || 'Login failed. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 animate-gradient flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10 bg-white/95 backdrop-blur-lg p-10 rounded-3xl shadow-2xl w-full max-w-md border-4 border-white/50 animate-slide-left">
        <div className="flex justify-center mb-6">
          <Logo size="medium" variant="dark" />
        </div>

        <h1 className="text-5xl font-extrabold text-center mb-2">
          <span className="gradient-text">NoteSnap</span>
        </h1>
        <p className="text-center text-gray-600 mb-8 text-lg font-medium">Welcome back! 🚀</p>
        
        <form onSubmit={handleSignIn} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">📧 Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 border-3 border-purple-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-400 focus:border-transparent transition bg-gradient-to-r from-purple-50 to-pink-50"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">🔒 Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 border-3 border-purple-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-400 focus:border-transparent transition bg-gradient-to-r from-purple-50 to-pink-50"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:via-pink-700 hover:to-red-700 transform hover:scale-105 transition duration-300 shadow-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </span>
            ) : (
              '🚀 Sign In'
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            New to NoteSnap?{' '}
            <Link to="/signup" className="font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:from-purple-700 hover:to-pink-700">
              Create Account →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
