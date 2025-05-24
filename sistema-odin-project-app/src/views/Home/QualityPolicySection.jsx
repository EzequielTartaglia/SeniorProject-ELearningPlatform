import {
  FiBriefcase,
  FiCalendar,
  FiFile,
  FiFileText,
  FiGlobe,
  FiUserCheck,
  FiUsers,
} from "react-icons/fi";

export default function QualityPolicySection() {
  return (
    <div className="max-w-7xl mx-auto bg-white p-6">
      <h2 className="text-3xl font-bold text-primary mb-4 flex items-center">
        <FiFileText className="mr-2" /> Política de Calidad
      </h2>
      <p className="text-lg mb-4 text-primary flex items-center">
        Somos una empresa especializada en consultoría, ofreciendo asesoramiento
        estratégico en diversas áreas como cumplimiento normativo, desarrollo de
        productos y optimización de procesos. Nuestro equipo está compuesto por
        expertos en múltiples disciplinas, incluyendo tecnología, regulación y
        desarrollo de negocios, comprometidos en proporcionar soluciones
        efectivas y personalizadas para nuestros clientes.
      </p>
      <div className="bg-gray-100 p-4 rounded-lg mb-4 text-primary">
        <h3 className="text-2xl font-semibold text-primary mb-2 flex items-center">
          <FiUserCheck className="mr-2" /> Con los clientes
        </h3>
        <p className="text-lg mb-4 text-primary flex items-center">
          Brindar servicios de consultoría con integridad, calidad y precisión
          científica, adaptándonos a las necesidades específicas de cada
          cliente, garantizando cumplimiento regulatorio y éxito en el mercado.
        </p>
        <h3 className="text-2xl font-semibold text-primary mb-2 flex items-center">
          <FiUsers className="mr-2" /> Con nuestro equipo
        </h3>
        <p className="text-lg mb-4 text-primary flex items-center">
          Fomentar un entorno de trabajo de alto rendimiento, proporcionando
          oportunidades de desarrollo profesional continuo y reconocimiento de
          logros individuales y colectivos, garantizando un entorno laboral
          seguro y colaborativo.
        </p>
        <h3 className="text-2xl font-semibold text-primary mb-2 flex items-center">
          <FiBriefcase className="mr-2" /> Con nuestros socios y proveedores
        </h3>
        <p className="text-lg mb-4 text-primary flex items-center">
          Colaborar con socios estratégicos y proveedores de confianza,
          manteniendo altos estándares de calidad en la selección y evaluación
          continua para asegurar la excelencia en nuestros servicios.
        </p>
        <h3 className="text-2xl font-semibold text-primary mb-2 flex items-center">
          <FiGlobe className="mr-2" /> Con la Comunidad
        </h3>
        <p className="text-lg mb-4 text-primary flex items-center">
          Contribuir a la salud pública y el bienestar, cumpliendo con todas las
          regulaciones legales y éticas, apoyando iniciativas de sostenibilidad
          y promoviendo el uso responsable de los recursos.
        </p>
      </div>
    </div>
  );
}
