'use client';

import DangerToast from '@/components/toasts/DangerToast';
import InfoToast from '@/components/toasts/InfoToast';
import SuccessToast from '@/components/toasts/SuccessToast';
import WarningToast from '@/components/toasts/WarningToast';
import { createContext, useState, useContext } from 'react';


const NotificationContext = createContext();

export function useNotification() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      hideNotification();
    }, 3000);
  };

  const hideNotification = () => {
    setNotification(null);
  };

  const renderToast = (type, message) => {
    switch (type) {
      case 'success':
        return <SuccessToast message={message} onClose={hideNotification} />;
      case 'info':
        return <InfoToast message={message} onClose={hideNotification} />;
      case 'warning':
        return <WarningToast message={message} onClose={hideNotification} />;
      case 'danger':
        return <DangerToast message={message} onClose={hideNotification} />;
      default:
        return null;
    }
  };

  return (
    <NotificationContext.Provider value={{ showNotification, hideNotification }}>
      {children}
      {notification && renderToast(notification.type, notification.message)}
    </NotificationContext.Provider>
  );
}
