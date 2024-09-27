// src/components/Header.tsx
"use client"; // Client component directive

import React from 'react';
import Link from 'next/link';
import { FaSignInAlt } from 'react-icons/fa'; // Login icon
import Image from 'next/image';
import logo from '/public/assets/images/logo.png'; // Update this path to your logo

const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-lg h-20">
      <div className="flex items-center">
        {/* Logo - Adjusted the size */}
        <Image src={logo} alt="IST Logo" width={100} height={50} />
      </div>
      <div>
        {/* Login button */}
        <Link href="/login" className="flex items-center bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700 transition">
          <FaSignInAlt className="mr-2" /> Login
        </Link>
      </div>
    </header>
  );
};

export default Header;
