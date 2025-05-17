"use client";

import { useEffect, useState } from "react";
import { getPlatformSetting } from "@/src/controllers/platform/platform_setting/platform_setting";
import { FaWhatsapp } from "react-icons/fa";

const WhatsAppButton = ({ message }) => {
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
    const encodedMessage = encodeURIComponent(message); 
    const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(url, "_blank");
  };

  return (
    phoneNumber && (
      <div className="fixed bottom-5 right-5">
        <button
          onClick={handleClick}
          className="relative group bg-green-500 text-white rounded-full p-4 shadow-lg hover:bg-green-600 transition duration-300 ease-in-out"
        >
          <FaWhatsapp size={24} />
        </button>
      </div>
    )
  );
};

export default WhatsAppButton;
