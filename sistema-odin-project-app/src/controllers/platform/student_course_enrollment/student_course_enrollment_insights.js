import supabase from "@/utils/supabase/supabaseClient";

const calculateAge = (birthdate, enrollmentDate) => {
  const birth = new Date(birthdate);
  const enrollment = new Date(enrollmentDate);
  let age = enrollment.getFullYear() - birth.getFullYear();
  const monthDiff = enrollment.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && enrollment.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

async function getUserData() {
  try {
    const { data, error } = await supabase
      .from("platform_users")
      .select("id, platform_user_gender_id, birthdate, country_id");

    if (error) {
      throw error;
    }

    return data.reduce((acc, user) => {
      acc[user.id] = {
        gender_id: user.platform_user_gender_id,
        birthdate: user.birthdate, 
        country_id: user.country_id,
      };
      return acc;
    }, {});
  } catch (error) {
    console.error("Error fetching user data (genders, countries and birthdates):", error.message);
    throw error;
  }
}

async function getGenderNames() {
  try {
    const { data, error } = await supabase
      .from("platform_user_genders")
      .select("id, name");

    if (error) {
      throw error;
    }

    return data.reduce((acc, gender) => {
      acc[gender.id] = gender.name;
      return acc;
    }, {});
  } catch (error) {
    console.error("Error fetching gender names:", error.message);
    throw error;
  }
}

async function getCountryNames() {
  try {
    const { data, error } = await supabase
      .from("countries")
      .select("id, name");

    if (error) {
      throw error;
    }

    return data.reduce((acc, country) => {
      acc[country.id] = country.name;
      return acc;
    }, {});
  } catch (error) {
    console.error("Error fetching country names:", error.message);
    throw error;
  }
}

export async function getEnrollmentCountsByCourse() {
  try {
    const [enrollmentsData, userData, genderNames, countryNames] = await Promise.all([
      supabase.from("student_course_enrollments").select("*"),
      getUserData(),
      getGenderNames(),
      getCountryNames(),
    ]);

    if (enrollmentsData.error) {
      throw enrollmentsData.error;
    }

    const formattedData = enrollmentsData.data.map((item) => {
      const user = userData[item.platform_user_id] || {};
      return {
        course_id: item.course_id,
        total_enrollments: item.count || 0, 
        payment: item.payment || 0,
        currency_abbreviation: item.currency_abbreviation || "Desconocido",
        enrollment_date: item.enrollment_date || null,
        platform_user_id: item.platform_user_id,
        platform_user_gender_id: user.gender_id || "Desconocido",
        platform_user_gender_name: genderNames[user.gender_id] || "Desconocido",
        platform_user_country_id: user.country_id || "Desconocido",
        platform_user_country_name: countryNames[user.country_id] || "Desconocido",
        birthdate: user.birthdate || "No disponible", 
        age: calculateAge(user.birthdate,item.enrollment_date)
      };
    });

    return formattedData;
  } catch (error) {
    console.error("Error fetching enrollment counts by course:", error.message);
    throw error;
  }
}
