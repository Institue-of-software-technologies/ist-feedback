// src/app/error.tsx

"use client"; // Add this directive to make it a Client Component

import React from 'react';

interface ErrorProps {
  error: Error;
  reset: () => void; // Function to reset the error boundary
}

const ErrorPage: React.FC<ErrorProps> = ({ error, reset }) => {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Something Went Wrong</h1>
      <p>{error.message}</p>
      <button onClick={() => reset()} style={{ padding: '10px 20px', cursor: 'pointer' }}>
        Try Again
      </button>
    </div>
  );
};

export default ErrorPage;
