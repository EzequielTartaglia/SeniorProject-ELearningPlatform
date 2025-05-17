'use client'

import { FiArrowLeft } from "react-icons/fi";
import GoBackButton from "@/components/GoBackButton";
import Title from "@/components/Title";
import Subtitle from "@/components/Subtitle";

export default function PageHeader({
  title,
  subtitle,
  goBackRoute,
  goBackText,
}) {
  return (
    <>
      <Title text={title} />
      <Subtitle text={subtitle} />

      <div className="w-full max-w-lg flex text-left justify-start lg:mr-[500px] font-semibold">
        {goBackRoute && (
          <GoBackButton
            route={goBackRoute}
            customClasses="md:mb-0"
            text={goBackText}
            icon={<FiArrowLeft className="mr-2" size={24}/>}
          />
        )}
      </div>
    </>
  );
}