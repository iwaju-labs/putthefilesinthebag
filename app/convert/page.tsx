'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import FileUpload from '@/components/upload/FileUpload';
import { useTheme } from '@/lib/ThemeContext';

export default function ConvertPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { isDark } = useTheme();

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
  };

  const handleConvert = async () => {
    if (!file) return;
    
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      
      if (data.success) {
        // Redirect to result page
        router.push(`/result/${data.sessionId}`);
      } else {
        setError(data.error || 'Conversion failed');
      }
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setError(null);
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#060010]' : 'bg-gray-50'} transition-colors duration-300`}>
      <Navbar />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Upload Your Media
            </h2>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Drop a video or image to get multiple optimized formats + embed code
            </p>
          </div>

          {/* Upload Component */}
          <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} backdrop-blur-sm rounded-2xl shadow-lg border p-8 mb-6 transition-colors`}>
            <FileUpload onFileSelect={handleFileSelect} />

            {/* Error Message */}
            {error && (
              <div className={`mt-6 rounded-lg p-4 border ${isDark ? 'bg-red-900/20 border-red-500/50' : 'bg-red-50 border-red-200'}`}>
                <p className={`text-center ${isDark ? 'text-red-300' : 'text-red-700'}`}>❌ {error}</p>
              </div>
            )}

            {/* Action Buttons */}
            {file && (
              <div className="mt-8 flex gap-4 justify-center">
                <button
                  onClick={handleConvert}
                  disabled={uploading}
                  className="bg-linear-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {uploading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">⚙️</span>
                      {' '}
                      Converting...
                    </span>
                  ) : (
                    <span>✨ Convert Now</span>
                  )}
                </button>
                
                {!uploading && (
                  <button
                    onClick={handleReset}
                    className={`px-6 py-4 rounded-lg text-lg font-semibold transition ${
                      isDark 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    🗑️ Remove
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className={`rounded-lg p-4 border ${
              isDark 
                ? 'bg-blue-900/20 border-blue-500/30' 
                : 'bg-blue-50 border-blue-200'
            }`}>
              <p className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>
                <strong>🔒 Privacy First:</strong> Your files are processed instantly and never stored permanently.
              </p>
            </div>
            <div className={`rounded-lg p-4 border ${
              isDark 
                ? 'bg-green-900/20 border-green-500/30' 
                : 'bg-green-50 border-green-200'
            }`}>
              <p className={`text-sm ${isDark ? 'text-green-300' : 'text-green-800'}`}>
                <strong>⚡ Fast Processing:</strong> Get all formats + code snippets in seconds.
              </p>
            </div>
          </div>

          {/* What You'll Get Section */}
          <div className={`mt-12 rounded-xl shadow-lg p-8 border ${
            isDark 
              ? 'bg-white/5 border-white/10' 
              : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-2xl font-bold mb-6 text-center ${isDark ? 'text-white' : 'text-gray-800'}`}>
              What You&apos;ll Get 📦
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className={`font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>🎬 Videos:</h4>
                <ul className={`space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <li>✅ MP4 (H.264) - Universal support</li>
                  <li>✅ WebM (VP9) - Modern browsers</li>
                  <li>✅ GIF - Social media ready</li>
                  <li>✅ Thumbnail image</li>
                </ul>
              </div>
              <div>
                <h4 className={`font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>🖼️ Images:</h4>
                <ul className={`space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <li>✅ WebP - Smaller file size</li>
                  <li>✅ AVIF - Next-gen format</li>
                  <li>✅ Optimized JPEG - Fallback</li>
                  <li>✅ Responsive thumbnail</li>
                </ul>
              </div>
            </div>
            <div className={`mt-6 pt-6 border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
              <p className={`text-center ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                <strong>PLUS:</strong> Ready-to-use HTML, React, and Markdown snippets 📝
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
