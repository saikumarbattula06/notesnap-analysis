import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function PDFSummarizer() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [language, setLanguage] = useState('english');
  const [summary, setSummary] = useState('');
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

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setSummary('');
      setCorrected('');
    }
  };

  const handleSummarize = async () => {
    if (!file) {
      alert('Please select a PDF file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('language', language);

    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:5000/summarize_pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSummary(response.data.summary);
      setCorrected(response.data.corrected);
    } catch (error) {
      alert('Error: ' + (error.response?.data?.error || 'Could not connect to backend'));
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 animate-gradient">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-white/10 backdrop-blur-md border-b border-white/20 p-5 shadow-xl">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-black text-white drop-shadow-lg flex items-center gap-2">
            <span className="text-4xl">📄</span>
            NoteSnap
          </h1>
          <Link to="/home" className="px-6 py-3 bg-white text-indigo-600 rounded-xl hover:bg-gray-100 transition font-bold shadow-lg transform hover:scale-105">
            ← Home
          </Link>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 container mx-auto p-8 md:p-12">
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12 border-4 border-white/50">
          {/* Title */}
          <h2 className="text-5xl font-black mb-4 text-center">
            <span className="gradient-text">📄 PDF Summarizer</span>
          </h2>
          <p className="text-center text-gray-600 text-lg mb-10 font-medium">
            Upload any PDF and get summaries in your preferred language! 🌍
          </p>

          {/* Language Selector */}
          <div className="mb-8">
            <label className="block text-xl font-bold text-gray-700 mb-3">🌍 Select Output Language:</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-4 border-4 border-indigo-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500 text-lg font-medium bg-gradient-to-r from-blue-50 to-indigo-50">
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Upload Area */}
          <div className="relative mb-8">
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-4 border-dashed border-indigo-400 rounded-2xl p-12 text-center hover:border-indigo-600 transition cursor-pointer group">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="pdf-upload"
              />
              <label htmlFor="pdf-upload" className="cursor-pointer">
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4 transform group-hover:scale-110 transition duration-300 shadow-lg animate-glow">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className="text-2xl font-bold text-indigo-700 mb-2">
                    {fileName ? '✓ File Selected!' : 'Click or Drag & Drop'}
                  </p>
                  <p className="text-gray-600 text-lg">
                    {fileName || 'Upload your PDF file here'}
                  </p>
                  {fileName && (
                    <div className="mt-4 bg-gradient-to-r from-blue-100 to-indigo-100 px-6 py-3 rounded-xl border-2 border-indigo-300 animate-slide-left">
                      <p className="text-indigo-800 font-bold text-lg flex items-center gap-2">
                        📄 {fileName}
                      </p>
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* Summarize Button */}
          <button
            onClick={handleSummarize}
            disabled={loading || !file}
            className="w-full md:w-auto mx-auto block px-10 py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white rounded-2xl font-bold text-xl hover:from-blue-700 hover:via-indigo-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition transform hover:scale-105 shadow-2xl">
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-6 w-6 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                🔄 Extracting Magic from PDF...
              </span>
            ) : (
              `✨ Generate Summary in ${languages.find(l => l.code === language)?.name}`
            )}
          </button>

          {/* Results Section */}
          {corrected && (
            <div className="mt-10 bg-gradient-to-r from-cyan-100 to-blue-100 p-8 rounded-2xl shadow-xl border-l-8 border-cyan-500 animate-slide-right">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📖</span>
                </div>
                <h3 className="text-3xl font-black text-cyan-700">Extracted Text (Preview)</h3>
              </div>
              <div className="bg-white/70 p-6 rounded-xl">
                <p className="text-gray-800 text-lg leading-relaxed">{corrected}</p>
              </div>
            </div>
          )}

          {summary && (
            <div className="mt-10 bg-gradient-to-r from-purple-100 to-pink-100 p-8 rounded-2xl shadow-2xl border-l-8 border-purple-600 animate-slide-left">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-2xl">{languages.find(l => l.code === language)?.flag}</span>
                </div>
                <h3 className="text-3xl font-black text-purple-700">
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
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-6 rounded-2xl text-center shadow-lg transform hover:scale-105 transition">
                <div className="text-4xl mb-3">🌍</div>
                <h4 className="font-bold text-indigo-700 text-lg mb-2">Multi-Language</h4>
                <p className="text-gray-600">Supports 12 languages</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-6 rounded-2xl text-center shadow-lg transform hover:scale-105 transition">
                <div className="text-4xl mb-3">🤖</div>
                <h4 className="font-bold text-purple-700 text-lg mb-2">AI-Powered</h4>
                <p className="text-gray-600">Advanced machine learning</p>
              </div>
              
              <div className="bg-gradient-to-br from-cyan-100 to-teal-100 p-6 rounded-2xl text-center shadow-lg transform hover:scale-105 transition">
                <div className="text-4xl mb-3">⚡</div>
                <h4 className="font-bold text-cyan-700 text-lg mb-2">Lightning Fast</h4>
                <p className="text-gray-600">Instant summaries</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
