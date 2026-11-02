import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

export default function HomePage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/signin');
    } else {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/signin');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700 animate-gradient relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={handleLogout}
          className="px-6 py-3 bg-white/90 backdrop-blur-sm text-purple-600 rounded-xl hover:bg-white transition font-bold shadow-lg hover:shadow-2xl transform hover:scale-105">
          👋 Logout
        </button>
      </div>
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-white p-6">
        <div className="mb-6 animate-float">
          <Logo size="large" variant="light" />
        </div>

        <h1 className="text-6xl md:text-7xl font-extrabold mb-3 text-center animate-slide-left drop-shadow-2xl">
          Welcome to NoteSnap! 🎉
        </h1>
        
        <h2 className="text-4xl md:text-5xl font-black mb-4 text-center animate-slide-right drop-shadow-2xl">
          Hello, {user.name}! 👋
        </h2>
        
        <p className="text-2xl md:text-3xl mb-12 text-center max-w-3xl font-medium drop-shadow-lg">
          Your AI-powered summarizer ✨ Transform text, PDFs, and YouTube videos into magic in any language! 🌍🚀
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
          <Link 
            to="/text" 
            className="group relative bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 p-8 rounded-3xl shadow-2xl hover:shadow-[0_0_50px_rgba(255,165,0,0.6)] transform hover:scale-110 hover:-rotate-2 transition duration-300 border-4 border-white/50">
            <div className="text-center">
              <div className="text-7xl mb-4 transform group-hover:scale-125 transition duration-300">📝</div>
              <h3 className="text-3xl font-black text-white mb-2">Text</h3>
              <p className="text-white/90 font-medium">Multi-language summaries</p>
            </div>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-3xl transition"></div>
          </Link>
          
          <Link 
            to="/pdf" 
            className="group relative bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 p-8 rounded-3xl shadow-2xl hover:shadow-[0_0_50px_rgba(99,102,241,0.6)] transform hover:scale-110 transition duration-300 border-4 border-white/50">
            <div className="text-center">
              <div className="text-7xl mb-4 transform group-hover:scale-125 transition duration-300">📄</div>
              <h3 className="text-3xl font-black text-white mb-2">PDF</h3>
              <p className="text-white/90 font-medium">Extract in any language</p>
            </div>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-3xl transition"></div>
          </Link>
          
          <Link 
            to="/youtube" 
            className="group relative bg-gradient-to-br from-green-400 via-teal-500 to-cyan-600 p-8 rounded-3xl shadow-2xl hover:shadow-[0_0_50px_rgba(34,211,238,0.6)] transform hover:scale-110 hover:rotate-2 transition duration-300 border-4 border-white/50">
            <div className="text-center">
              <div className="text-7xl mb-4 transform group-hover:scale-125 transition duration-300">🎥</div>
              <h3 className="text-3xl font-black text-white mb-2">YouTube</h3>
              <p className="text-white/90 font-medium">Video content anywhere</p>
            </div>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-3xl transition"></div>
          </Link>
        </div>

        <div className="mt-12 bg-white/20 backdrop-blur-lg px-8 py-4 rounded-2xl border-2 border-white/30 shadow-xl">
          <p className="text-2xl font-bold flex items-center gap-3">
            <span className="text-3xl">🌍</span>
            Supports 10+ Languages
            <span className="text-3xl">🗣️</span>
          </p>
        </div>

        <div className="mt-8 flex gap-4">
          <span className="text-5xl animate-bounce" style={{animationDelay: '0s'}}>⚡</span>
          <span className="text-5xl animate-bounce" style={{animationDelay: '0.2s'}}>🎨</span>
          <span className="text-5xl animate-bounce" style={{animationDelay: '0.4s'}}>🌈</span>
          <span className="text-5xl animate-bounce" style={{animationDelay: '0.6s'}}>✨</span>
        </div>
      </div>
    </div>
  );
}
