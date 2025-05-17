"use client";

import { editControlCenterUser } from "@/src/controllers/control_center/control_center_user/control_center_user";
import { getControlCenterUserRoles } from "@/src/controllers/control_center/control_center_user_role/control_center_user_role";
import { getCountries } from "@/src/controllers/control_center/control_center_country/control_center_country";
import { getControlCenterUserGenders } from "@/src/controllers/control_center/control_center_user_gender/control_center_user_gender";

import { useState, useEffect } from "react";
import { useNotification } from "@/contexts/NotificationContext";
import { useRouter } from "next/navigation";
import { useUserControlCenterContext } from "@/contexts/UserInfoControlCenterContext";

import PageHeader from "@/components/page_formats/PageHeader";
import Input from "@/components/forms/Input";
import SubmitLoadingButton from "@/components/forms/SubmitLoadingButton";
import SelectInput from "@/components/forms/SelectInput";

export default function EditControlCenterUserForm() {
  const { userControlCenter } = useUserControlCenterContext();

  const [initialUserData, setInitialUserData] = useState({ ...userControlCenter });

  const [userData, setUserData] = useState({
    id: userControlCenter.id,
    first_name: userControlCenter.first_name,
    last_name: userControlCenter.last_name,
    cc_user_gender_id: userControlCenter.cc_user_gender_id,
    phone: userControlCenter.phone,
    email: userControlCenter.email,
    cc_country_id: userControlCenter.cc_country_id,
    dni_ssn: userControlCenter.dni_ssn || "",
    username: userControlCenter.username,
    password: userControlCenter.password || "",
    cc_user_role_id: userControlCenter.cc_user_role_id,
    birthdate: userControlCenter.birthdate,
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

    if (!userData.cc_user_role_id) {
      errors.cc_user_role_id = "Campo obligatorio";
    }

    if (!userData.cc_user_gender_id) {
      errors.cc_user_gender_id = "Campo obligatorio";
    }

    if (!userData.cc_country_id) {
      errors.cc_country_id = "Campo obligatorio";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsSubmitted(true);
      return;
    }

    setIsLoading(true);

    try {
      await editControlCenterUser(
        userControlCenter.id,
        userData.first_name,
        userData.last_name,
        userData.cc_user_gender_id,
        userData.phone,
        userData.email,
        userData.cc_country_id,
        userData.dni_ssn,
        userData.username,
        userControlCenter.password,
        userData.cc_user_role_id,
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
        goBackRoute="/control_center/user/profile"
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
          name="cc_user_gender_id"
          value={userData.cc_user_gender_id}
          required={true}
          onChange={handleInputChange}
          isSubmitted={isSubmitted && !userData.cc_user_gender_id}
          errorMessage={formErrors.cc_user_gender_id}
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
          name="cc_country_id"
          value={userData.cc_country_id}
          required={true}
          onChange={handleInputChange}
          isSubmitted={isSubmitted && !userData.cc_country_id}
          errorMessage={formErrors.cc_country_id}
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
