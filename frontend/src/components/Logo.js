import React from 'react';

export default function Logo({ size = 'medium', variant = 'light' }) {
  const sizes = {
    small: { 
      container: 'w-14 h-14', 
      icon: 'w-8 h-8',
      sparkle: 'w-4 h-4'
    },
    medium: { 
      container: 'w-20 h-20', 
      icon: 'w-12 h-12',
      sparkle: 'w-5 h-5'
    },
    large: { 
      container: 'w-28 h-28', 
      icon: 'w-18 h-18',
      sparkle: 'w-6 h-6'
    },
  };

  const s = sizes[size];
  
  // Color variants for different backgrounds
  const colors = variant === 'light' 
    ? {
        bg: 'from-indigo-500 via-purple-600 to-pink-600',
        iconColor: 'text-white',
        border: 'border-white/40',
        sparkle: 'text-yellow-300'
      }
    : {
        bg: 'from-indigo-600 via-purple-600 to-pink-600',
        iconColor: 'text-white',
        border: 'border-indigo-200',
        sparkle: 'text-yellow-400'
      };

  return (
    <div className={`relative ${s.container} bg-gradient-to-br ${colors.bg} rounded-2xl flex items-center justify-center shadow-2xl border-4 ${colors.border} transform hover:scale-110 transition-all duration-300 hover:rotate-3`}>
      {/* Main Document Icon */}
      <svg 
        className={`${s.icon} ${colors.iconColor}`} 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
        strokeWidth={2.5}>
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
        />
      </svg>
      
      {/* AI Sparkle in top-right corner */}
      <div className="absolute -top-2 -right-2">
        <div className={`${s.sparkle} bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-pulse`}>
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
      </div>
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/20 to-transparent pointer-events-none"></div>
      
      {/* Subtle glow effect */}
      <div className="absolute inset-0 rounded-2xl shadow-inner opacity-30"></div>
    </div>
  );
}
