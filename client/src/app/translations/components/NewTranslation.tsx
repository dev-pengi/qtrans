import { faPlus, faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";
import { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { generateTranslations } from "src/api";
import { Button, Input, Modal } from "src/components";
import { languagesCodeMap } from "src/constants";
import { useSettingsContext } from "src/contexts";
import { useModalRef, useTranslations } from "src/hooks";

const NewTranslation: FC = () => {
  const translationModal = useModalRef();
  const { config } = useSettingsContext();
  const { languages, defaultLanguage } = config;

  const [isGeneratingTranslations, setIsGeneratingTranslations] =
    useState(false);

  const { createNewTranslation } = useTranslations();

  const resetInputs = () =>
    languages.reduce((acc, lang) => {
      acc[lang] = "";
      return acc;
    }, {} as { [lang: string]: string });

  const [translationKey, setTranslationKey] = useState("");
  const [languagesValues, setLanguagesValues] = useState(resetInputs());

  const updateTranslationKey = (value: string) => {
    const maskedValue = value
      .replace(/[^a-zA-Z0-9\s_]/g, "")
      .replace(/\s+/g, "_")
      .replace(/_+/g, "_")
      .toLowerCase();

    setTranslationKey(maskedValue);
  };

  useEffect(() => {
    setLanguagesValues(resetInputs());
  }, [languages]);

  const generateTranslationsByAi = async () => {
    if (!translationKey)
      return toast.error(
        "Translation key must be provided to auto-generate translations"
      );
    const promptData = {
      key: translationKey,
      languages: languages.map((lang) => lang.toLowerCase()),
    };

    setIsGeneratingTranslations(true);

    try {
      const data = await generateTranslations(promptData);

      setLanguagesValues(
        languages.reduce((acc, lang) => {
          acc[lang] = data[lang];
          return acc;
        }, {} as { [lang: string]: string })
      );

      toast.success("Translations has been generated");
    } catch (error) {
      console.error(error);
      toast.error("Error generating Translation", error);
    }

    setIsGeneratingTranslations(false);
  };

  const newTranslationMutation = createNewTranslation();

  const createTranslation = () => {
    if (!translationKey) return toast.error("Translation key must be provided");
    if (!languagesValues[defaultLanguage])
      return toast.error(
        `Default language (${languagesCodeMap[defaultLanguage].Name}) must be provided`
      );

    newTranslationMutation.mutate(
      {
        key: translationKey,
        translation: languagesValues,
      },
      {
        onSuccess: () => {
          toast.success("Translation has been successfully created");
          translationModal.close();
        },
      }
    );
  };

  return (
    <>
      <Button
        variant={"secondary"}
        icon={faPlus}
        onClick={translationModal.open}
      >
        Add Translation
      </Button>

      <Modal
        disabled={isGeneratingTranslations}
        useActionButtons
        modalRef={translationModal}
        onClose={() => {
          setLanguagesValues(resetInputs());
          setTranslationKey("");
        }}
        submitButton={"Create Translation"}
        onSubmit={createTranslation}
        isLoading={newTranslationMutation.isPending}
      >
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xl">Translations</h2>
          <Button
            onClick={generateTranslationsByAi}
            icon={faWandMagicSparkles}
            variant={"secondary"}
            isLoading={isGeneratingTranslations}
          >
            generate translations
          </Button>
        </div>
        <div className="mt-3">
          <Input
            onChange={(e) => updateTranslationKey(e.target.value)}
            id={"translation-key"}
            value={translationKey}
            onKeyDown={(e) => {
              if (e.key === "Enter") generateTranslationsByAi();
            }}
            placeholder="translation_key"
            autoFocus
          />
          <h4 className="text-[13px] py-2 px-1 text-gray-2">
            <span className="text-accent font-semibold">NOTE: </span> only
            alphanumeric characters are allowed in translation keys. you can
            also use underscores for spacing
          </h4>
        </div>
        <div className="flex flex-col gap-3 mt-5">
          {languages
            .sort((a, b) => {
              const aDefault = config.defaultLanguage === a;
              const bDefault = config.defaultLanguage === b;
              if (aDefault && !bDefault) return -1;
              if (!aDefault && bDefault) return 1;
              return 0;
            })
            .map((language) => (
              <Input
                key={`new-translation-input-${language}`}
                id={`new-translation-input-${language}`}
                value={languagesValues[language]}
                onChange={(e) =>
                  setLanguagesValues((prev) => ({
                    ...prev,
                    [language]: e.target.value,
                  }))
                }
                label={
                  language === defaultLanguage
                    ? `${languagesCodeMap[language].Name} (default)`
                    : languagesCodeMap[language].Name
                }
                placeholder={`${languagesCodeMap[language].Name} Translation`}
              />
            ))}
        </div>
      </Modal>
    </>
  );
};

export default NewTranslation;
