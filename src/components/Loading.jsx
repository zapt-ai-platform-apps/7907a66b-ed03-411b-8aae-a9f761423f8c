import React from 'react';

export function Loading({ size = 'medium' }) {
  const sizeClass = {
    small: 'w-5 h-5',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };
  
  return (
    <div className="flex justify-center my-4">
      <div className={`${sizeClass[size]} border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin`}></div>
    </div>
  );
}