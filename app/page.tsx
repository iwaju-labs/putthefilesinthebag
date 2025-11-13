'use client';

import Link from 'next/link';
import { MdPermMedia } from 'react-icons/md';
import { FaCopyright, FaCode } from 'react-icons/fa';
import Navbar from '@/components/layout/Navbar';
import Squares from '@/components/Squares';
import { useTheme } from '@/lib/ThemeContext';

export default function Home() {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#060010]' : 'bg-gray-50'} relative overflow-hidden transition-colors duration-300`}>
      {/* Animated Squares Background */}
      <div className="absolute inset-0 z-0">
        <Squares 
          direction="down"
          speed={0.3}
          borderColor={isDark ? 'rgba(100, 100, 255, 0.3)' : 'rgba(59, 130, 246, 0.2)'}
          squareSize={128}
          hoverFillColor={isDark ? 'rgba(100, 100, 255, 0.1)' : 'rgba(59, 130, 246, 0.05)'}
          gradientColor={isDark ? '#060010' : '#f9fafb'}
        />
      </div>
      
      {/* Content Layer */}
      <div className="relative z-10">
        <Navbar />
      <div className="container mx-auto px-4 py-20">
        <div className={`max-w-4xl mx-auto text-center ${isDark ? 'text-white' : 'text-gray-900'} transition-colors`}>
          {/* Hero */}
          <h1 className="text-6xl font-bold mb-6 drop-shadow-lg select-none">
            Put The Files In the Bag
          </h1>
          <p className="text-2xl mb-4 font-light">
            Convert once. Single Bundle. Embed anywhere.
          </p>
          <p className={`text-lg mb-12 font-light ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Upload videos or images → Get optimized formats + ready-to-embed code snippets
          </p>

          {/* CTA */}
          <Link 
            href="/convert"
            className="inline-block px-8 py-4 rounded-md text-xl font-semibold hover:scale-105 transform transition shadow-2xl bg-blue-600 text-white hover:bg-blue-700"
          >
            Start Converting →
          </Link>

          {/* Features Grid */}
          <div className="mt-20 grid md:grid-cols-3 gap-8 text-left">
            <div className={`${isDark ? 'bg-white/5' : 'bg-white/80'} backdrop-blur-sm p-6 rounded-xl hover:scale-105 transition border ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
              <div className="flex text-4xl mb-3"> <MdPermMedia /></div>
              <h3 className="text-xl font-semibold mb-2">Multiple Formats</h3>
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>MP4, WebM, GIF, WebP, AVIF - all in one go</p>
            </div>
            <div className={`${isDark ? 'bg-white/5' : 'bg-white/80'} backdrop-blur-sm p-6 rounded-xl hover:scale-105 transition border ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
              <div className="text-4xl mb-3"> <FaCopyright /></div>
              <h3 className="text-xl font-semibold mb-2">Custom Branding</h3>
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Add watermarks and logos automatically</p>
            </div>
            <div className={`${isDark ? 'bg-white/5' : 'bg-white/80'} backdrop-blur-sm p-6 rounded-xl hover:scale-105 transition border ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
              <div className="text-4xl mb-3"> <FaCode /></div>
              <h3 className="text-xl font-semibold mb-2">Code Snippets</h3>
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>HTML, React, Markdown - copy & paste ready</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}