"use client";

import {
  addPlatformUser,
  checkEmailExists,
} from "@/src/models/platform/platform_user/platform_user";
import { getPlatformUserRoles } from "@/src/models/platform/platform_user_role/platform_user_role";
import { getCountries } from "@/src/models/platform/country/country";
import { getPlatformUserGenders } from "@/src/models/platform/platform_user_gender/platform_user_gender";

import { useNotification } from "@/contexts/NotificationContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Input from "@/components/forms/Input";
import PageHeader from "@/components/page_formats/PageHeader";
import SubmitLoadingButton from "@/components/forms/SubmitLoadingButton";
import SelectInput from "@/components/forms/SelectInput";

export default function SignUpForm() {
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    platform_user_gender_id: null,
    phone: "",
    email: "",
    country_id: null,
    dni_ssn: "",
    password: "",
    username: "",
    user_role_id: "",
    birthdate: null,
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
        const platformUserRolesFetched = await getPlatformUserRoles();
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

        const gendersFetched = await getPlatformUserGenders();
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

    if (!user.user_role_id) {
      errors.user_role_id = "Campo obligatorio";
    }

    if (!user.platform_user_gender_id) {
      errors.platform_user_gender_id = "Campo obligatorio";
    }

    if (!user.country_id) {
      errors.country_id = "Campo obligatorio";
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

      await addPlatformUser(
        user.first_name,
        user.last_name,
        user.platform_user_gender_id,
        user.phone,
        user.email,
        user.country_id,
        user.dni_ssn,
        user.username,
        user.password,
        user.user_role_id,
        user.birthdate
      );

      showNotification("¡Usuario registrado exitosamente!", "success");

      setTimeout(() => {
        setIsLoading(false);
        router.push("/platform/users");
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
        goBackRoute="/platform/users"
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
          name="platform_user_gender_id"
          value={user.platform_user_gender_id}
          required={true}
          onChange={handleInputChange}
          isSubmitted={isSubmitted && !user.platform_user_gender_id}
          errorMessage={formErrors.platform_user_gender_id}
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
          name="country_id"
          value={user.country_id}
          required={true}
          onChange={handleInputChange}
          isSubmitted={isSubmitted && !user.country_id}
          errorMessage={formErrors.country_id}
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
          name="user_role_id"
          value={user.user_role_id}
          required={true}
          onChange={handleInputChange}
          isSubmitted={isSubmitted && !user.user_role_id}
          errorMessage={formErrors.user_role_id}
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
