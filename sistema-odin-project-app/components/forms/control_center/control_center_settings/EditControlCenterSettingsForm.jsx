'use client'

import { useNotification } from "@/contexts/NotificationContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
  
import Input from "@/components/forms/Input";
import PageHeader from "@/components/page_formats/PageHeader";
import SubmitLoadingButton from "@/components/forms/SubmitLoadingButton";

import { editControlCenterSettings, getControlCenterSetting } from "@/src/controllers/control_center/control_center_setting/control_center_setting";

export default function EditControlCenterSettingsForm() {
    const [settings, setSettings] = useState({
        contact_number: ""
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
  
    const router = useRouter();
    const { showNotification } = useNotification();
  
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const fetchedSettings = await getControlCenterSetting(1);
                setSettings(fetchedSettings);
            } catch (error) {
                console.error("Error fetching the control center settings:", error.message);
            }
        };
        fetchSettings();
    }, []);
  
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitted(true);
    
        if (!settings.contact_number.trim()) {
            return;
        }
    
        setIsLoading(true);
    
        try {
            await editControlCenterSettings(
                settings.contact_number,
                1
            );
    
            showNotification("¡Ajustes editados exitosamente!", "success");
    
            setTimeout(() => {
                setIsLoading(false);
                router.push(`/control_center/control_center_settings`);
            }, 2000);
        } catch (error) {
            console.error("Error editing control center settings:", error.message);
            setIsLoading(false);
        }
    };
  
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSettings({ ...settings, [name]: value });
    };
  
    return (
        <>
            <PageHeader
                title="Editar ajustes"
                goBackRoute="/control_center/control_center_settings"
                goBackText="Volver a ajustes"
            />
  
            <form onSubmit={handleSubmit} className="box-theme">
                <Input
                    label="Número de contacto (WhatsApp)"
                    name="contact_number"
                    type="number"
                    value={settings.contact_number}
                    required={true}
                    placeholder=""
                    onChange={handleInputChange}
                    isSubmitted={isSubmitted}
                    errorMessage={settings.contact_number.trim() === "" && isSubmitted ? "Campo obligatorio" : ""}
                />
            
                <SubmitLoadingButton isLoading={isLoading} type="submit">
                    Editar ajustes
                </SubmitLoadingButton>
            </form>
        </>
    );
}
