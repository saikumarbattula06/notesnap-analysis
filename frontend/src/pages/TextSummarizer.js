import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function TextSummarizer() {
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('english');
  const [summary, setSummary] = useState('');
  const [corrected, setCorrected] = useState('');
  const [original, setOriginal] = useState('');
  const [note, setNote] = useState('');
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
    if (!text.trim()) {
      alert('Please enter some text to summarize');
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:5000/summarize_text', { 
        text,
        language 
      });
      setSummary(response.data.summary);
      setCorrected(response.data.corrected);
      setOriginal(response.data.original);
      setNote(response.data.note || '');
    } catch (error) {
      alert('Error: ' + (error.response?.data?.error || 'Could not connect to backend'));
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 animate-gradient">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20 p-5 shadow-xl">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-black text-white drop-shadow-lg">NoteSnap 📝</h1>
          <Link to="/home" className="px-6 py-3 bg-white text-purple-600 rounded-xl hover:bg-gray-100 transition font-bold shadow-lg transform hover:scale-105">
            ← Home
          </Link>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto p-8 md:p-12">
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12 border-4 border-white/50">
          <h2 className="text-5xl font-black mb-8 text-center">
            <span className="gradient-text-2">📝 Text Summarizer</span>
          </h2>
          
          {/* Language Selector */}
          <div className="mb-6">
            <label className="block text-xl font-bold text-gray-700 mb-3">🌍 Select Output Language:</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-4 border-4 border-purple-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500 text-lg font-medium bg-gradient-to-r from-purple-50 to-pink-50">
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>

          <textarea
            className="w-full p-6 border-4 border-purple-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500 focus:border-transparent transition bg-gradient-to-br from-purple-50 to-pink-50 text-lg"
            rows="12"
            placeholder="✍️ Paste your text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          
          <button
            onClick={handleSummarize}
            disabled={loading}
            className="mt-6 w-full md:w-auto px-10 py-4 bg-gradient-to-r from-orange-500 via-pink-600 to-purple-700 text-white rounded-2xl font-bold text-xl hover:from-orange-600 hover:via-pink-700 hover:to-purple-800 disabled:opacity-50 transition transform hover:scale-105 shadow-xl">
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-6 w-6 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                ✨ Processing Magic...
              </span>
            ) : (
              `✨ Generate Summary in ${languages.find(l => l.code === language)?.name}`
            )}
          </button>
          
          {note && (
            <div className="mt-8 bg-gradient-to-r from-yellow-100 to-orange-100 p-6 rounded-2xl border-l-8 border-yellow-500 shadow-lg animate-slide-left">
              <p className="text-yellow-900 font-bold text-lg">ℹ️ {note}</p>
            </div>
          )}
          
          {original && (
            <div className="mt-8 bg-gradient-to-r from-gray-100 to-gray-200 p-6 rounded-2xl shadow-lg animate-slide-left">
              <h3 className="text-2xl font-black text-gray-800 mb-3">📥 Original Text:</h3>
              <p className="text-gray-700 italic text-lg">{original}</p>
            </div>
          )}
          
          {corrected && (
            <div className="mt-8 bg-gradient-to-r from-blue-100 to-cyan-100 p-8 rounded-2xl shadow-xl border-l-8 border-blue-500 animate-slide-right">
              <h3 className="text-3xl font-black text-blue-700 mb-4">✅ Corrected Text:</h3>
              <p className="text-gray-800 text-lg leading-relaxed">{corrected}</p>
            </div>
          )}
          
          {summary && (
            <div className="mt-8 bg-gradient-to-r from-purple-100 to-pink-100 p-8 rounded-2xl shadow-2xl border-l-8 border-purple-600 animate-slide-left">
              <h3 className="text-3xl font-black text-purple-700 mb-4 flex items-center gap-3">
                <span>{languages.find(l => l.code === language)?.flag}</span>
                AI Summary ({languages.find(l => l.code === language)?.name})
              </h3>
              <p className="text-gray-800 text-lg leading-relaxed">{summary}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
