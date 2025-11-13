'use client';

import Navbar from "@/components/layout/Navbar";
import { FiCheck, FiX } from "react-icons/fi";
import { useTheme } from '@/lib/ThemeContext';

export default function PricingPage() {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#060010]' : 'bg-gray-50'} transition-colors duration-300`}>
      <Navbar />

      <div className="container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <h1 className={`text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                Pricing
              </h1>
              <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Pay once, use forever</p>
            </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
            {/* Free Tier */}
            <div className={`rounded-2xl shadow-lg p-8 border-2 ${
              isDark 
                ? 'bg-white/5 border-white/10' 
                : 'bg-white border-gray-200'
            }`}>
              <div className="text-center mb-8">
                <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>Free</h3>
                <div className={`text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>€0</div>
                <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>Forever free</p>
              </div>

              <div className={`text-center mb-8 rounded-lg p-4 border ${
                isDark 
                  ? 'bg-yellow-900/20 border-yellow-500/30' 
                  : 'bg-yellow-50 border-yellow-200'
              }`}>
                <p className={`font-semibold ${isDark ? 'text-yellow-300' : 'text-yellow-800'}`}>
                  3 conversions per day
                </p>
                <p className={`text-sm ${isDark ? 'text-yellow-400' : 'text-yellow-700'}`}>
                  Resets daily at midnight
                </p>
              </div>

              <button className={`w-full py-3 rounded-lg font-semibold transition ${
                isDark 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}>
                Current Plan
              </button>
            </div>

            {/* Lifetime Tier */}
            <div className={`rounded-2xl shadow-2xl p-8 border-2 border-purple-500 relative ${
              isDark ? 'bg-white/5' : 'bg-white'
            }`}>
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Best Value
                </span>
              </div>

              <div className="text-center mb-8 mt-4">
                <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  Lifetime
                </h3>
                <div className={`text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  €3.29
                </div>
                <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>One-time payment, use forever</p>
              </div>

              <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:cursor-pointer hover:bg-purple-700 transition">
                Coming Soon
              </button>
            </div>
          </div>

          {/* Feature Comparison */}
          <div className={`mt-16 rounded-2xl shadow-lg overflow-hidden border ${
            isDark 
              ? 'bg-white/5 border-white/10' 
              : 'bg-white border-gray-200'
          }`}>
            <div className={`px-8 py-6 border-b ${
              isDark 
                ? 'bg-white/5 border-white/10' 
                : 'bg-gray-100 border-gray-200'
            }`}>
              <h2 className={`text-2xl font-bold text-center ${isDark ? 'text-white' : 'text-gray-800'}`}>
                Feature Comparison
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                    <th className={`px-8 py-4 text-left font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                      Feature
                    </th>
                    <th className={`px-8 py-4 text-center font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                      Free
                    </th>
                    <th className={`px-8 py-4 text-center font-semibold ${
                      isDark 
                        ? 'bg-blue-900/20 text-gray-200' 
                        : 'bg-blue-50 text-gray-700'
                    }`}>
                      Lifetime
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-white/10' : 'divide-gray-200'}`}>
                  <tr className={isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'}>
                    <td className={`px-8 py-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Daily conversions
                    </td>
                    <td className={`px-8 py-4 text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      3 per day
                    </td>
                    <td className={`px-8 py-4 text-center font-semibold ${
                      isDark 
                        ? 'text-blue-400 bg-blue-900/20' 
                        : 'text-blue-600 bg-blue-50'
                    }`}>
                      Unlimited
                    </td>
                  </tr>

                  <tr className={isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'}>
                    <td className={`px-8 py-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      All format outputs (MP4, WebM, GIF, WebP, AVIF)
                    </td>
                    <td className="px-8 py-4 text-center">
                      <FiCheck className="w-6 h-6 text-green-500 mx-auto" />
                    </td>
                    <td className={`px-8 py-4 text-center ${isDark ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
                      <FiCheck className="w-6 h-6 text-green-500 mx-auto" />
                    </td>
                  </tr>

                  <tr className={isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'}>
                    <td className={`px-8 py-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Code snippets (HTML, React, Markdown)
                    </td>
                    <td className="px-8 py-4 text-center">
                      <FiCheck className="w-6 h-6 text-green-500 mx-auto" />
                    </td>
                    <td className={`px-8 py-4 text-center ${isDark ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
                      <FiCheck className="w-6 h-6 text-green-500 mx-auto" />
                    </td>
                  </tr>

                  <tr className={isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'}>
                    <td className={`px-8 py-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Watermarks</td>
                    <td className="px-8 py-4 text-center">
                      <span className={`font-medium ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
                        Branded
                      </span>
                    </td>
                    <td className={`px-8 py-4 text-center ${isDark ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
                      <FiX className="w-6 h-6 text-red-500 mx-auto" />
                      <span className={`text-xs block mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        No watermarks
                      </span>
                    </td>
                  </tr>

                  <tr className={isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'}>
                    <td className={`px-8 py-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Custom branding</td>
                    <td className="px-8 py-4 text-center">
                      <FiX className="w-6 h-6 text-red-500 mx-auto" />
                    </td>
                    <td className={`px-8 py-4 text-center ${isDark ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
                      <FiCheck className="w-6 h-6 text-green-500 mx-auto" />
                    </td>
                  </tr>

                  <tr className={isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'}>
                    <td className={`px-8 py-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Priority processing
                    </td>
                    <td className="px-8 py-4 text-center">
                      <FiX className="w-6 h-6 text-red-500 mx-auto" />
                    </td>
                    <td className={`px-8 py-4 text-center ${isDark ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
                      <FiCheck className="w-6 h-6 text-green-500 mx-auto" />
                    </td>
                  </tr>

                  <tr className={isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'}>
                    <td className={`px-8 py-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Higher quality exports
                    </td>
                    <td className="px-8 py-4 text-center">
                      <FiX className="w-6 h-6 text-red-500 mx-auto" />
                    </td>
                    <td className={`px-8 py-4 text-center ${isDark ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
                      <FiCheck className="w-6 h-6 text-green-500 mx-auto" />
                    </td>
                  </tr>

                  <tr className={isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'}>
                    <td className={`px-8 py-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      ZIP download (all formats)
                    </td>
                    <td className="px-8 py-4 text-center">
                      <FiX className="w-6 h-6 text-red-500 mx-auto" />
                    </td>
                    <td className={`px-8 py-4 text-center ${isDark ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
                      <FiCheck className="w-6 h-6 text-green-500 mx-auto" />
                    </td>
                  </tr>

                  <tr className={isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'}>
                    <td className={`px-8 py-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Email support</td>
                    <td className="px-8 py-4 text-center">
                      <FiX className="w-6 h-6 text-red-500 mx-auto" />
                    </td>
                    <td className={`px-8 py-4 text-center ${isDark ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
                      <FiCheck className="w-6 h-6 text-green-500 mx-auto" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-20 max-w-3xl mx-auto">
            <h2 className={`text-3xl font-bold text-center mb-8 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              <div className={`rounded-lg p-6 shadow border ${
                isDark 
                  ? 'bg-white/5 border-white/10' 
                  : 'bg-white border-gray-200'
              }`}>
                <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  What happens after I use my 3 free conversions?
                </h3>
                <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                  Your daily limit resets at midnight. You can continue using
                  the free tier indefinitely, or upgrade to Lifetime for
                  unlimited conversions.
                </p>
              </div>

              <div className={`rounded-lg p-6 shadow border ${
                isDark 
                  ? 'bg-white/5 border-white/10' 
                  : 'bg-white border-gray-200'
              }`}>
                <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  What are the watermarks on free conversions?
                </h3>
                <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                  Free tier includes a small &quot;putthefilesinthebag.xyz&quot;
                  watermark on your converted media. Lifetime users get
                  completely clean, watermark-free exports.
                </p>
              </div>

              <div className={`rounded-lg p-6 shadow border ${
                isDark 
                  ? 'bg-white/5 border-white/10' 
                  : 'bg-white border-gray-200'
              }`}>
                <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  Is the Lifetime plan really one-time payment?
                </h3>
                <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                  Yes! Pay €3.29 once and get unlimited conversions, no
                  watermarks, and all premium features forever. No
                  subscriptions, no recurring charges.
                </p>
              </div>

              <div className={`rounded-lg p-6 shadow border ${
                isDark 
                  ? 'bg-white/5 border-white/10' 
                  : 'bg-white border-gray-200'
              }`}>
                <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  Do you store my files?
                </h3>
                <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                  No! All processing happens in-memory and files are
                  automatically deleted after conversion. Your privacy is our
                  priority.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
