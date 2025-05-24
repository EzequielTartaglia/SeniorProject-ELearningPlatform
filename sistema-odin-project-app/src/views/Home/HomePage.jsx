import SystemInfo from "./SystemInfo";
import Button from "@/components/Button";
import WhatsAppButton from "@/components/buttons/WhatsAppButton";
import FeaturesSection from "./FeaturesSection";
import ServicesSection from "./ServicesSection";
import ContactUsSection from "./ContactUsSection";
import QualityPolicySection from "./QualityPolicySection";
import TrustedBrandsSection from "./TrustedBrandsSection";

export default function HomePage() {

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 mt-4">
      {/* Quality Policy Section */}
      <section
        className="py-8 px-4 sm:px-6 lg:px-8 w-full bg-gray-100"
        id="aboutUsSection"
      >
        <QualityPolicySection />
      </section>

      <section className="mt-8">
        <FeaturesSection />
      </section>

      <section className="mt-8">
        <TrustedBrandsSection/>
      </section>

      <section className="mt-8" id="servicesSection">
        <ServicesSection />
      </section>
      
      {/* Call to Action Button */}
      <div
        className="flex flex-col items-center md:items-end w-full
        sm:min-w-[700px] sm:max-w-[700px]
        md:min-w-[800px] md:max-w-[800px]
        lg:min-w-[860px] lg:max-w-[1280px]
        xl:min-w-[1280px] xl:max-w-[1536px] mx-auto mt-8"
      >
        <Button
          route={"/platform"}
          customClasses="px-4 py-2 bg-primary text-title-active-static rounded-md shadow-md hover:bg-secondary transition duration-300 border-secondary-light font-semibold gradient-button"
          text={"Ingresar a la plataforma"}
          title={"Ingresar a la plataforma"}
        />
      </div>

      {/* System Info and WhatsApp Button */}
      <div className="mt-8">
        <SystemInfo />
        <section className="mt-8 " id="contactUsSection">
          <ContactUsSection />
        </section>
      </div>

      <div className="flex justify-center mt-4">
        <WhatsAppButton message="Hola, quisiera hacer una consulta." />
      </div>
    </div>
  );
}
