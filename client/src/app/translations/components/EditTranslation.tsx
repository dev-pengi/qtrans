import { faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";
import { FC, ReactNode, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { generateTranslations } from "src/api";
import { Button, Input, Modal } from "src/components";
import { languagesCodeMap } from "src/constants";
import { useSettingsContext } from "src/contexts";
import { useModalRef, useTranslations } from "src/hooks";
import { Language, Prompt, Translation } from "src/types";

interface EditTranslationProps {
  translation: Translation;
  children?: ReactNode;
}

const EditTranslation: FC<EditTranslationProps> = ({
  translation,
  children,
}) => {
  const translationModal = useModalRef();
  const { config } = useSettingsContext();
  const { languages, defaultLanguage } = config;

  const [isGeneratingTranslations, setIsGeneratingTranslations] =
    useState(false);
  const { modifyTranslation } = useTranslations();

  const resetInputs = () =>
    languages.reduce((acc, lang) => {
      acc[lang] = translation.value[lang] || "";
      return acc;
    }, {} as { [lang: string]: string });

  const [languagesValues, setLanguagesValues] = useState(resetInputs());
  const [translationKey, setTranslationKey] = useState(translation.key);

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
  }, [languages, translation]);

  const generateTranslationsByAi = async () => {
    if (!translationKey)
      return toast.error(
        "Translation key must be provided to auto-generate translations"
      );

    const promptData: Prompt = {
      key: translationKey,
      languages: languages.map(
        (lang) =>
          `${lang.toLowerCase()}-${
            languagesCodeMap[lang].Name
          }` as `${Language}-${string}`
      ),
    };

    if (languagesValues[defaultLanguage]) {
      promptData.providedValues = {
        [defaultLanguage]: languagesValues[defaultLanguage],
      };
    }

    setIsGeneratingTranslations(true);

    try {
      const data = await generateTranslations(promptData);

      setLanguagesValues(
        languages.reduce((acc, lang) => {
          acc[lang] = data[lang];
          return acc;
        }, {} as { [lang: string]: string })
      );

      toast.success("Translations have been generated");
    } catch (error) {
      console.error(error);
      toast.error("Error generating Translation", error);
    }

    setIsGeneratingTranslations(false);
  };

  const updateTranslationMutation = modifyTranslation();
  const saveTranslation = () => {
    if (!translationKey) return toast.error("Translation key must be provided");
    if (!languagesValues[defaultLanguage])
      return toast.error(
        `Default language (${languagesCodeMap[defaultLanguage].Name}) must be provided`
      );

    updateTranslationMutation.mutate(
      {
        key: translation.key,
        updatedTranslation: languagesValues,
      },
      {
        onSuccess: () => {
          toast.success("Translation has been successfully updated");
          translationModal.close();
        },
      }
    );
  };
  return (
    <>
      {children && <div onClick={translationModal.open}>{children}</div>}

      <Modal
        disabled={isGeneratingTranslations}
        useActionButtons
        modalRef={translationModal}
        onClose={() => {
          setLanguagesValues(resetInputs());
        }}
        submitButton={"Save Translation"}
        onSubmit={saveTranslation}
        isLoading={updateTranslationMutation.isPending}
      >
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xl">Edit Translations</h2>
          <Button
            onClick={generateTranslationsByAi}
            icon={faWandMagicSparkles}
            variant={"secondary"}
            isLoading={isGeneratingTranslations}
          >
            Generate Translations
          </Button>
        </div>
        <div className="mt-3">
          <Input
            onChange={(e) => updateTranslationKey(e.target.value)}
            id={"translation-key"}
            value={translationKey}
            placeholder="translation_key"
            disabled
          />
          <h4 className="text-[13px] py-2 px-1 text-gray-2">
            <span className="text-accent font-semibold">NOTE: </span> Editing
            the translation key is not allowed.
          </h4>
        </div>
        <div className="flex flex-col gap-3 mt-5">
          {languages
            .sort((a, b) => {
              const aDefault = defaultLanguage === a;
              const bDefault = defaultLanguage === b;
              if (aDefault && !bDefault) return -1;
              if (!aDefault && bDefault) return 1;
              return 0;
            })
            .map((language) => (
              <Input
                key={`edit-translation-input-${language}`}
                id={`edit-translation-input-${language}`}
                value={languagesValues[language]}
                autoFocus={language === defaultLanguage}
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

export default EditTranslation;
