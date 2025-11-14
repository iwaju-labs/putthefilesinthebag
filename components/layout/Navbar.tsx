'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FiUpload, FiDollarSign, FiMoon, FiSun, FiUser } from 'react-icons/fi';
import { useTheme } from '@/lib/ThemeContext';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <nav className={`${isDark ? 'bg-black border-gray-800' : 'bg-white/80 border-gray-200'} backdrop-blur-md shadow-sm border-b sticky top-0 z-50 transition-colors`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-3 hover:opacity-80 transition group"
          >
            <div className="relative">
              <Image 
                src="/icon.png" 
                alt="Put The Files In the Bag" 
                width={40} 
                height={40}
                className="rounded-lg group-hover:scale-110 transition-transform"
              />
            </div>
            <div className="flex flex-col">
              <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-800'} hidden md:block tracking-tight`}>
                PUTTHEFILESINTHEBAG
              </span>
              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} hidden md:block`}>
                .xyz
              </span>
            </div>
            <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-800'} md:hidden`}>
              PTFITB
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Link 
              href="/convert"
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg ${
                isDark 
                  ? 'text-gray-300 hover:bg-blue-900/50 hover:text-blue-300' 
                  : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
              } transition-all font-medium group`}
            >
              <FiUpload className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline text-sm">Convert</span>
            </Link>
            
            <Link 
              href="/pricing"
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg ${
                isDark 
                  ? 'text-gray-300 hover:bg-purple-900/50 hover:text-purple-300' 
                  : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
              } transition-all font-medium group`}
            >
              <FiDollarSign className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline text-sm">Pricing</span>
            </Link>

            {/* Auth Buttons */}
            <SignedOut>
              <SignInButton mode="modal">
                <button
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    isDark
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                >
                  <FiUser className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm">Sign In</span>
                </button>
              </SignInButton>
            </SignedOut>
            
            <SignedIn>
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10"
                  }
                }}
              />
            </SignedIn>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                isDark 
                  ? 'text-yellow-300 hover:bg-yellow-900/30' 
                  : 'text-gray-600 hover:bg-gray-100'
              } transition-all group`}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <FiSun className="w-5 h-5 group-hover:rotate-45 transition-transform" />
              ) : (
                <FiMoon className="w-5 h-5 group-hover:-rotate-12 transition-transform" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
