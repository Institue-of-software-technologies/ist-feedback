"use client";

import React from "react";

const Loading: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 mb-4"></div>
        <h2 className="text-lg font-medium text-gray-700">Loading...</h2>
      </div>
    </div>
  );
};

export default Loading;
