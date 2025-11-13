"use client";

import Link from "next/link";
import { MdPermMedia } from "react-icons/md";
import { FaCopyright, FaCode, FaArrowRight } from "react-icons/fa";
import Image from "next/image";

import Navbar from "@/components/layout/Navbar";
import Squares from "@/components/Squares";
import { useTheme } from "@/lib/ThemeContext";

export default function Home() {
  const { isDark } = useTheme();

  return (
    <div
      className={`min-h-screen ${
        isDark ? "bg-[#060010]" : "bg-gray-50"
      } relative overflow-hidden transition-colors duration-300`}
    >
      {/* Animated Squares Background */}
      <div className="absolute inset-0 z-0">
        <Squares
          direction="down"
          speed={0.3}
          borderColor={
            isDark ? "rgba(100, 100, 255, 0.3)" : "rgba(59, 130, 246, 0.2)"
          }
          squareSize={128}
          hoverFillColor={
            isDark ? "rgba(100, 100, 255, 0.2)" : "rgba(59, 130, 246, 0.05)"
          }
          gradientColor={isDark ? "#060010" : "#f8f8ff"}
        />
      </div>

      {/* Content Layer */}
      <div className="relative z-10">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <div
            className={`max-w-4xl mx-auto text-center ${
              isDark ? "text-white" : "text-gray-900"
            } transition-colors`}
          >
            {/* Hero */}
            <div className={`${
              isDark ? "bg-white/5 border-purple-500/30" : "bg-white/50 border-purple-400/40"
            }  rounded-2xl border-2 p-4 shadow-xl transition-all`}>
              <div className="flex flex-row justify-between items-center gap-8">
                <div className="flex-1 text-left">
                  <h1 className="text-6xl font-bold drop-shadow-sm select-none mb-3">
                    &quot;Just Put the Files in the Bag Bro&quot;
                  </h1>
                </div>
                <div className="shrink-0">
                  <Image
                    src="/assets/logo/logo.png"
                    alt="Put The Files In The Bag"
                    width={220}
                    height={220}
                    className="drop-shadow-2xl hover:scale-105 transition-transform rotate-12"
                  />
                </div>
              </div>
            </div>
            <p className="text-2xl mb-4 font-light">
              Convert once. Single Bundle. Embed anywhere.
            </p>
            <p
              className={`text-lg mb-12 font-light ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Upload videos or images → Get optimized formats + ready-to-embed
              code snippets
            </p>

            {/* CTA */}
            <Link
              href="/convert"
              className="uppercase inline-block px-8 py-4 rounded-md text-xl font-semibold hover:scale-105 transform transition shadow-2xl bg-purple-700 hover:bg-purple-800/60 dark:bg-purple-600/30 text-white dark:hover:bg-purple-700/50"
            >
              Start Converting →
            </Link>

            {/* Features Grid */}
            <div className="mt-20 grid md:grid-cols-3 gap-8 text-left">
              <div
                className={`${
                  isDark ? "bg-white/5" : "bg-white/80"
                } backdrop-blur-sm p-6 rounded-xl hover:scale-105 transition border ${
                  isDark ? "border-white/10" : "border-gray-200"
                }`}
              >
                <div className="flex text-4xl mb-3">
                  {" "}
                  <MdPermMedia />
                </div>
                <h3 className="text-xl font-semibold mb-2">Multiple Formats</h3>
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  MP4, WebM, GIF, WebP, AVIF - all in one go
                </p>
              </div>
              <div
                className={`${
                  isDark ? "bg-white/5" : "bg-white/80"
                } backdrop-blur-sm p-6 rounded-xl hover:scale-105 transition border ${
                  isDark ? "border-white/10" : "border-gray-200"
                }`}
              >
                <div className="text-4xl mb-3">
                  {" "}
                  <FaCopyright />
                </div>
                <h3 className="text-xl font-semibold mb-2">Custom Branding</h3>
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Add watermarks and logos automatically
                </p>
              </div>
              <div
                className={`${
                  isDark ? "bg-white/5" : "bg-white/80"
                } backdrop-blur-sm p-6 rounded-xl hover:scale-105 transition border ${
                  isDark ? "border-white/10" : "border-gray-200"
                }`}
              >
                <div className="text-4xl mb-3">
                  {" "}
                  <FaCode />
                </div>
                <h3 className="text-xl font-semibold mb-2">Code Snippets</h3>
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  HTML, React, Markdown - copy & paste ready
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
