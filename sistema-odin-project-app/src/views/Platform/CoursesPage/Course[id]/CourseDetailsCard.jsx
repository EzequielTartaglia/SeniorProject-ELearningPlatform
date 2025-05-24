import parseTextWithColor from "@/src/helpers/parseTextWithColor";
import Image from "next/image";
import { FaArrowCircleRight, FaClock } from "react-icons/fa";

export default function CourseDetailsCard({
  moduleList = [],
  level,
  description,
  totalTime,
  imageUrl
}) {
  const sortedModules = moduleList.sort((a, b) => a.id - b.id);

  return (
    <div className="box-theme shadow-lg rounded-lg overflow-hidden">
      <div className="relative w-full h-64 lg:h-80 bg-secondary rounded-t-lg overflow-hidden">
        <Image
          src={imageUrl || "https://i.ibb.co/9rfGxfH/course-preview-link-placeholder.png"}
          alt="Course Image"
          layout="fill"
          objectFit="cover"
          className="object-cover"
        />
      </div>
      <div className="p-6 space-y-6">
        {level && (
          <div className="text-primary">
            <h3 className="text-lg font-bold mb-2 text-title-active-static">Nivel</h3>
            <p className="leading-relaxed font-semibold">{level}</p>
          </div>
        )}
        {totalTime && (
          <div>
            <h3 className="text-lg font-bold mb-2 text-title-active-static">Duración</h3>
            <div className="flex items-center text-primary mb-4">
              <FaClock className="mr-2" size={20} />
              <p className="leading-relaxed font-semibold">{totalTime}</p>
            </div>
          </div>
        )}
        {description && (
          <div>
            <h3 className="text-lg font-bold mb-2 text-title-active-static">Información General</h3>
            <p className="text-primary p-4 bg-white shadow-md rounded-md leading-relaxed font-semibold whitespace-pre-wrap">
              {parseTextWithColor(description)}
            </p>
          </div>
        )}
        {sortedModules.length > 0 && (
          <div>
            <h3 className="text-lg font-bold mb-2 text-title-active-static">Contenidos</h3>
            <ul className="space-y-2">
              {sortedModules.map((module) => (
                <li
                  key={module.id}
                  className="flex flex-col p-4 bg-white shadow-md rounded-md text-title-active-static"
                >
                  <div className="flex items-start">
                    <FaArrowCircleRight className="mt-1 mr-2 text-primary" size={20} />
                    <span className="font-semibold text-lg">{module.title}</span>
                  </div>
                  {module.description && (
                    <p className="text-md text-gray-800 ml-8 font-semibold whitespace-pre-wrap">
                      {parseTextWithColor(module.description)}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
