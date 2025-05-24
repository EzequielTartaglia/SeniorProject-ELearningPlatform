"use client";

import { useEffect, useState } from "react";

export default function NotificationComponent({ title, message, icon }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      if (typeof Notification !== "undefined") {
        if (Notification.permission === "granted") {
          showNotification(title, message, icon);
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
              showNotification(title, message, icon);
            }
          });
        }
      }
    }
  }, [isMobile, title, message, icon]);

  const showNotification = (title, message, icon) => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready
        .then((registration) => {
          registration.showNotification(title, {
            body: message,
            icon: icon || "/logo.png",
          });
        })
        .catch((err) => {
          console.error(
            "Error al mostrar la notificación desde el Service Worker",
            err
          );
        });
    } else {
      new Notification(title, {
        body: message,
        icon: icon || "/logo.png",
      });
    }
  };

  return null;
}

/*         
        <NotificationComponent
          title="Bienvenido a tu perfil"
          message="Aquí podrás ver tus tratamientos y más información importante."
          icon="/logo.png"
        />
    
 */
