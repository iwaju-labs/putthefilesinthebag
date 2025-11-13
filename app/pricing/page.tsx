'use client';

import { useState } from 'react';
import Navbar from "@/components/layout/Navbar";
import { FiCheck, FiX, FiLoader } from "react-icons/fi";
import { useTheme } from '@/lib/ThemeContext';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function PricingPage() {
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout');
    } finally {
      setLoading(false);
    }
  };

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

              <button 
                onClick={handlePurchase}
                disabled={loading}
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:cursor-pointer hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <FiLoader className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Get Lifetime Access'
                )}
              </button>
            </div>
          </div>

          {/* Feature Comparison */}
          <div className={`mt-16 rounded-lg overflow-hidden border ${
            isDark 
              ? 'bg-white/5 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <div className={`px-6 py-4 border-b ${
              isDark 
                ? 'bg-white/5 border-gray-700' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <h2 className={`text-lg font-semibold text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Feature Comparison
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <th className={`px-6 py-3 text-left font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Feature
                    </th>
                    <th className={`px-6 py-3 text-center font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Free
                    </th>
                    <th className={`px-6 py-3 text-center font-medium ${
                      isDark 
                        ? 'bg-blue-500/10 text-gray-300' 
                        : 'bg-blue-50 text-gray-700'
                    }`}>
                      Lifetime
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                  <tr>
                    <td className={`px-6 py-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Daily conversions
                    </td>
                    <td className={`px-6 py-3 text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      3 per day
                    </td>
                    <td className={`px-6 py-3 text-center font-medium ${
                      isDark 
                        ? 'text-blue-400 bg-blue-500/10' 
                        : 'text-blue-700 bg-blue-50'
                    }`}>
                      Unlimited
                    </td>
                  </tr>

                  <tr>
                    <td className={`px-6 py-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      All format outputs (MP4, WebM, GIF, WebP, AVIF)
                    </td>
                    <td className="px-6 py-3 text-center">
                      <FiCheck className={`w-4 h-4 mx-auto ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                    </td>
                    <td className={`px-6 py-3 text-center ${isDark ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
                      <FiCheck className={`w-4 h-4 mx-auto ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                    </td>
                  </tr>

                  <tr>
                    <td className={`px-6 py-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Code snippets (HTML, React, Markdown)
                    </td>
                    <td className="px-6 py-3 text-center">
                      <FiCheck className={`w-4 h-4 mx-auto ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                    </td>
                    <td className={`px-6 py-3 text-center ${isDark ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
                      <FiCheck className={`w-4 h-4 mx-auto ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                    </td>
                  </tr>

                  <tr>
                    <td className={`px-6 py-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Watermarks</td>
                    <td className={`px-6 py-3 text-center text-xs ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
                      Yes
                    </td>
                    <td className={`px-6 py-3 text-center text-xs ${isDark ? 'bg-blue-500/10 text-gray-500' : 'bg-blue-50 text-gray-500'}`}>
                      None
                    </td>
                  </tr>

                  <tr>
                    <td className={`px-6 py-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Custom branding</td>
                    <td className="px-6 py-3 text-center">
                      <FiX className={`w-4 h-4 mx-auto ${isDark ? 'text-red-400' : 'text-red-500'}`} />
                    </td>
                    <td className={`px-6 py-3 text-center ${isDark ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
                      <FiCheck className={`w-4 h-4 mx-auto ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                    </td>
                  </tr>

                  <tr>
                    <td className={`px-6 py-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Priority processing
                    </td>
                    <td className="px-6 py-3 text-center">
                      <FiX className={`w-4 h-4 mx-auto ${isDark ? 'text-red-400' : 'text-red-500'}`} />
                    </td>
                    <td className={`px-6 py-3 text-center ${isDark ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
                      <FiCheck className={`w-4 h-4 mx-auto ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                    </td>
                  </tr>

                  <tr>
                    <td className={`px-6 py-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Higher quality exports
                    </td>
                    <td className="px-6 py-3 text-center">
                      <FiX className={`w-4 h-4 mx-auto ${isDark ? 'text-red-400' : 'text-red-500'}`} />
                    </td>
                    <td className={`px-6 py-3 text-center ${isDark ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
                      <FiCheck className={`w-4 h-4 mx-auto ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                    </td>
                  </tr>

                  <tr>
                    <td className={`px-6 py-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      ZIP download (all formats)
                    </td>
                    <td className="px-6 py-3 text-center">
                      <FiX className={`w-4 h-4 mx-auto ${isDark ? 'text-red-400' : 'text-red-500'}`} />
                    </td>
                    <td className={`px-6 py-3 text-center ${isDark ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
                      <FiCheck className={`w-4 h-4 mx-auto ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                    </td>
                  </tr>

                  <tr>
                    <td className={`px-6 py-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Email support</td>
                    <td className="px-6 py-3 text-center">
                      <FiX className={`w-4 h-4 mx-auto ${isDark ? 'text-red-400' : 'text-red-500'}`} />
                    </td>
                    <td className={`px-6 py-3 text-center ${isDark ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
                      <FiCheck className={`w-4 h-4 mx-auto ${isDark ? 'text-green-400' : 'text-green-600'}`} />
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
