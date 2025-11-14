import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/lib/ThemeContext";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Put The Files In the Bag",
  description: "Convert videos and images into optimized, web-ready formats with ready-to-embed code snippets",
  metadataBase: new URL("https://putthefilesinthebag.xyz"),
  openGraph: {
    title: "Put The Files In the Bag",
    description: "Convert videos and images into optimized, web-ready formats with ready-to-embed code snippets",
    url: "https://putthefilesinthebag.xyz",
    siteName: "Put The Files In the Bag",
    images: [
      {
        url: "/assets/og/ptfitb-of.png",
        width: 1200,
        height: 630,
        alt: "Put The Files In the Bag - Video and Image Converter",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Put The Files In the Bag",
    description: "Convert videos and images into optimized, web-ready formats with ready-to-embed code snippets",
    images: ["/assets/og/ptfitb-of.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${inter.variable} font-sans antialiased`}
        >
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
