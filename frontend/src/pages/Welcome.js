import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 animate-gradient relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute top-1/3 right-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-white p-6">
        <div className="mb-8 animate-float">
          <Logo size="large" variant="light" />
        </div>

        <h1 className="text-7xl md:text-8xl font-black mb-4 text-center animate-slide-left drop-shadow-2xl">
          Welcome to
        </h1>
        
        <h2 className="text-8xl md:text-9xl font-black mb-6 text-center animate-slide-right drop-shadow-2xl bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 bg-clip-text text-transparent">
          NoteSnap
        </h2>
        
        <p className="text-2xl md:text-3xl mb-12 text-center max-w-3xl font-medium drop-shadow-lg animate-slide-left">
          Your AI-Powered Summarization Assistant ✨<br/>
          Transform Text, PDFs & YouTube Videos into Magic! 🚀
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl">
          <div className="bg-white/20 backdrop-blur-lg p-6 rounded-2xl border-2 border-white/30 text-center transform hover:scale-105 transition">
            <div className="text-5xl mb-3">📝</div>
            <h3 className="text-xl font-bold mb-2">Text Summarizer</h3>
            <p className="text-white/90">Instant AI-powered summaries</p>
          </div>
          
          <div className="bg-white/20 backdrop-blur-lg p-6 rounded-2xl border-2 border-white/30 text-center transform hover:scale-105 transition">
            <div className="text-5xl mb-3">📄</div>
            <h3 className="text-xl font-bold mb-2">PDF Extractor</h3>
            <p className="text-white/90">Extract key insights fast</p>
          </div>
          
          <div className="bg-white/20 backdrop-blur-lg p-6 rounded-2xl border-2 border-white/30 text-center transform hover:scale-105 transition">
            <div className="text-5xl mb-3">🎥</div>
            <h3 className="text-xl font-bold mb-2">YouTube Summary</h3>
            <p className="text-white/90">Video content at a glance</p>
          </div>
        </div>

        <button
          onClick={() => navigate('/signin')}
          className="group relative px-12 py-6 bg-white text-purple-600 rounded-2xl font-black text-3xl hover:bg-gray-100 transition transform hover:scale-110 shadow-2xl hover:shadow-[0_0_50px_rgba(255,255,255,0.5)] animate-bounce">
          <span className="flex items-center gap-3">
            Get Started
            <svg className="w-10 h-10 transform group-hover:translate-x-2 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
        </button>

        <div className="mt-12 bg-white/20 backdrop-blur-lg px-8 py-4 rounded-2xl border-2 border-white/30 shadow-xl">
          <p className="text-xl font-bold flex items-center gap-3">
            <span className="text-3xl">🌍</span>
            Supports 12+ Languages
            <span className="text-3xl">✨</span>
          </p>
        </div>

        <div className="mt-8 flex gap-6">
          <span className="text-5xl animate-bounce" style={{animationDelay: '0s'}}>⚡</span>
          <span className="text-5xl animate-bounce" style={{animationDelay: '0.2s'}}>🎨</span>
          <span className="text-5xl animate-bounce" style={{animationDelay: '0.4s'}}>🌈</span>
          <span className="text-5xl animate-bounce" style={{animationDelay: '0.6s'}}>🚀</span>
        </div>

        <p className="mt-12 text-white/80 text-lg">
          Already have an account?{' '}
          <button 
            onClick={() => navigate('/signin')}
            className="font-bold underline hover:text-white transition">
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}
