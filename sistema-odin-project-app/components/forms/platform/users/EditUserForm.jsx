"use client";

import { editPlatformUser } from "@/src/models/platform/platform_user/platform_user";
import { getPlatformUserRoles } from "@/src/models/platform/platform_user_role/platform_user_role";
import { getCountries } from "@/src/models/platform/country/country";
import { getPlatformUserGenders } from "@/src/models/platform/platform_user_gender/platform_user_gender";

import { useState, useEffect } from "react";
import { useNotification } from "@/contexts/NotificationContext";
import { useRouter } from "next/navigation";
import { useUserInfoContext } from "@/contexts/UserInfoContext";

import PageHeader from "@/components/page_formats/PageHeader";
import Input from "@/components/forms/Input";
import SubmitLoadingButton from "@/components/forms/SubmitLoadingButton";
import SelectInput from "@/components/forms/SelectInput";

export default function EditUserForm() {
  const { user } = useUserInfoContext();

  const [initialUserData, setInitialUserData] = useState({ ...user });

  const [userData, setUserData] = useState({
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    platform_user_gender_id: user.platform_user_gender_id,
    phone: user.phone,
    email: user.email,
    country_id: user.country_id,
    dni_ssn: user.dni_ssn || "",
    username: user.username,
    password: user.password || "",
    user_role_id: user.user_role_id,
    birthdate: user.birthdate,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [platformUserRoles, setPlatformUserRoles] = useState([]);
  const [countries, setCountries] = useState([]);
  const [genders, setGenders] = useState([]);

  const router = useRouter();
  const { showNotification } = useNotification();

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
        console.error("Error al obtener datos de usuario:", error.message);
      }
    }
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let errors = {};

    if (!userData.first_name) {
      errors.first_name = "Campo obligatorio";
    }

    if (!userData.last_name) {
      errors.last_name = "Campo obligatorio";
    }

    if (!userData.birthdate) {
      errors.birthdate = "Campo obligatorio";
    }

    if (!userData.email) {
      errors.email = "Campo obligatorio";
    }

    if (!userData.phone) {
      errors.phone = "Campo obligatorio";
    }

    if (!userData.username) {
      errors.username = "Campo obligatorio";
    }

    if (!userData.user_role_id) {
      errors.user_role_id = "Campo obligatorio";
    }

    if (!userData.platform_user_gender_id) {
      errors.platform_user_gender_id = "Campo obligatorio";
    }

    if (!userData.country_id) {
      errors.country_id = "Campo obligatorio";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsSubmitted(true);
      return;
    }

    setIsLoading(true);

    try {
      await editPlatformUser(
        user.id,
        userData.first_name,
        userData.last_name,
        userData.platform_user_gender_id,
        userData.phone,
        userData.email,
        userData.country_id,
        userData.dni_ssn,
        userData.username,
        user.password,
        userData.user_role_id,
        userData.birthdate
      );

      showNotification("¡Usuario actualizado exitosamente!", "success");

      setTimeout(() => {
        setIsLoading(false);
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error al actualizar usuario:", error.message);
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setUserData((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));

    setFormErrors({
      ...formErrors,
      [name]: undefined,
    });
  };

  const hasChanged = () => {
    for (const key in userData) {
      if (userData[key] !== initialUserData[key]) {
        return true;
      }
    }
    return false;
  };

  return (
    <>
      <PageHeader
        title="Informacion personal"
        goBackRoute="/platform/user/profile"
        goBackText="Volver al perfil"
      />

      <form onSubmit={handleSubmit} className="box-theme">
        <Input
          label="Nombre"
          name="first_name"
          value={userData.first_name}
          required={true}
          placeholder=""
          onChange={handleInputChange}
          isSubmitted={isSubmitted && !userData.first_name}
          errorMessage={formErrors.first_name}
        />

        <Input
          label="Apellido"
          name="last_name"
          value={userData.last_name}
          required={true}
          placeholder=""
          onChange={handleInputChange}
          isSubmitted={isSubmitted && !userData.last_name}
          errorMessage={formErrors.last_name}
        />

        <Input
          label="Fecha de nacimiento"
          name="birthdate"
          type="date"
          value={userData.birthdate}
          required={true}
          onChange={handleInputChange}
          isSubmitted={isSubmitted && !userData.birthdate}
          errorMessage={formErrors.birthdate}
        />

        <SelectInput
          label="Género"
          name="platform_user_gender_id"
          value={userData.platform_user_gender_id}
          required={true}
          onChange={handleInputChange}
          isSubmitted={isSubmitted && !userData.platform_user_gender_id}
          errorMessage={formErrors.platform_user_gender_id}
          table={genders}
          columnName="label"
          idColumn="value"
        />

        <Input
          label="Teléfono"
          name="phone"
          value={userData.phone}
          required={true}
          placeholder=""
          onChange={handleInputChange}
          isSubmitted={isSubmitted && !userData.phone}
          errorMessage={formErrors.phone}
        />

        <Input
          label="Email"
          name="email"
          value={userData.email}
          required={true}
          placeholder=""
          onChange={handleInputChange}
          isSubmitted={isSubmitted && !userData.email}
          errorMessage={formErrors.email}
        />

        <SelectInput
          label="País"
          name="country_id"
          value={userData.country_id}
          required={true}
          onChange={handleInputChange}
          isSubmitted={isSubmitted && !userData.country_id}
          errorMessage={formErrors.country_id}
          table={countries}
          columnName="label"
          idColumn="value"
        />

        <Input
          label="Nº Seguro Social (DNI/SSN)"
          name="dni_ssn"
          value={userData.dni_ssn}
          placeholder=""
          onChange={handleInputChange}
          isSubmitted={isSubmitted}
        />

        <Input
          label="Nombre de usuario"
          name="username"
          value={userData.username}
          required={true}
          placeholder=""
          onChange={handleInputChange}
          isSubmitted={isSubmitted && !userData.username}
          errorMessage={formErrors.username}
        />

        <SubmitLoadingButton
          type="submit"
          isLoading={isLoading || !hasChanged()}
          submitText={
            !hasChanged()
              ? "Datos personales actualizados"
              : "Actualizando informacion personal"
          }
        >
          Actualizar informacion personal
        </SubmitLoadingButton>
      </form>
    </>
  );
}
