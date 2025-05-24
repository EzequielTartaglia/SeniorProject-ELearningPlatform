import React from "react";
import {
  FaShieldAlt,
  FaCertificate,
  FaMicroscope,
  FaPrescriptionBottle,
} from "react-icons/fa";

const items = [
  {
    title: "Cumplimiento Regulatorio",
    icon: <FaShieldAlt size={24} />,
  },
  {
    title: "Calidad en los Servicios",
    icon: <FaCertificate size={24} />,
  },
  {
    title: "Innovación en Biotecnología",
    icon: <FaMicroscope size={24} />,
  },
  {
    title: "Experiencia en Consultoría",
    icon: <FaPrescriptionBottle size={24} />,
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 bg-disabled rounded-lg shadow-lg border-2 border-blue-500 transition duration-300 ease-in-out"
            >
              <div className="flex items-center justify-center w-16 h-16 mb-4 border-2 border-blue-500 rounded-full bg-gray-900 text-blue-400">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
