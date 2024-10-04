"use client"; // Add this directive at the top
// src/app/layout.tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from '../components/Header';
import Footer from '../components/Footer';
import { UserProvider } from '@/context/UserContext';
import { usePathname } from 'next/navigation'; // Get the current pathname

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// export const metadata: Metadata = {
//   title: "Feedback System",
//   description: "IST Student Feedback System",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname(); // Determine the current path
  const isDashboard = pathname?.startsWith('/dashboard'); // Check if the path is the dashboard

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="flex flex-col min-h-screen">
          {/* Render Header only if not on the dashboard */}
          {!isDashboard && <Header />}
          
          <main className="flex-grow">
            <UserProvider>
              {children}
            </UserProvider>
          </main>
          
          {/* Render Footer on both the home and dashboard */}
          <Footer />
        </div>
      </body>
    </html>
  );
}
