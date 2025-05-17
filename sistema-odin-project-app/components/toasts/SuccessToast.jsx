'use client';

import { useState, useEffect } from 'react';

const SuccessToast = ({ message, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);

    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 500); 
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-4 right-4 p-4 rounded-md shadow-md bg-green-500 text-primary transform transition-transform duration-500 ease-in-out ${
        visible ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex items-center justify-center">
        <span className="mr-2 text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </span>
        <span className="text-center">{message}</span>
      </div>
    </div>
  );
};

export default SuccessToast;