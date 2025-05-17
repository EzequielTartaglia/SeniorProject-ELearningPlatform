"use client";

import {
  getCourse,
  editCourse,
} from "@/src/controllers/platform/course/course";
import { getCurrencyTypes } from "@/src/controllers/platform/currency_type/currency_type";
import { getCourseLevels } from "@/src/controllers/platform/course_level/course_level";
import { getPaymentMethods } from "@/src/controllers/platform/payment_method/payment_method";
import {
  getPlatformProfessorUsers,
  getPlatformProfessorUsersFromBusiness,
} from "@/src/controllers/platform/platform_user/platform_professor_user";

import { useNotification } from "@/contexts/NotificationContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserInfoContext } from "@/contexts/UserInfoContext";

import Input from "@/components/forms/Input";
import PageHeader from "@/components/page_formats/PageHeader";
import CheckboxInput from "../../CheckboxInput";
import SubmitLoadingButton from "@/components/forms/SubmitLoadingButton";
import SelectInput from "../../SelectInput";
import TextArea from "@/components/forms/TextArea";
import Button from "@/components/Button";
import { FiTrash2 } from "react-icons/fi";
import FileInput from "../../FileInput";
import Image from "next/image";
import { FaExclamationTriangle } from "react-icons/fa";

export default function EditCourse({ courseId }) {
  const { user } = useUserInfoContext();

  const [course, setCourse] = useState({
    id: courseId,
    name: "",
    has_final_exam: true,
    is_paid: true,
    payment_methods: [],
    course_level_id: null,
    description: "",
    image_preview_link: "",
    professor_id: null,
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const router = useRouter();
  const { showNotification } = useNotification();

  const [currencyTypesTable, setCurrencyTypesTable] = useState([]);
  const [courseLevelsTable, setCourseLevelsTable] = useState([]);
  const [paymentMethodsTable, setPaymentMethodsTable] = useState([]);
  const [professorsTable, setProfessorsTable] = useState([]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const fetchedCourse = await getCourse(courseId);
  
        setCourse({
          ...fetchedCourse,
          payment_methods: JSON.parse(fetchedCourse.payment_methods) || [],
        });
  
        const [currencyTypes, courseLevels, paymentMethods] = await Promise.all([
          getCurrencyTypes(),
          getCourseLevels(),
          getPaymentMethods(),
        ]);
  
        setCurrencyTypesTable(currencyTypes.filter((type) => type.id !== 1));
        setCourseLevelsTable(courseLevels);
        setPaymentMethodsTable(paymentMethods);
      } catch (error) {
        console.error("Error al obtener el curso:", error);
      }
    };
  
    fetchCourse();
  }, [courseId]);
  
  useEffect(() => {
    const filterData = async () => {
      if (!user || !course?.platform_user_business_id) return;
  
      try {
        if (user.user_role_id === 3) {
          if (course.platform_user_business_id !== user.platform_user_business_id) {
            setHasAccess(false);
            return;
          }
          setHasAccess(true);
        } else if (user.user_role_id === 4 || user.user_role_id === 5) {
          setHasAccess(true);
        }
  
        const filteredProfessors =
          user.user_role_id === 3
            ? await getPlatformProfessorUsersFromBusiness(parseInt(user.platform_user_business_id))
            : await getPlatformProfessorUsers();
  
        setProfessorsTable(filteredProfessors);
      } catch (error) {
        console.error("Error al obtener datos de los profesores:", error);
      }
    };
  
    if (course?.id) {
      filterData();
    }
  }, [course, user]); 
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    let errors = {};

    if (!course.name || course.name.length === 0) {
      errors.name = "Campo obligatorio";
    }

    if (course.is_paid && course.payment_methods.length === 0) {
      errors.payment_methods = "Debes agregar al menos un método de pago.";
    }

    if (!course.course_level_id) {
      errors.course_level_id = "Campo obligatorio";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsLoading(true);

    try {
      await editCourse(
        courseId,
        course.name,
        course.has_final_exam,
        course.is_paid,
        JSON.stringify(course.payment_methods),
        course.course_level_id,
        course.description,
        course.image_preview_link,
        course.professor_id
      );

      showNotification("¡Curso editado exitosamente!", "success");

      setTimeout(() => {
        setIsLoading(false);
        router.push("/platform/courses");
      }, 2000);
    } catch (error) {
      console.error("Error al editar el curso:", error.message);
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "is_paid") {
      setCourse((prevCourse) => ({
        ...prevCourse,
        [name]: checked,
        // Reset payment methods when is_paid is toggled
        payment_methods: checked
          ? [{ method_id: "", currency_id: "", link: "", price: "" }]
          : [],
      }));
    } else {
      setCourse((prevCourse) => ({
        ...prevCourse,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handlePaymentMethodChange = (index, field, value) => {
    const updatedMethods = course.payment_methods.map((method, i) =>
      i === index ? { ...method, [field]: value } : method
    );

    setCourse((prevCourse) => ({
      ...prevCourse,
      payment_methods: updatedMethods,
    }));
  };

  const handleAddPaymentMethod = () => {
    setCourse((prevCourse) => ({
      ...prevCourse,
      payment_methods: [
        ...prevCourse.payment_methods,
        { method_id: "", currency_id: "", link: "", price: "" },
      ],
    }));
  };

  const handleRemovePaymentMethod = (index) => {
    setCourse((prevCourse) => ({
      ...prevCourse,
      payment_methods: prevCourse.payment_methods.filter((_, i) => i !== index),
    }));
  };

  const handleFileUploadSuccess = (url) => {
    setCourse((prevCourse) => ({
      ...prevCourse,
      image_preview_link: url,
    }));
  };

  const handleFileChange = (event) => {
    console.log(event.target.files[0]);
  };

  if (!hasAccess) {
    return (
      <div className="flex flex-col justify-center items-center h-screen ">
        <div className="flex flex-col items-center p-6 card-theme border-secondary-light rounded-md shadow-lg">
          <FaExclamationTriangle className="text-red-500 text-6xl mb-4" />
          <h1 className="text-red-600 text-3xl font-semibold mb-2">
            Acceso denegado
          </h1>
          <p className="text-white text-center">
            Lo sentimos, no tienes permiso para acceder a esta página. Si crees
            que esto es un error, contacta al administrador.
          </p>
          <button
            className="mt-4 px-4 py-2 bg-primary text-title-active-static rounded-md shadow-md transition duration-300 bg-primary border-secondary-light text-title-active-static font-semibold bg-dark-mode "
            onClick={() => (window.location.href = "/platform")}
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Editar curso"
        goBackRoute="/platform/courses"
        goBackText={"Volver al listado de cursos"}
      />

      <form onSubmit={handleSubmit} className="box-theme">
        <Input
          label="Nombre"
          name="name"
          value={course.name}
          placeholder=""
          onChange={handleInputChange}
          isSubmitted={isSubmitted}
          required={true}
          errorMessage={formErrors.name}
        />

        <TextArea
          label="Descripcion"
          name="description"
          value={course.description}
          placeholder="Escribe algo aquí..."
          onChange={handleInputChange}
          isSubmitted={isSubmitted}
          note="El texto ingresado aparecerá públicamente en el preview y en la información del curso."
          hasHightlightTexts={true}
        />

        <div className="mt-1">
          <SelectInput
            label="Profesor"
            name="professor_id"
            value={course.professor_id}
            onChange={handleInputChange}
            isSubmitted={isSubmitted}
            table={professorsTable}
            columnName="first_name"
            columnName2="last_name"
            idColumn="id"
          />
        </div>

        <div className="mt-1 mb-[-10px]">
          <SelectInput
            label="Nivel"
            name="course_level_id"
            value={course.course_level_id}
            required={true}
            onChange={handleInputChange}
            isSubmitted={isSubmitted && !course.course_level_id}
            errorMessage={formErrors.course_level_id}
            table={courseLevelsTable}
            columnName="name"
            idColumn="id"
          />
        </div>

        <CheckboxInput
          id="has_final_exam"
          name="has_final_exam"
          label="¿Tiene evaluación final?"
          checked={course.has_final_exam}
          onChange={handleInputChange}
        />

        <CheckboxInput
          id="is_paid"
          name="is_paid"
          label="¿Es pago?"
          checked={course.is_paid}
          onChange={handleInputChange}
        />

        {course.is_paid && (
          <>
            <div className="mt-4 mb-4">
              <h3 className="text-lg font-medium">Métodos de Pago</h3>
              {course.payment_methods.map((method, index) => (
                <div key={index} className="mt-2 mb-2 border p-2 rounded">
                  <SelectInput
                    label="Método de Pago"
                    name={`method_id-${index}`}
                    value={method.method_id}
                    required={true}
                    onChange={(e) =>
                      handlePaymentMethodChange(
                        index,
                        "method_id",
                        e.target.value
                      )
                    }
                    isSubmitted={isSubmitted && !method.method_id}
                    errorMessage={formErrors.method_id}
                    table={paymentMethodsTable}
                    columnName="name"
                    idColumn="id"
                  />
                  <SelectInput
                    label="Moneda"
                    name={`currency_id-${index}`}
                    value={method.currency_id}
                    required={true}
                    onChange={(e) =>
                      handlePaymentMethodChange(
                        index,
                        "currency_id",
                        e.target.value
                      )
                    }
                    isSubmitted={isSubmitted && !method.currency_id}
                    errorMessage={formErrors.currency_id}
                    table={currencyTypesTable}
                    columnName="abbreviation"
                    idColumn="id"
                  />
                  <Input
                    label="Link de Pago"
                    name={`link-${index}`}
                    value={method.link}
                    required={true}
                    placeholder="https://example.com/payment_link"
                    onChange={(e) =>
                      handlePaymentMethodChange(index, "link", e.target.value)
                    }
                  />
                  <Input
                    label="Precio"
                    name={`price-${index}`}
                    value={method.price}
                    required={true}
                    placeholder="99.99"
                    onChange={(e) =>
                      handlePaymentMethodChange(index, "price", e.target.value)
                    }
                  />
                  <Button
                    customClasses="text-danger mt-2 shadow-none"
                    customFunction={() => handleRemovePaymentMethod(index)}
                    isAnimated={false}
                    icon={<FiTrash2 className="text-lg" size={24} />}
                  />
                </div>
              ))}
              <Button
                customClasses="text-title-active mt-2 shadow-none"
                customFunction={handleAddPaymentMethod}
                isAnimated={false}
                text={"+ Añadir Método de Pago"}
              />
            </div>
            {isSubmitted && course.payment_methods.length === 0 && (
              <span className="text-danger">{formErrors.payment_methods}</span>
            )}
          </>
        )}

        <label
          htmlFor="image_preview_link"
          className="mt-2 block text-sm font-medium text-gray-700"
        >
          Miniatura de Imagen
        </label>
        {course.image_preview_link && (
          <div className="mt-2">
            <Image
              src={course.image_preview_link}
              alt="Vista previa"
              width={150}
              height={150}
              className="border rounded-md"
              unoptimized
            />
          </div>
        )}

        <div className="mt-4">
          <FileInput
            name="courseImage"
            onChange={handleFileChange}
            onUploadSuccess={handleFileUploadSuccess}
            showPreview={false}
          />
        </div>

        <SubmitLoadingButton type="submit" isLoading={isLoading}>
          Editar Curso
        </SubmitLoadingButton>
      </form>
    </>
  );
}
