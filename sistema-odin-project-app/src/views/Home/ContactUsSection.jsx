import ContactUsForm from "@/emails/ContactUsForm";

import Subtitle from "@/components/Subtitle";
import Title from "@/components/Title";

export default function ContactUsSection() {
  return <section className="py-8 px-4  mx-auto">
  <div className="mb-6">
        <Title
          text="Contáctanos"
          textPositionClass="text-center"
          textColorClass="text-gray-300"
        />
        <Subtitle
          text="¿Eres proveedor o cliente interesado en nuevas oportunidades? ¡Estamos aquí para ayudarte!"
          textPositionClass="text-center"
          textColorClass="text-gray-400"
          marginPositionClasses="mt-4 mb-8"
          customClasses="text-lg"
        />

    <ContactUsForm />
  </div>
  </section>
}

