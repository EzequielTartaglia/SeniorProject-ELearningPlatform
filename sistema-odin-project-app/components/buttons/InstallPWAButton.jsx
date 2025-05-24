"use client";

import { useEffect, useState } from "react";
import { FaDesktop } from "react-icons/fa";
import Button from "../Button";

const InstallPWAButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const systemName = process.env.NEXT_PUBLIC_SYSTEM_NAME;

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        console.log("User accepted the install prompt");
      } else {
        console.log("User dismissed the install prompt");
      }
      setDeferredPrompt(null);
    }
  };

  return (
    deferredPrompt && (
      <Button
        customClasses="px-4 py-2 bg-primary text-title-active-static rounded-md shadow-md hover:bg-secondary transition duration-300 bg-primary border-secondary-light text-title-active-static font-semibold gradient-button"
        text={
          <>
            <FaDesktop className="inline-block mr-2" /> Descargar {systemName}
          </>
        }
        title={`Descargar ${systemName}`}
        customFunction={handleInstallClick}
      />
    )
  );
};

export default InstallPWAButton;
