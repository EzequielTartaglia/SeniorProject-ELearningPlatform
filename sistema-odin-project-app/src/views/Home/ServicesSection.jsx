import React from "react";
import { FaMicroscope, FaFileMedicalAlt, FaRegClipboard, FaUserMd } from "react-icons/fa"; // Import relevant icons
import Title from "@/components/Title";
import Subtitle from "@/components/Subtitle";

const services = [
  {
    title: "Investigación Clínica",
    icon: <FaMicroscope size={24} />, 
  },
  {
    title: "Asesoría Regulatoria",
    icon: <FaFileMedicalAlt size={24} />,
  },
  {
    title: "Control de Calidad",
    icon: <FaRegClipboard size={24} />, 
  },
  {
    title: "Consultoría en Desarrollo de Medicamentos",
    icon: <FaUserMd size={24} />, 
  },
];

const ServicesSection = () => {
  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 text-secondary">
      <div className="max-w-7xl mx-auto">
        <Title
          text="Servicios que ofrecemos"
          textPositionClass="text-center"
          textColorClass="text-gray-300"
        />
        <Subtitle
          text="Brindamos asesoría integral en las áreas de investigación, regulación y calidad para la industria."
          textPositionClass="text-center"
          textColorClass="text-gray-400"
          marginPositionClasses="mt-4 mb-8"
          customClasses="text-lg"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 bg-disabled rounded-lg shadow-lg border-2 border-blue-500 transition duration-300 ease-in-out"
            >
              <div className="flex items-center justify-center w-16 h-16 mb-4 border-2 border-blue-500 rounded-full bg-gray-900 text-blue-400">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
