import InstallPWAButton from "@/components/buttons/InstallPWAButton";
import {
  FaBookOpen,
  FaChalkboardTeacher,
  FaGraduationCap,
  FaDownload,
  FaCertificate,
} from "react-icons/fa";

export default function SystemInfo() {
  const systemName = process.env.NEXT_PUBLIC_SYSTEM_NAME;

  return (
    <div className="p-8 bg-gradient-to-r from-gray-50 to-gray-200 rounded-lg shadow-xl" style={{
      backgroundImage: "url('/background-body.webp')",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}>
      <h1 className="text-4xl font-bold text-center text-white mb-6">
        Acerca del {systemName}
      </h1>
      <p className="text-lg text-center text-white mb-8 px-6 sm:px-12 font-semibold">
        Odin es un sistema de gestión educativa diseñado para facilitar la
        administración y seguimiento de cursos, estudiantes y profesores. Nuestra
        plataforma ofrece herramientas para la creación de contenidos, evaluación
        de aprendizajes y gestión de información académica.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-gradient-to-r from-primary to-secondary p-6 rounded-2xl shadow-md  transition duration-300 ease-in-out text-center border-2 border-blue-500">
          <FaChalkboardTeacher className="text-black text-6xl mx-auto mb-4 " />
          <h2 className="text-2xl font-semibold text-blue-500 mb-2">Gestión de Cursos</h2>
          <p className="text-black font-semibold">
            Administra y organiza tus cursos de manera eficiente con herramientas
            avanzadas de gestión de contenidos.
          </p>
        </div>

        <div className="bg-gradient-to-r from-primary to-secondary p-6 rounded-2xl shadow-md  transition duration-300 ease-in-out text-center border-2 border-blue-500">
          <FaBookOpen className="text-black text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-blue-500 mb-2">Seguimiento de Estudiantes</h2>
          <p className="text-black font-semibold">
            Realiza un seguimiento detallado del progreso y desempeño de los
            estudiantes en tiempo real.
          </p>
        </div>

        <div className="bg-gradient-to-r from-primary to-secondary p-6 rounded-2xl shadow-md  transition duration-300 ease-in-out text-center border-2 border-blue-500">
          <FaGraduationCap className="text-black text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-blue-500 mb-2">Evaluación de Aprendizajes</h2>
          <p className="text-black font-semibold">
            Utiliza herramientas de evaluación para medir y mejorar el
            aprendizaje de los estudiantes.
          </p>
        </div>

        <div className="bg-gradient-to-r from-primary to-secondary p-6 rounded-2xl shadow-md  transition duration-300 ease-in-out text-center border-2 border-blue-500">
          <FaDownload className="text-black text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-blue-500 mb-2">Descarga de Escritorio</h2>
          <p className="text-black font-semibold">
            Descarga la versión de escritorio para una mejor experiencia.
          </p>
          <div className="inline-block mr-2 mt-4">
            <InstallPWAButton />
          </div>
        </div>

        <div className="bg-gradient-to-r from-primary to-secondary p-6 rounded-2xl shadow-md  transition duration-300 ease-in-out text-center border-2 border-blue-500">
          <FaCertificate className="text-black text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-blue-500 mb-2">Certificados Automáticos</h2>
          <p className="text-black font-semibold">
            Genera y descarga certificados de finalización automáticamente para
            cada curso completado.
          </p>
        </div>
      </div>
    </div>
  );
}
