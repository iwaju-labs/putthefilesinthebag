'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import FileUpload from '@/components/upload/FileUpload';
import { useTheme } from '@/lib/ThemeContext';
import JSZip from 'jszip';
import { VideoConversionProgress } from '@/lib/videoConverterClient';
import { 
  FiDownload, 
  FiTrash2, 
  FiCheck, 
  FiAlertCircle,
  FiLoader,
  FiCopy,
  FiArchive,
  FiRefreshCw,
  FiVideo,
  FiImage,
  FiFile
} from 'react-icons/fi';

type Format = 'mp4' | 'webm' | 'gif' | 'webp' | 'avif' | 'png' | 'jpg';

interface ConversionResult {
  format: string;
  filename: string;
  size: number;
  data: string; // base64 encoded
  codeSnippet: {
    html: string;
    react: string;
    markdown: string;
  };
}

export default function ConvertPage() {
  const [file, setFile] = useState<File | null>(null);
  const [selectedFormats, setSelectedFormats] = useState<Set<Format>>(new Set());
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<ConversionResult[]>([]);
  const [remainingConversions, setRemainingConversions] = useState<number | null>(null);
  const [conversionProgress, setConversionProgress] = useState<VideoConversionProgress | null>(null);
  const [userTier, setUserTier] = useState<string>('free');
  const { isDark } = useTheme();

  // Determine available formats based on file type
  const isVideo = file?.type.startsWith('video/');
  const isImage = file?.type.startsWith('image/');
  
  const videoFormats: Format[] = ['mp4', 'webm', 'gif'];
  const imageFormats: Format[] = ['webp', 'avif', 'png', 'jpg'];
  
  const availableFormats = isVideo ? videoFormats : isImage ? imageFormats : [];

  // Get icon for format
  const getFormatIcon = (format: Format) => {
    if (['mp4', 'webm', 'gif'].includes(format)) {
      return <FiVideo className="w-4 h-4" />;
    }
    if (['webp', 'avif', 'png', 'jpg'].includes(format)) {
      return <FiImage className="w-4 h-4" />;
    }
    return <FiFile className="w-4 h-4" />;
  };

  // Function to fetch remaining conversions
  const fetchRemainingConversions = () => {
    fetch('/api/rate-limit')
      .then(res => res.json())
      .then(data => {
        setRemainingConversions(data.remaining);
        setUserTier(data.tier || 'free');
      })
      .catch(() => {
        setRemainingConversions(0);
        setUserTier('free');
      });
  };

  // Fetch remaining conversions on mount
  useEffect(() => {
    fetchRemainingConversions();
  }, []);

  // Warn user before leaving if they have a file selected or conversion is in progress
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (file || converting) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    globalThis.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      globalThis.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [file, converting]);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
    setResults([]);
    setSelectedFormats(new Set());
  };

  const toggleFormat = (format: Format) => {
    setSelectedFormats(prev => {
      const newSet = new Set(prev);
      if (newSet.has(format)) {
        newSet.delete(format);
      } else {
        newSet.add(format);
      }
      return newSet;
    });
  };

  const handleConvert = async () => {
    if (!file || selectedFormats.size === 0) return;
    
    setConverting(true);
    setError(null);
    setResults([]);
    setConversionProgress(null);

    try {
      // Send all formats to server for conversion
      const formData = new FormData();
      formData.append('file', file);
      formData.append('formats', JSON.stringify([...selectedFormats]));

      const res = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      
      if (data.success) {
        setResults(data.results);
        setRemainingConversions(data.rateLimit.remaining);
        fetchRemainingConversions();
      } else {
        setError(data.error || data.message || 'Conversion failed');
      }
    } catch (err) {
      console.error('Conversion failed:', err);
      setError('Conversion failed. Please try again.');
    } finally {
      setConverting(false);
      setConversionProgress(null);
    }
  };

  const handleReset = () => {
    setFile(null);
    setError(null);
    setResults([]);
    setSelectedFormats(new Set());
  };

  const downloadFile = (result: ConversionResult) => {
    const link = document.createElement('a');
    link.href = result.data;
    link.download = result.filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const downloadAllAsZip = async () => {
    const zip = new JSZip();
    
    // Add each converted file to the ZIP
    for (const result of results) {
      // Extract base64 data from data URL
      const base64Data = result.data.split(',')[1];
      zip.file(result.filename, base64Data, { base64: true });
    }
    
    // Generate ZIP file
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `converted-files-${Date.now()}.zip`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#060010]' : 'bg-gray-50'} transition-colors duration-300`}>
      <Navbar />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className={`text-3xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Convert Your Media
            </h2>
            <p className={`text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Upload, select formats, and download
            </p>
            
            {/* Tier Badge & Rate Limit */}
            <div className="flex items-center gap-3 mt-4 justify-center flex-wrap">
              {userTier === 'lifetime' && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <span className="font-semibold">✨ Lifetime Access</span>
                </div>
              )}
              
              {remainingConversions !== null && userTier !== 'lifetime' && (
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm ${
                  remainingConversions > 0 
                    ? isDark ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-blue-50 text-blue-700 border border-blue-200'
                    : isDark ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  <span>
                    {remainingConversions > 0 
                      ? `${remainingConversions} conversion${remainingConversions === 1 ? '' : 's'} remaining today`
                      : 'Daily limit reached'
                    }
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Upload Component */}
          <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} rounded-lg border p-6 mb-6 transition-colors`}>
            <FileUpload onFileSelect={handleFileSelect} />

            {/* Format Selection */}
            {file && !converting && results.length === 0 && (
              <div className="mt-6">
                <h3 className={`text-sm font-medium mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Select formats
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {availableFormats.map(format => (
                    <button
                      key={format}
                      onClick={() => toggleFormat(format)}
                      className={`p-3 rounded-md border transition-all flex items-center justify-center gap-2 ${
                        selectedFormats.has(format)
                          ? isDark
                            ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                            : 'border-blue-600 bg-blue-50 text-blue-700'
                          : isDark
                            ? 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {getFormatIcon(format)}
                      <span className="font-medium uppercase text-sm">{format}</span>
                      {selectedFormats.has(format) && <FiCheck className="w-3 h-3 ml-auto" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className={`mt-4 rounded-md p-3 border flex items-start gap-2 ${isDark ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-red-50 border-red-200 text-red-700'}`}>
                <FiAlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Conversion Progress */}
            {converting && conversionProgress && (
              <div className="mt-6">
                <div className={`flex items-center gap-3 p-4 rounded-md ${isDark ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'}`}>
                  <FiLoader className={`w-5 h-5 animate-spin ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>
                      {conversionProgress.message}
                    </p>
                    <div className={`w-full h-2 rounded-full mt-2 overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      <div 
                        className="h-full bg-blue-500 transition-all duration-300"
                        style={{ width: `${conversionProgress.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {file && !converting && results.length === 0 && (
              <div className="mt-6 flex gap-3 justify-center">
                <button
                  onClick={handleConvert}
                  disabled={selectedFormats.size === 0 || (remainingConversions !== null && remainingConversions <= 0)}
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Convert {selectedFormats.size > 0 && `(${selectedFormats.size})`}
                </button>
                
                <button
                  onClick={handleReset}
                  className={`px-4 py-2.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                    isDark 
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700' 
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  <FiTrash2 className="w-4 h-4" />
                  Remove
                </button>
              </div>
            )}

            {/* Converting State */}
            {converting && (
              <div className="mt-6 text-center">
                <div className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-md ${isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-700'}`}>
                  <FiLoader className="w-4 h-4 animate-spin" />
                  <span className="text-sm font-medium">Converting...</span>
                </div>
              </div>
            )}

            {/* Results */}
            {results.length > 0 && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <FiCheck className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                    <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Conversion complete
                    </h3>
                  </div>
                  <div className="flex gap-2">
                    {results.length > 1 && (
                      <button
                        onClick={downloadAllAsZip}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                          isDark 
                            ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700' 
                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                        }`}
                      >
                        <FiArchive className="w-4 h-4" />
                        Download ZIP
                      </button>
                    )}
                    <button
                      onClick={handleReset}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                        isDark 
                          ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700' 
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                      }`}
                    >
                      <FiRefreshCw className="w-4 h-4" />
                      New conversion
                    </button>
                  </div>
                </div>

                {results.map((result) => (
                  <div
                    key={result.filename}
                    className={`rounded-md border p-4 ${
                      isDark ? 'bg-white/5 border-gray-700' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {result.filename}
                        </h4>
                        <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                          {(result.size / 1024).toFixed(2)} KB • {result.format.toUpperCase()}
                        </p>
                      </div>
                      <button
                        onClick={() => downloadFile(result)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <FiDownload className="w-4 h-4" />
                        Download
                      </button>
                    </div>

                    {/* Code Snippets */}
                    <div className="space-y-2">
                      <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Embed code
                      </p>
                      {['html', 'react', 'markdown'].map(type => (
                        <div key={type} className="relative">
                          <button
                            onClick={() => copyCode(result.codeSnippet[type as keyof typeof result.codeSnippet])}
                            className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1 ${
                              isDark
                                ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
                                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-300'
                            }`}
                          >
                            <FiCopy className="w-3 h-3" />
                            {type.toUpperCase()}
                          </button>
                          <pre className={`p-3 rounded-md text-xs overflow-x-auto pr-20 ${
                            isDark ? 'bg-gray-900 text-gray-400 border border-gray-800' : 'bg-gray-50 text-gray-700 border border-gray-200'
                          }`}>
                            <code>{result.codeSnippet[type as keyof typeof result.codeSnippet]}</code>
                          </pre>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Features */}
          {!file && (
            <div className={`mt-8 rounded-md border p-4 ${
              isDark 
                ? 'bg-white/5 border-gray-700' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>Videos</h4>
                  <ul className={`space-y-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <li>• MP4 (H.264)</li>
                    <li>• WebM (VP9)</li>
                    <li>• GIF</li>
                  </ul>
                </div>
                <div>
                  <h4 className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>Images</h4>
                  <ul className={`space-y-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <li>• WebP</li>
                    <li>• AVIF</li>
                    <li>• PNG / JPG</li>
                  </ul>
                </div>
              </div>
              <div className={`mt-4 pt-4 border-t text-center ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  All formats include HTML, React, and Markdown embed code
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
