"use client";

import { useEffect, useState } from "react";
import { getPlatformSetting } from "@/src/models/platform/platform_setting/platform_setting";
import { FaWhatsapp } from "react-icons/fa";
import Button from "../Button";

const CallToActionWhatsAppButton = ({ message, buttonTitle }) => {
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    async function fetchPhoneNumber() {
      try {
        const settings = await getPlatformSetting();
        setPhoneNumber(settings.contact_number);
      } catch (error) {
        console.error("Error fetching contact phone:", error);
      }
    }

    fetchPhoneNumber();
  }, []);

  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, "_blank");
  };

  return (
    <>
      {phoneNumber && (
          <Button
            customFunction={handleClick}
            customClasses="items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg shadow-lg shadow-md transition duration-300 hover:-translate-y-1 transition duration-300 "
            isAnimated={false}
            disabled={!phoneNumber}
            title={buttonTitle}
            icon={<FaWhatsapp size={24} />}
          />
      )}
    </>
  );
};

export default CallToActionWhatsAppButton;
