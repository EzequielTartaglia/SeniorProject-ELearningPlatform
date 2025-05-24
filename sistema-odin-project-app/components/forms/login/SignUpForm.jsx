"use client";

import {
  addPlatformUser,
  checkEmailExists,
} from "@/src/controllers/platform/platform_user/platform_user";
import { getPlatformUserRoles } from "@/src/controllers/platform/platform_user_role/platform_user_role";
import { getCountries } from "@/src/controllers/platform/country/country";
import { getPlatformUserGenders } from "@/src/controllers/platform/platform_user_gender/platform_user_gender";

import { useNotification } from "@/contexts/NotificationContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserInfoContext } from "@/contexts/UserInfoContext";

import Input from "@/components/forms/Input";
import PageHeader from "@/components/page_formats/PageHeader";
import SubmitLoadingButton from "@/components/forms/SubmitLoadingButton";
import SelectInput from "@/components/forms/SelectInput";

export default function SignUpForm() {

    const { user } = useUserInfoContext();
  
  const [newUser, setNewUser] = useState({
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
    platform_user_business_id: null,
    created_by_user_id: null,
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

    if (!newUser.first_name) {
      errors.first_name = "Campo obligatorio";
    }

    if (!newUser.last_name) {
      errors.last_name = "Campo obligatorio";
    }

    if (!newUser.email) {
      errors.email = "Campo obligatorio";
    }

    if (!newUser.phone) {
      errors.phone = "Campo obligatorio";
    }

    if (!newUser.password) {
      errors.password = "Campo obligatorio";
    }

    if (!newUser.username) {
      errors.username = "Campo obligatorio";
    }

    if (!newUser.user_role_id) {
      errors.user_role_id = "Campo obligatorio";
    }

    if (!newUser.platform_user_gender_id) {
      errors.platform_user_gender_id = "Campo obligatorio";
    }

    if (!newUser.country_id) {
      errors.country_id = "Campo obligatorio";
    }

    if (!newUser.birthdate) {
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
      const emailExists = await checkEmailExists(newUser.email);
      if (emailExists) {
        showNotification(
          "Este correo electrónico ya está registrado. Por favor, intente con otro.",
          "danger"
        );
        setIsLoading(false);
        return;
      }

      await addPlatformUser(
        newUser.first_name,
        newUser.last_name,
        newUser.platform_user_gender_id,
        newUser.phone,
        newUser.email,
        newUser.country_id,
        newUser.dni_ssn,
        newUser.username,
        newUser.password,
        newUser.user_role_id,
        newUser.birthdate,
        user.platform_user_business_id,
        user.id
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

    setNewUser((prevUser) => ({
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
          value={newUser.first_name}
          required={true}
          placeholder=""
          onChange={handleInputChange}
          isSubmitted={isSubmitted && !newUser.first_name}
          errorMessage={formErrors.first_name}
        />

        <Input
          label="Apellido"
          name="last_name"
          value={newUser.last_name}
          required={true}
          placeholder=""
          onChange={handleInputChange}
          isSubmitted={isSubmitted && !newUser.last_name}
          errorMessage={formErrors.last_name}
        />

        <Input
          label="Fecha de nacimiento"
          name="birthdate"
          type="date"
          value={newUser.birthdate}
          required={true}
          onChange={handleInputChange}
          isSubmitted={isSubmitted && !newUser.birthdate}
          errorMessage={formErrors.birthdate}
        />

        <SelectInput
          label="Género"
          name="platform_user_gender_id"
          value={newUser.platform_user_gender_id}
          required={true}
          onChange={handleInputChange}
          isSubmitted={isSubmitted && !newUser.platform_user_gender_id}
          errorMessage={formErrors.platform_user_gender_id}
          table={genders}
          columnName="label"
          idColumn="value"
        />

        <Input
          label="Teléfono"
          name="phone"
          value={newUser.phone}
          required={true}
          placeholder=""
          onChange={handleInputChange}
          isSubmitted={isSubmitted && !newUser.phone}
          errorMessage={formErrors.phone}
        />

        <Input
          label="Email"
          name="email"
          value={newUser.email}
          required={true}
          placeholder=""
          onChange={handleInputChange}
          isSubmitted={isSubmitted && !newUser.email}
          errorMessage={formErrors.email}
        />

        <SelectInput
          label="País"
          name="country_id"
          value={newUser.country_id}
          required={true}
          onChange={handleInputChange}
          isSubmitted={isSubmitted && !newUser.country_id}
          errorMessage={formErrors.country_id}
          table={countries}
          columnName="label"
          idColumn="value"
        />

        <Input
          label="Nº Seguro Social (DNI/SSN)"
          name="dni_ssn"
          value={newUser.dni_ssn}
          placeholder=""
          onChange={handleInputChange}
          isSubmitted={isSubmitted}
        />

        <Input
          label="Nombre de usuario"
          name="username"
          value={newUser.username}
          required={true}
          placeholder=""
          onChange={handleInputChange}
          isSubmitted={isSubmitted && !newUser.username}
          errorMessage={formErrors.username}
        />

        <Input
          label="Contraseña"
          name="password"
          type="password"
          value={newUser.password}
          required={true}
          placeholder=""
          onChange={handleInputChange}
          isSubmitted={isSubmitted && !newUser.password}
          errorMessage={formErrors.password}
        />

        <SelectInput
          label="Rol de usuario"
          name="user_role_id"
          value={newUser.user_role_id}
          required={true}
          onChange={handleInputChange}
          isSubmitted={isSubmitted && !newUser.user_role_id}
          errorMessage={formErrors.newUser}
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
