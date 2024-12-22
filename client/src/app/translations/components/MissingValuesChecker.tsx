import {
  faInfoCircle,
  faWandMagicSparkles,
  faWarning,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQueryClient } from "@tanstack/react-query";
import { FC, useState } from "react";
import toast from "react-hot-toast";
import { generateTranslations, updateTranslation } from "src/api";
import { ActivityIndicator, Button, Modal } from "src/components";
import { languagesCodeMap } from "src/constants";
import { useSettingsContext } from "src/contexts";
import { useModalRef } from "src/hooks";
import { Language, Translation, TranslationValue } from "src/types";

interface MissingValuesCheckerProps {
  translationStats: {
    unassignedLanguages: Translation[];
    unassignedDefault: Translation[];
  };
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const MissingValuesChecker: FC<MissingValuesCheckerProps> = ({
  translationStats,
}) => {
  const queryClient = useQueryClient();
  const { config } = useSettingsContext();
  const AutoAssignerModal = useModalRef();

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const autoGenerateMissingValues = async () => {
    setIsGenerating(true);
    setTotalCount(translationStats.unassignedLanguages.length);
    for (const translation of translationStats.unassignedLanguages) {
      const promptData: {
        key: string;
        languages: `${Language}-${string}`[];
        providedValues?: TranslationValue;
      } = {
        key: translation.key,
        languages: config.languages.map(
          (lang) =>
            `${lang.toLowerCase()}-${
              languagesCodeMap[lang].Name
            }` as `${Language}-${string}`
        ),
      };

      const validProvidedValues = Object.entries(translation.value)
        .filter(([_, value]) => value.trim() !== "")
        .reduce((acc, [lang, value]) => {
          acc[lang] = value;
          return acc;
        }, {} as TranslationValue);

      if (Object.keys(validProvidedValues).length > 0) {
        promptData.providedValues = validProvidedValues;
      }

      try {
        if (errorCount <= 10) sleep(300);
        else if (errorCount > 10) sleep(1100);
        const data = await generateTranslations(promptData);

        const newTranslation = await updateTranslation(translation.key, data);

        queryClient.setQueryData<Translation[]>(["translations"], (old) =>
          old?.map((oldTranslation) =>
            oldTranslation.key === translation.key
              ? newTranslation
              : oldTranslation
          )
        );
        queryClient.setQueryData<Translation>(
          ["translations", translation.key],
          newTranslation
        );
        setGenerationProgress((prev) => (prev += 1));
      } catch (error) {
        setErrorCount((prev) => (prev += 1));
      }
    }
    toast.success(
      `generated missing values for ${generationProgress} translation`
    );
    setGenerationProgress(0);
    setErrorCount(0);
    setIsGenerating(false);
    AutoAssignerModal.close();
  };

  return (
    <>
      <div className="pb-6 pl-2">
        {(translationStats.unassignedLanguages.length > 0 ||
          translationStats.unassignedDefault.length > 0) && (
          <>
            <div className="py-1.5 text-[15px] pl-2 text-gray-2 flex items-center gap-3">
              {translationStats.unassignedLanguages.length > 0 && (
                <p className=" flex items-center">
                  <FontAwesomeIcon
                    className="text-accent"
                    icon={faInfoCircle}
                  />
                  <span className="ml-2">
                    {translationStats.unassignedLanguages.length} some
                    translations have empty values
                  </span>
                </p>
              )}

              {translationStats.unassignedDefault.length > 0 && (
                <>
                  -
                  <p className="py-1.5 text-danger/90 flex items-center underline underline-offset-2">
                    <FontAwesomeIcon icon={faWarning} />
                    <span className="ml-2">
                      {translationStats.unassignedDefault.length} translation
                      missing default language
                    </span>
                  </p>
                </>
              )}
            </div>

            <Button
              icon={faWandMagicSparkles}
              onClick={AutoAssignerModal.open}
              variant={"secondary"}
            >
              Auto Generate missing values
            </Button>
          </>
        )}
      </div>

      <Modal
        modalRef={AutoAssignerModal}
        useActionButtons
        submitButton="Generate"
        onSubmit={autoGenerateMissingValues}
        isLoading={isGenerating}
        disabled={!Boolean(config.llm_config)}
      >
        {translationStats.unassignedLanguages.length > 0 && !isGenerating && (
          <div className="text-[15px] text-gray-1">
            <h3>
              Press <span className="text-accent">Generate</span> to start
              updating{" "}
              <span className="text-accent underline">
                {translationStats.unassignedLanguages.length} translation
              </span>
            </h3>

            <ul className="list-disc text-gray-2 dark:text-gray-5 ml-7 mt-2 text-[15px]">
              <li>
                Detects all the translations with missing/empty values and
                automatically fill them using LLM generated translations
              </li>
              <li>
                This operation is full automatic but might take few seconds and
                even minutes depending on the missing values count
              </li>
              <li>
                the already existing translations will not be affected, and
                could be used to provide additional context for the Modal for
                better results
              </li>
              <li>
                between each generation there will be a waiting time of 1 second
                to avoid rate limitings
              </li>
            </ul>
            {config.llm_config ? (
              <h4 className="text-[13px] py-2 px-1 text-gray-2">
                <span className="text-orange-400 font-semibold">NOTE: </span>{" "}
                Once the process start, it cannot be canceled
              </h4>
            ) : (
              <h4 className="text-[13px] py-2 px-1 text-gray-2">
                <span className="text-danger font-semibold">ERROR: </span>{" "}
                couldn't detect "llm_config" property in the qtrans config file,
                this property is required for this action
              </h4>
            )}
          </div>
        )}

        {isGenerating && (
          <div>
            <p className="text-gray-1 flex items-center">
              <ActivityIndicator size={9} />
              <span className="ml-2">Generating Translations</span>
            </p>
            <div className="mt-3">
              <p className="ml-1 text-gray-1">
                {generationProgress}
                {"/"}
                {totalCount} Done
                {errorCount > 0 && `, ${errorCount} error`}
              </p>
              <div className="mt-3 relative w-full bg-white/10 h-3 rounded-xl overflow-hidden">
                <div
                  className="absolute left-0 h-full bg-accent w-full"
                  style={{
                    transformOrigin: "0",
                    transform: `scaleX(${generationProgress / totalCount})`,
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default MissingValuesChecker;
