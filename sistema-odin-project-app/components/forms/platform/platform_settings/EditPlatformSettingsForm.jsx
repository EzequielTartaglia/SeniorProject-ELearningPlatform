'use client'

import { useNotification } from "@/contexts/NotificationContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
  
import Input from "@/components/forms/Input";
import PageHeader from "@/components/page_formats/PageHeader";
import SubmitLoadingButton from "../../SubmitLoadingButton";

import { editPlatformSettings, getPlatformSetting } from "@/src/models/platform/platform_setting/platform_setting";

export default function EditPlatformSettingsForm() {
    const [platformSettings, setPlatformSettings] = useState({
        contact_number: ""
      });
      const [isSubmitted, setIsSubmitted] = useState(false);
      const [isLoading, setIsLoading] = useState(false);
    
      const router = useRouter();
      const { showNotification } = useNotification();
    
      useEffect(() => {
        const fetchPlatformSettings = async () => {
          try {
            const fetchedPlatformSettings = await getPlatformSetting(1);
            setPlatformSettings(fetchedPlatformSettings);
          } catch (error) {
            console.error("Error fetching the platform settings:", error.message);
          }
        };
        fetchPlatformSettings();
      }, []);
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitted(true);
    
        if (!platformSettings.contact_number) {
          return;
        }
    
        setIsLoading(true);
    
        try {
          await editPlatformSettings(
            platformSettings.contact_number,
            1
          );
    
          showNotification("¡Ajustes editados exitosamente!", "success");
    
          setTimeout(() => {
            setIsLoading(false);
            router.push(`/platform/platform_settings`);
          }, 2000);
        } catch (error) {
          console.error("Error editing platform settings:", error.message);
          setIsLoading(false);
        }
      };
    
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPlatformSettings({ ...platformSettings, [name]: value });
      };
    
      return (
        <>
          <PageHeader
            title="Editar ajustes"
            goBackRoute="/platform/platform_settings"
            goBackText="Volver a ajustes"
          />
    
          <form onSubmit={handleSubmit} className="box-theme">
            <Input
              label="Número de contacto (WhatsApp)"
              name="contact_number"
              value={platformSettings.contact_number}
              required={true}
              placeholder=""
              onChange={handleInputChange}
              isSubmitted={isSubmitted}
              errorMessage="Campo obligatorio"
            />
        
            <SubmitLoadingButton isLoading={isLoading} type="submit">
              Editar ajustes
            </SubmitLoadingButton>
          </form>
        </>
      );
    }
    
