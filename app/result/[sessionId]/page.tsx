'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiDownload, FiCopy, FiCheck, FiPackage } from 'react-icons/fi';
import Navbar from '@/components/layout/Navbar';
import { useTheme } from '@/lib/ThemeContext';
import { createZipFromResults, downloadBlob } from '@/lib/zipUtils';

interface ConversionResult {
  format: string;
  path: string;
  size: number;
  url: string;
}

interface ResultData {
  success: boolean;
  sessionId: string;
  originalFile: string;
  fileType: string;
  results: ConversionResult[];
}

export default function ResultPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  const { isDark } = useTheme();
  
  const [data, setData] = useState<ResultData | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<string>('html');
  const [downloadingZip, setDownloadingZip] = useState(false);

  useEffect(() => {
    // Retrieve conversion results from sessionStorage
    const storedData = sessionStorage.getItem(`conversion_${sessionId}`);
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setData(parsedData);
      } catch (error) {
        console.error('Failed to parse conversion data:', error);
      }
    }
  }, [sessionId]);

  const handleDownloadAll = async () => {
    if (!data) return;
    
    setDownloadingZip(true);
    try {
      const zipBlob = await createZipFromResults(data.results);
      const baseName = data.originalFile.replace(/\.[^/.]+$/, '');
      downloadBlob(zipBlob, `${baseName}-converted.zip`);
    } catch (error) {
      console.error('Failed to create ZIP:', error);
    } finally {
      setDownloadingZip(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const generateCodeSnippet = (result: ConversionResult, format: string) => {
    const baseUrl = globalThis.location?.origin || '';
    const url = `${baseUrl}${result.url}`;

    if (format === 'html') {
      if (data?.fileType === 'video') {
        return `<video controls width="640" height="360">
  <source src="${url}" type="video/${result.format.toLowerCase()}">
  Your browser does not support the video tag.
</video>`;
      } else {
        return `<img src="${url}" alt="${data?.originalFile}" loading="lazy">`;
      }
    } else if (format === 'react') {
      if (data?.fileType === 'video') {
        return `<video controls width={640} height={360}>
  <source src="${url}" type="video/${result.format.toLowerCase()}" />
  Your browser does not support the video tag.
</video>`;
      } else {
        return `<img src="${url}" alt="${data?.originalFile}" loading="lazy" />`;
      }
    } else if (format === 'markdown') {
      if (data?.fileType === 'video') {
        return `<video controls width="640" height="360">
  <source src="${url}" type="video/${result.format.toLowerCase()}">
</video>`;
      } else {
        return `![${data?.originalFile}](${url})`;
      }
    }
    return '';
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (!data) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-[#060010]' : 'bg-gray-50'}`}>
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className={isDark ? 'text-white' : 'text-gray-900'}>Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#060010]' : 'bg-gray-50'} transition-colors`}>
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className={`text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Conversion Complete! 🎉
            </h1>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Original file: <span className="font-semibold">{data.originalFile}</span>
            </p>
          </div>

          {/* Download All Button */}
          <div className="mb-6 flex justify-center">
            <button
              onClick={handleDownloadAll}
              disabled={downloadingZip}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiPackage />
              {downloadingZip ? 'Creating ZIP...' : 'Download All as ZIP'}
            </button>
          </div>

          {/* Results Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {data.results.map((result, index) => (
              <div
                key={index}
                className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} border rounded-xl p-6 hover:scale-105 transition-transform`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {result.format}
                  </h3>
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {formatFileSize(result.size)}
                  </span>
                </div>
                
                <a
                  href={result.url}
                  download
                  className={`flex items-center justify-center gap-2 w-full py-3 rounded-lg font-semibold transition ${
                    isDark 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  <FiDownload />
                  Download
                </a>
              </div>
            ))}
          </div>

          {/* Code Snippets Section */}
          <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} border rounded-xl p-8`}>
            <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Ready-to-Embed Code Snippets
            </h2>
            
            {/* Format Selector */}
            <div className="flex gap-2 mb-6">
              {['html', 'react', 'markdown'].map((format) => (
                <button
                  key={format}
                  onClick={() => setSelectedFormat(format)}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    selectedFormat === format
                      ? 'bg-blue-600 text-white'
                      : isDark
                      ? 'bg-white/10 text-gray-300 hover:bg-white/20'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {format.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Code Snippets */}
            <div className="space-y-4">
              {data.results.map((result, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {result.format}
                    </h3>
                    <button
                      onClick={() => copyToClipboard(generateCodeSnippet(result, selectedFormat), index)}
                      className={`flex items-center gap-2 px-3 py-1 rounded text-sm transition ${
                        copiedIndex === index
                          ? 'bg-green-600 text-white'
                          : isDark
                          ? 'bg-white/10 text-gray-300 hover:bg-white/20'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {copiedIndex === index ? (
                        <>
                          <FiCheck /> Copied!
                        </>
                      ) : (
                        <>
                          <FiCopy /> Copy
                        </>
                      )}
                    </button>
                  </div>
                  <pre className={`${isDark ? 'bg-black/50 text-gray-300' : 'bg-gray-50 text-gray-800'} p-4 rounded-lg overflow-x-auto text-sm`}>
                    <code>{generateCodeSnippet(result, selectedFormat)}</code>
                  </pre>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 text-center">
            <Link
              href="/convert"
              className="inline-block px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Convert Another File →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
