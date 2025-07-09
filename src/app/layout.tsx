// Location: src/app/layout.tsx

import type { Metadata } from "next";
// You can change the font to whatever you are using
import { Inter } from "next/font/google"; 

// Create a globals.css file in your app directory if you don't have one
// import "./globals.css"; 

const inter = Inter({ subsets: ["latin"] });

// This is default metadata for pages that don't have their own
export const metadata: Metadata = {
  title: "My Awesome Site",
  description: "A site built with Next.js and Directus",
};

export default function RootLayout({
  children,
  params: { locale }, // We get the 'locale' from the URL params here
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  return (
    // The lang attribute will now be 'en' or 'fr' dynamically
    <html lang={locale}>
      <body className={inter.className}>
        {/* The {children} prop is where your page content will be injected */}
        {children}
      </body>
    </html>
  );
}