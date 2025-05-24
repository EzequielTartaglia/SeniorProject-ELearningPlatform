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
    <div className="box-theme p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold text-center text-primary mb-6">
        Acerca del {systemName}
      </h1>
      <p className="text-lg text-center text-primary mb-8">
        Odin es un sistema de gestión educativa diseñado para facilitar la
        administración y seguimiento de cursos, estudiantes y profesores.
        Nuestra plataforma ofrece herramientas para la creación de contenidos,
        evaluación de aprendizajes y gestión de información académica.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-gradient-to-r from-primary to-secondary p-6 rounded-lg shadow-md text-center border-card-detail">
          <FaChalkboardTeacher className="text-primary text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-primary mb-2">
            Gestión de Cursos
          </h2>
          <p className="text-primary">
            Administra y organiza tus cursos de manera eficiente con
            herramientas avanzadas de gestión de contenidos.
          </p>
        </div>
        <div className="bg-gradient-to-r from-primary to-secondary p-6 rounded-lg shadow-md text-center border-card-detail">
          <FaBookOpen className="text-primary text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-primary mb-2">
            Seguimiento de Estudiantes
          </h2>
          <p className="text-primary">
            Realiza un seguimiento detallado del progreso y desempeño de los
            estudiantes en tiempo real.
          </p>
        </div>
        <div className="bg-gradient-to-r from-primary to-secondary p-6 rounded-lg shadow-md text-center border-card-detail">
          <FaGraduationCap className="text-primary text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-primary mb-2">
            Evaluación de Aprendizajes
          </h2>
          <p className="text-primary">
            Utiliza herramientas de evaluación para medir y mejorar el
            aprendizaje de los estudiantes.
          </p>
        </div>
        <div className="bg-gradient-to-r from-primary to-secondary p-6 rounded-lg shadow-md text-center border-card-detail">
          <FaDownload className="text-primary text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-primary mb-2">
            Descarga de Escritorio
          </h2>
          <p className="text-primary">
            Descarga la versión de escritorio para una mejor experiencia.
          </p>
          <span className="inline-block mr-2 mt-4">
            {" "}
            <InstallPWAButton />
          </span>
        </div>
        <div className="bg-gradient-to-r from-primary to-secondary p-6 rounded-lg shadow-md text-center border-card-detail">
          <FaCertificate className="text-primary text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-primary mb-2">
            Certificados Automáticos
          </h2>
          <p className="text-primary">
            Genera y descarga certificados de finalización automáticamente para
            cada curso completado.
          </p>
        </div>
      </div>
    </div>
  );
}
