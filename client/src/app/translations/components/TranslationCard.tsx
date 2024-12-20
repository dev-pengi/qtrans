import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC, useMemo } from "react";
import { useSettingsContext } from "src/contexts";
import { Translation } from "src/types";
import EditTranslation from "./EditTranslation";
import { languagesCodeMap } from "src/constants";

interface TranslationCardProps {
  translation: Translation;
}

const TranslationCard: FC<TranslationCardProps> = ({ translation }) => {
  const { config } = useSettingsContext();

  console.log(translation);
  const { defaultLanguage } = config;

  const emptyFields = useMemo(() => {
    const translationValue = translation.value;

    const { languages } = config;

    let emptyLanguageCount = 0;

    for (const language of languages) {
      const languageFields = translationValue[language];
      if (
        !languageFields ||
        Object.values(languageFields).every((field) => !field)
      ) {
        emptyLanguageCount += 1;
      }
    }

    return emptyLanguageCount || null;
  }, [translation.value, config.languages]);

  return (
    <EditTranslation translation={translation}>
      <div
        key={translation.key}
        className="py-2 px-6 bg-background-light flex items-center justify-between cursor-pointer rounded-md border-2 border-solid shadow-sm border-background-light hover:border-secondary duration-50"
      >
        <div className="gap-4 flex-1">
          <p className="text-gray-1 capitalize flex text-[15px] items-center">
            {`${translation.key.split("_").join(" ")}`}
            {emptyFields && <span className="px-2 ">•</span>}
            <span className="text-sm lowercase text-secondary">
              {emptyFields ? `${emptyFields || 0} languages unassigned` : ""}
            </span>
          </p>
          <p className="text-[12px] text-gray-3 line-clamp-1 max-w-[80%]">
            <span className="text-secondary font-bold">
              {languagesCodeMap[defaultLanguage].Name}
            </span>
            :{" "}
            <span className="font-medium">
              {translation.value[defaultLanguage]}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-white hover:text-accent px-1">
            <FontAwesomeIcon icon={faPen} />
          </button>
          <button
            className="text-white hover:text-danger px-1"
            onClick={(e) => e.stopPropagation()}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>
    </EditTranslation>
  );
};

export default TranslationCard;
