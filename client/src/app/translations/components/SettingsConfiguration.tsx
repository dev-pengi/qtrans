import { faGears } from "@fortawesome/free-solid-svg-icons";
import { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { configureLanguages } from "src/api";
import { Button, Modal, MultiSelect, SelectMenu } from "src/components";
import { languagesCodeMap } from "src/constants";
import { useSettingsContext } from "src/contexts";
import { useModalRef } from "src/hooks";
import { AvailableProviders, Language } from "src/types";
import { fetchProviders } from "src/api";

const SettingsConfiguration: FC = () => {
  const configurationsModal = useModalRef();

  const { config, setConfig } = useSettingsContext();

  const [defaultLanguage, setDefaultLanguage] = useState(
    config.defaultLanguage
  );
  const [selectedLanguages, setSelectedLanguages] = useState(config.languages);

  const [isSaving, setIsSaving] = useState(false);

  const reset = () => {
    setDefaultLanguage(config.defaultLanguage);
    setSelectedLanguages(config.languages);
  };

  const [providers, setProviders] = useState<AvailableProviders | null>(null);
  const [selectedProvider, setSelectedProvider] = useState("gemini");

  useEffect(() => {
  const loadProviders = async () => {
    try {
      const data = await fetchProviders();
      setProviders(data);
      //console.log(data)
      console.log(selectedProvider)
    } catch (error) {
      toast.error("Failed to load AI providers");
    }
  };

  loadProviders();
}, [selectedProvider]);


  const handleSave= async () => {
    setIsSaving(true);
    try {
      const data = {
        languages: selectedLanguages,
        defaultLanguage,
      };
      await configureLanguages(data);

      setConfig((prev) => ({ ...prev, ...data }));
      configurationsModal.close();
      toast.success("Languages Config has been updated");
    } catch (error) {
      toast.error("Error while saving translation", error);
      console.error(error);
    }
    setIsSaving(false);
  };

  return (
    <>
      <Button
        icon={faGears}
        onClick={configurationsModal.open}
        variant={"primary"}
      >
        Settings Configurations
      </Button>

      <Modal
        modalRef={configurationsModal}
        useActionButtons
        onClose={reset}
        onSubmit={handleSave}
        isLoading={isSaving}
      >
        <p className="text-gray-2 text-[15px]">
          Global Configurations for {config.name}
        </p>
        <div className="mt-3 flex flex-col gap-3">
          {selectedLanguages.length > 0 && (
            <SelectMenu
              label="Default Language"
              options={Object.entries(languagesCodeMap)
                .sort((a, b) => {
                  const aDefault = config.defaultLanguage === a[0];
                  const bDefault = config.defaultLanguage === b[0];
                  if (aDefault && !bDefault) return -1;
                  if (!aDefault && bDefault) return 1;
                  return 0;
                })
                .filter((lang) => {
                  return selectedLanguages.includes(lang[0] as Language);
                })
                .map((lang) => ({
                  value: lang[0],
                  label: lang[1].Name,
                  default: lang[0] === "en",
                }))}
              onSelect={(value) =>
                setDefaultLanguage(value.value as typeof defaultLanguage)
              }
              activeOption={
                selectedLanguages.includes(defaultLanguage)
                  ? defaultLanguage
                  : selectedLanguages[0]
              }
            />
          )}
          <MultiSelect
            label="Languages"
            options={Object.entries(languagesCodeMap)
              .sort((a, b) => {
                const aIncluded = selectedLanguages.includes(a[0] as Language);
                const bIncluded = selectedLanguages.includes(b[0] as Language);

                if (aIncluded && !bIncluded) return -1;
                if (!aIncluded && bIncluded) return 1;

                if (!aIncluded && !bIncluded) {
                  return a[1].Name.localeCompare(b[1].Name);
                }

                return 0;
              })
              .map((lang) => ({
                value: lang[0],
                label: lang[1].Name,
                default: lang[0] === "en",
              }))}
            activeOptions={selectedLanguages}
            onSelect={(selectedLanguages) =>
              setSelectedLanguages(
                selectedLanguages.map((lang) => lang.value as Language)
              )
            }
          >
            {selectedLanguages.length} Language Selected
          </MultiSelect>
         <SelectMenu
              label="AI Provider"
              options={
                providers
                  ? Object.entries(providers).map(([key, provider]) => ({
                      value: key,
                      label:  `${provider.name} - ${provider.model}`,
                    }))
                  : []
              }
              activeOption={selectedProvider}
              onSelect={(option) => setSelectedProvider(option.value)}
            />
        </div>
      </Modal>
    </>
  );
};

export default SettingsConfiguration;
