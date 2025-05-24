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
    <div className="mx-auto">
      {/* Quality Policy Section */}
      <section
        className="relative py-8 w-full bg-gray-100"
        id="aboutUsSection"
        style={{
          backgroundImage: "url('/background-body.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-200 z-0"></div>
        <div className="absolute inset-x-0 bottom-0 h-24 bg-white transform -translate-y-4/2 rounded-t-full "></div>
        <div className="relative ">
          <QualityPolicySection />
        </div>
      </section>

      <section className="bg-white">
        <FeaturesSection />
      </section>

      {/* Trusted Brands Section */}
      <section className="relative">
        <TrustedBrandsSection />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-white transform translate-y-[90px] rounded-b-full"></div>
      </section>

      <section className="mt-20" id="servicesSection">
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
          customClasses="px-4 py-2 bg-primary text-title-active-static rounded-md shadow-md hover:bg-secondary transition duration-300 border-secondary-light font-semibold bg-dark-mode"
          text={"Ingresar al campus virtual"}
          title={"Ingresar al campus virtual"}
        />
      </div>

      {/* System Info and WhatsApp Button */}
      <div className="mt-8">
        <SystemInfo />
        <section className="bg-white sm:p-2 md:p-8" id="contactUsSection">
          <ContactUsSection />
        </section>
      </div>

      <div className="flex justify-center">
        <WhatsAppButton message="Hola, quisiera hacer una consulta." />
      </div>
    </div>
  );
}
