"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Title from "@/components/Title";
import Subtitle from "@/components/Subtitle";

export default function TrustedBrandsSection() {
  const [brandImages, setBrandImages] = useState([]);

  useEffect(() => {
    const checkImages = async () => {
      const loadedImages = [];
      const totalImages = process.env.NEXT_PUBLIC_TRUSTED_BRANDS_QUANTITY;

      for (let i = 1; i <= totalImages; i++) {
        const imageUrl = `${process.env.NEXT_PUBLIC_TRUSTED_BRANDS_FILE_NAME}/brand${i}.png`;

        const response = await fetch(imageUrl, { method: 'HEAD' });

        if (response.ok) {
          loadedImages.push(imageUrl);
        }
      }

      setBrandImages(loadedImages);
    };

    checkImages();
  }, []);

  return (
    <section className="p-4 bg-gray-100">
      <Title
        text="Empresas que ya confiaron en nosotros"
        textPositionClass="text-center"
        textColorClass="text-blue-500"
        customClasses="mb-4"
      />

      <Subtitle
        text="Marcas que avalan nuestra experiencia y compromiso"
        textPositionClass="text-center"
        textColorClass="text-blue-500"
        marginPositionClasses="mt-4 mb-8"
        customClasses="text-lg"
      />
      <div className="flex flex-wrap justify-center gap-6">
        {brandImages.length > 0 ? (
          brandImages.map((image, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-32 h-32 flex items-center justify-center bg-white p-2 rounded-lg shadow-md"
            >
              <Image
                src={image}
                width={100}
                height={100}
                alt={`Marca ${index + 1}`}
                className="object-contain"
              />
            </div>
          ))
        ) : (
          <p className="text-center">No se encontraron imágenes.</p>
        )}
      </div>
    </section>
  );
}
