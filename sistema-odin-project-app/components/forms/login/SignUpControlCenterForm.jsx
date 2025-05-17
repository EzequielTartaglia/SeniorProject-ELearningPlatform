"use client";

import { checkEmailExists, addControlCenterUser } from "@/src/controllers/control_center/control_center_user/control_center_user";
import { getControlCenterUserRoles } from "@/src/controllers/control_center/control_center_user_role/control_center_user_role";
import { getControlCenterUserGenders } from "@/src/controllers/control_center/control_center_user_gender/control_center_user_gender";
import { getCountries } from "@/src/controllers/control_center/control_center_country/control_center_country";

import { useNotification } from "@/contexts/NotificationContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Input from "@/components/forms/Input";
import PageHeader from "@/components/page_formats/PageHeader";
import SubmitLoadingButton from "@/components/forms/SubmitLoadingButton";
import SelectInput from "@/components/forms/SelectInput";
import { useUserControlCenterInfo } from "@/src/helpers/useUserControlCenterInfo";

export default function SignUpControlCenterForm() {

  const { userControlCenter } = useUserControlCenterInfo();

  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    cc_user_gender_id: null,
    phone: "",
    email: "",
    cc_country_id: null,
    dni_ssn: "",
    password: "",
    username: "",
    cc_user_role_id: "",
    birthdate: null,
    cc_user_business_id : null,
    created_by_user_id : null
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const router = useRouter();
  const { showNotification } = useNotification();

  const [platformUserRoles, setPlatformUserRoles] = useState([]);
  const [countries, setCountries] = useState([]);
  const [genders, setGenders] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const platformUserRolesFetched = await getControlCenterUserRoles();
        const filteredRoles = platformUserRolesFetched
          .filter((role) => role.id !== 4)
          .map((role) => ({
            value: role.id,
            label: role.name,
          }));
        setPlatformUserRoles(filteredRoles);

        const countriesFetched = await getCountries();
        const formattedCountries = countriesFetched.map((country) => ({
          value: country.id,
          label: country.name,
        }));
        setCountries(formattedCountries);

        const gendersFetched = await getControlCenterUserGenders();
        const sortedGenders = gendersFetched.sort((a, b) => a.id - b.id);
        const formattedGenders = sortedGenders.map((gender) => ({
          value: gender.id,
          label: gender.name,
        }));
        setGenders(formattedGenders);
      } catch (error) {
        console.error("Error al obtener datos los usuarios:", error.message);
      }
    }
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let errors = {};

    if (!user.first_name) {
      errors.first_name = "Campo obligatorio";
    }

    if (!user.last_name) {
      errors.last_name = "Campo obligatorio";
    }

    if (!user.email) {
      errors.email = "Campo obligatorio";
    }

    if (!user.phone) {
      errors.phone = "Campo obligatorio";
    }

    if (!user.password) {
      errors.password = "Campo obligatorio";
    }

    if (!user.username) {
      errors.username = "Campo obligatorio";
    }

    if (!user.cc_user_role_id) {
      errors.cc_user_role_id = "Campo obligatorio";
    }

    if (!user.cc_user_gender_id) {
      errors.cc_user_gender_id = "Campo obligatorio";
    }

    if (!user.cc_country_id) {
      errors.cc_country_id = "Campo obligatorio";
    }

    if (!user.birthdate) {
      errors.birthdate = "Campo obligatorio";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsSubmitted(true);
      return;
    }

    setFormErrors({});
    setIsSubmitted(false);
    setIsLoading(true);

    try {
      const emailExists = await checkEmailExists(user.email);
      if (emailExists) {
        showNotification(
          "Este correo electrónico ya está registrado. Por favor, intente con otro.",
          "danger"
        );
        setIsLoading(false);
        return;
      }

      await addControlCenterUser(
        user.first_name,
        user.last_name,
        user.cc_user_gender_id,
        user.phone,
        user.email,
        user.cc_country_id,
        user.dni_ssn,
        user.username,
        user.password,
        user.cc_user_role_id,
        user.birthdate,
        userControlCenter.cc_user_business_id,
        userControlCenter.id
      );

      showNotification("¡Usuario registrado exitosamente!", "success");

      setTimeout(() => {
        setIsLoading(false);
        router.push("/control_center/users");
      }, 2000);
    } catch (error) {
      console.error("Error al registrar usuario:", error.message);
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));

    setFormErrors({});
  };

  return (
    <>
      <PageHeader
        title="Registrar usuario"
        goBackRoute="/control_center/users"
        goBackText={"Volver al listado de usuarios"}
      />

      <form onSubmit={handleSubmit} className="box-theme">
        <Input
          label="Nombre"
          name="first_name"
          value={user.first_name}
          required={true}
          placeholder=""
          onChange={handleInputChange}
          isSubmitted={isSubmitted && !user.first_name}
          errorMessage={formErrors.first_name}
        />

        <Input
          label="Apellido"
          name="last_name"
          value={user.last_name}
          required={true}
          placeholder=""
          onChange={handleInputChange}
          isSubmitted={isSubmitted && !user.last_name}
          errorMessage={formErrors.last_name}
        />

        <Input
          label="Fecha de nacimiento"
          name="birthdate"
          type="date"
          value={user.birthdate}
          required={true}
          onChange={handleInputChange}
          isSubmitted={isSubmitted && !user.birthdate}
          errorMessage={formErrors.birthdate}
        />

        <SelectInput
          label="Género"
          name="cc_user_gender_id"
          value={user.platform_user_gender_id}
          required={true}
          onChange={handleInputChange}
          isSubmitted={isSubmitted && !user.cc_user_gender_id}
          errorMessage={formErrors.cc_user_gender_id}
          table={genders}
          columnName="label"
          idColumn="value"
        />

        <Input
          label="Teléfono"
          name="phone"
          value={user.phone}
          required={true}
          placeholder=""
          onChange={handleInputChange}
          isSubmitted={isSubmitted && !user.phone}
          errorMessage={formErrors.phone}
        />

        <Input
          label="Email"
          name="email"
          value={user.email}
          required={true}
          placeholder=""
          onChange={handleInputChange}
          isSubmitted={isSubmitted && !user.email}
          errorMessage={formErrors.email}
        />

        <SelectInput
          label="País"
          name="cc_country_id"
          value={user.cc_country_id}
          required={true}
          onChange={handleInputChange}
          isSubmitted={isSubmitted && !user.cc_country_id}
          errorMessage={formErrors.cc_country_id}
          table={countries}
          columnName="label"
          idColumn="value"
        />

        <Input
          label="Nº Seguro Social (DNI/SSN)"
          name="dni_ssn"
          value={user.dni_ssn}
          placeholder=""
          onChange={handleInputChange}
          isSubmitted={isSubmitted}
        />

        <Input
          label="Nombre de usuario"
          name="username"
          value={user.username}
          required={true}
          placeholder=""
          onChange={handleInputChange}
          isSubmitted={isSubmitted && !user.username}
          errorMessage={formErrors.username}
        />

        <Input
          label="Contraseña"
          name="password"
          type="password"
          value={user.password}
          required={true}
          placeholder=""
          onChange={handleInputChange}
          isSubmitted={isSubmitted && !user.password}
          errorMessage={formErrors.password}
        />

        <SelectInput
          label="Rol de usuario"
          name="cc_user_role_id"
          value={user.cc_user_role_id}
          required={true}
          onChange={handleInputChange}
          isSubmitted={isSubmitted && !user.cc_user_role_id}
          errorMessage={formErrors.cc_user_role_id}
          table={platformUserRoles}
          columnName="label"
          idColumn="value"
        />

        <SubmitLoadingButton type="submit" isLoading={isLoading}>
          Registrar Usuario
        </SubmitLoadingButton>
      </form>
    </>
  );
}
