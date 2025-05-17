"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-4">
    <span className="text-title-active-static text-sm font-semibold">
      Almacenando...
    </span>
    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 spinner-border border-opacity-50 ml-2"></div>
  </div>
);

const FileInput = ({
  label,
  name,
  onChange,
  isSubmitted,
  errorMessage,
  required,
  apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY,
  onUploadSuccess,
  showPreview = true,
  showLink = true,
}) => {
  const [fileName, setFileName] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);

      // Crear una URL de objeto para la vista previa local
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      // Aquí se debe manejar el archivo según tu lógica
      onChange({ target: { name, files: [file] } }); // Asegúrate de pasar el archivo correctamente

      const formData = new FormData();
      formData.append("image", file);

      setIsUploading(true);

      try {
        const response = await fetch(
          `https://api.imgbb.com/1/upload?key=${apiKey}`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();

        if (response.ok && data.success) {
          const url = data.data.url; // URL externa para usar en Image
          setUploadUrl(url);
          setUploadError("");

          if (onUploadSuccess) {
            onUploadSuccess(url);
          }
        } else {
          setUploadError(data.message || "Failed to upload image.");
          setUploadUrl("");
        }
      } catch (error) {
        setUploadError("An error occurred while uploading.");
        setUploadUrl("");
      } finally {
        setIsUploading(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="flex flex-col">
      <label
        htmlFor={name}
        className="flex gap-1 mt-2 mb-2 text-primary font-semibold"
      >
        <span>{label}</span>
        {required && <span className="text-title-active-static">*</span>}
      </label>

      <input
        type="file"
        id={name}
        name={name}
        onChange={handleFileChange}
        className={`w-full rounded-[5px] p-1 h-[35px] text-black focus-visible:outline-none border-2 ${
          isSubmitted && !fileName
            ? "border-red-500"
            : "border-transparent focus:border-primary"
        }`}
        style={{ marginBottom: "2px" }}
      />

      {isUploading && (
        <div className="mt-2">
          <LoadingSpinner />
        </div>
      )}

      {showPreview && previewUrl && !isUploading && (
        <div className="mt-2">
          <Image
            src={previewUrl}
            alt="Vista previa"
            width={250}
            height={250}
            className="border rounded-md"
          />
        </div>
      )}

      {showPreview && showLink && uploadUrl && !isUploading && (
        <div className="mt-2">
          <Link
            href={uploadUrl}
            className="text-title-active-static font-semibold"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ver imagen
          </Link>
        </div>
      )}

      {uploadError && <span className="text-danger mt-2">{uploadError}</span>}

      {isSubmitted && !fileName && (
        <span className="text-danger">{errorMessage}</span>
      )}
    </div>
  );
};

export default FileInput;
