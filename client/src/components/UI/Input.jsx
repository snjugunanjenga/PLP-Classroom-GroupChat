import { useState } from 'react';

export const Input = ({ className, type, ...props }) => {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  return (
    <div className={`relative w-full`}>
      <input
        {...props}
        type={isPassword ? (show ? 'text' : 'password') : type}
        className={`border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${isPassword ? 'pr-10' : ''} ${className}`}
      />
      {isPassword && (
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShow((s) => !s)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none p-1"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? (
            // Eye open SVG
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          ) : (
            // Eye closed SVG
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M9.88 9.88A3 3 0 0112 9c1.657 0 3 1.343 3 3 0 .512-.13.995-.36 1.41m-1.32 1.32A3 3 0 0112 15c-1.657 0-3-1.343-3-3 0-.512.13-.995.36-1.41m1.32-1.32A3 3 0 0112 9c1.657 0 3 1.343 3 3 0 .512-.13.995-.36 1.41m-1.32 1.32A3 3 0 0112 15c-1.657 0-3-1.343-3-3 0-.512.13-.995.36-1.41" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
};