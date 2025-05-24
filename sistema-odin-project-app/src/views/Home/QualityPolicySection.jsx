import {
  FiBriefcase,
  FiCalendar,
  FiFileText,
  FiGlobe,
  FiUserCheck,
  FiUsers,
} from "react-icons/fi";

export default function QualityPolicySection() {
  return (
    <div className="max-w-6xl mx-auto bg-gray-50 p-8 md:p-12 rounded-lg shadow-lg  border-2 border-blue-500">
      {/* Título */}
      
      <h2 className="text-4xl font-extrabold text-blue-500 mb-6 flex items-center gap-3">
        <FiFileText className="text-blue-500" /> Política de Calidad
      </h2>

      {/* Descripción */}
      <p className="text-lg text-gray-700 leading-relaxed mb-8 font-semibold">
        Somos una empresa especializada en consultoría, ofreciendo asesoramiento
        estratégico en diversas áreas como cumplimiento normativo, desarrollo de
        productos y optimización de procesos. Nuestro equipo está compuesto por
        expertos en múltiples disciplinas, incluyendo tecnología, regulación y
        desarrollo de negocios, comprometidos en proporcionar soluciones
        efectivas y personalizadas para nuestros clientes.
      </p>

      {/* Contenido */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card: Clientes */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-blue-500">
          <div className="flex items-center gap-3 mb-4">
            <FiUserCheck className="text-green-500 text-3xl" />
            <h3 className="text-2xl font-bold text-blue-500">Con los clientes</h3>
          </div>
          <p className="text-gray-600 leading-relaxed font-semibold">
            Brindar servicios de consultoría con integridad, calidad y precisión
            científica, adaptándonos a las necesidades específicas de cada
            cliente, garantizando cumplimiento regulatorio y éxito en el mercado.
          </p>
        </div>

        {/* Card: Equipo */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-blue-500">
          <div className="flex items-center gap-3 mb-4">
            <FiUsers className="text-indigo-500 text-3xl" />
            <h3 className="text-2xl font-bold text-blue-500">Con nuestro equipo</h3>
          </div>
          <p className="text-gray-600 leading-relaxed font-semibold">
            Fomentar un entorno de trabajo de alto rendimiento, proporcionando
            oportunidades de desarrollo profesional continuo y reconocimiento de
            logros individuales y colectivos, garantizando un entorno laboral
            seguro y colaborativo.
          </p>
        </div>

        {/* Card: Socios */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-blue-500">
          <div className="flex items-center gap-3 mb-4">
            <FiBriefcase className="text-orange-500 text-3xl" />
            <h3 className="text-2xl font-bold text-blue-500">
              Con nuestros socios y proveedores
            </h3>
          </div>
          <p className="text-gray-600 leading-relaxed font-semibold">
            Colaborar con socios estratégicos y proveedores de confianza,
            manteniendo altos estándares de calidad en la selección y evaluación
            continua para asegurar la excelencia en nuestros servicios.
          </p>
        </div>

        {/* Card: Comunidad */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-blue-500">
          <div className="flex items-center gap-3 mb-4">
            <FiGlobe className="text-teal-500 text-3xl" />
            <h3 className="text-2xl font-bold text-blue-500">Con la Comunidad</h3>
          </div>
          <p className="text-gray-600 leading-relaxed font-semibold">
            Contribuir a la salud pública y el bienestar, cumpliendo con todas las
            regulaciones legales y éticas, apoyando iniciativas de sostenibilidad
            y promoviendo el uso responsable de los recursos.
          </p>
        </div>
      </div>
    </div>
  );
}
