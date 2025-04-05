import React from 'react';

export function Select({ options, value, onChange, className = '', placeholder = 'Select an option', ...props }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 box-border ${className}`}
      {...props}
    >
      <option value="" disabled>{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}