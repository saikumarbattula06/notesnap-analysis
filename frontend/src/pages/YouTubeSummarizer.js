import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

export default function YouTubeSummarizer() {
  const [url, setUrl] = useState('');
  const [language, setLanguage] = useState('english');
  const [summary, setSummary] = useState('');
  const [title, setTitle] = useState('');
  const [corrected, setCorrected] = useState('');
  const [loading, setLoading] = useState(false);

  const languages = [
  { code: 'english', name: 'English', flag: '🇬🇧' },
  { code: 'spanish', name: 'Spanish', flag: '🇪🇸' },
  { code: 'french', name: 'French', flag: '🇫🇷' },
  { code: 'german', name: 'German', flag: '🇩🇪' },
  { code: 'hindi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'telugu', name: 'Telugu', flag: '🇮🇳' },
  { code: 'tamil', name: 'Tamil', flag: '🇮🇳' },
  { code: 'kannada', name: 'Kannada', flag: '🇮🇳' },
  { code: 'bengali', name: 'Bengali', flag: '🇮🇳' },
  { code: 'malayalam', name: 'Malayalam', flag: '🇮🇳' },
  { code: 'marathi', name: 'Marathi', flag: '🇮🇳' },
];

  const handleSummarize = async () => {
    if (!url.trim()) {
      alert('Please enter a YouTube URL');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:5000/summarize_youtube', { 
        url,
        language 
      });
      setSummary(response.data.summary);
      setTitle(response.data.title);
      setCorrected(response.data.corrected);
    } catch (error) {
      alert('Error: ' + (error.response?.data?.error || 'Could not connect to backend'));
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 via-teal-600 to-cyan-700 animate-gradient">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-white/10 backdrop-blur-md border-b border-white/20 p-5 shadow-xl">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Logo size="small" variant="light" />
            <h1 className="text-3xl font-black text-white drop-shadow-lg">NoteSnap</h1>
          </div>
          <Link to="/home" className="px-6 py-3 bg-white text-teal-600 rounded-xl hover:bg-gray-100 transition font-bold shadow-lg transform hover:scale-105">
            ← Home
          </Link>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 container mx-auto p-8 md:p-12">
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12 border-4 border-white/50">
          {/* Title */}
          <h2 className="text-5xl font-black mb-4 text-center">
            <span className="bg-gradient-to-r from-green-600 to-cyan-600 bg-clip-text text-transparent">🎥 YouTube Summarizer</span>
          </h2>
          <p className="text-center text-gray-600 text-lg mb-10 font-medium">
            Summarize YouTube videos in your preferred language! 🌍
          </p>

          {/* Language Selector */}
          <div className="mb-8">
            <label className="block text-xl font-bold text-gray-700 mb-3">🌍 Select Output Language:</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-4 border-4 border-teal-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-teal-500 text-lg font-medium bg-gradient-to-r from-green-50 to-cyan-50">
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* URL Input */}
          <div className="mb-8">
            <label className="block text-xl font-bold text-gray-700 mb-3">🔗 YouTube Video URL:</label>
            <input
              type="text"
              placeholder="https://youtube.com/watch?v=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full p-4 border-4 border-teal-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-teal-500 focus:border-transparent transition bg-gradient-to-r from-green-50 to-cyan-50 text-lg"
            />
          </div>

          {/* Summarize Button */}
          <button
            onClick={handleSummarize}
            disabled={loading}
            className="w-full md:w-auto mx-auto block px-10 py-5 bg-gradient-to-r from-green-600 via-teal-600 to-cyan-700 text-white rounded-2xl font-bold text-xl hover:from-green-700 hover:via-teal-700 hover:to-cyan-800 disabled:opacity-50 disabled:cursor-not-allowed transition transform hover:scale-105 shadow-2xl">
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-6 w-6 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                🎥 Processing Video...
              </span>
            ) : (
              `✨ Generate Summary in ${languages.find(l => l.code === language)?.name}`
            )}
          </button>

          {/* Video Title */}
          {title && (
            <div className="mt-10 bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-2xl border-l-8 border-purple-500 shadow-lg animate-slide-left">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">🎬</span>
                <h3 className="text-2xl font-black text-purple-700">Video Title:</h3>
              </div>
              <p className="text-gray-800 text-lg font-semibold">{title}</p>
            </div>
          )}

          {/* Description Preview */}
          {corrected && (
            <div className="mt-10 bg-gradient-to-r from-cyan-100 to-blue-100 p-8 rounded-2xl shadow-xl border-l-8 border-cyan-500 animate-slide-right">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📖</span>
                </div>
                <h3 className="text-3xl font-black text-cyan-700">Video Description (Preview)</h3>
              </div>
              <div className="bg-white/70 p-6 rounded-xl">
                <p className="text-gray-800 text-lg leading-relaxed">{corrected}</p>
              </div>
            </div>
          )}

          {/* AI Summary */}
          {summary && (
            <div className="mt-10 bg-gradient-to-r from-green-100 to-teal-100 p-8 rounded-2xl shadow-2xl border-l-8 border-green-600 animate-slide-left">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-2xl">{languages.find(l => l.code === language)?.flag}</span>
                </div>
                <h3 className="text-3xl font-black text-green-700">
                  AI Summary ({languages.find(l => l.code === language)?.name})
                </h3>
              </div>
              <div className="bg-white/70 p-6 rounded-xl">
                <p className="text-gray-800 text-lg leading-relaxed font-medium">{summary}</p>
              </div>
              
              {/* Success Badge */}
              <div className="mt-6 flex items-center justify-center">
                <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg flex items-center gap-2 animate-bounce">
                  <span className="text-2xl">✓</span>
                  Summary Generated Successfully!
                </div>
              </div>
            </div>
          )}

          {/* Info Cards */}
          {!summary && !loading && (
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-green-100 to-teal-100 p-6 rounded-2xl text-center shadow-lg transform hover:scale-105 transition">
                <div className="text-4xl mb-3">🌍</div>
                <h4 className="font-bold text-teal-700 text-lg mb-2">Multi-Language</h4>
                <p className="text-gray-600">Supports 12 languages</p>
              </div>
              
              <div className="bg-gradient-to-br from-cyan-100 to-blue-100 p-6 rounded-2xl text-center shadow-lg transform hover:scale-105 transition">
                <div className="text-4xl mb-3">🤖</div>
                <h4 className="font-bold text-cyan-700 text-lg mb-2">AI-Powered</h4>
                <p className="text-gray-600">Advanced machine learning</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-6 rounded-2xl text-center shadow-lg transform hover:scale-105 transition">
                <div className="text-4xl mb-3">⚡</div>
                <h4 className="font-bold text-purple-700 text-lg mb-2">Lightning Fast</h4>
                <p className="text-gray-600">Instant video summaries</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
