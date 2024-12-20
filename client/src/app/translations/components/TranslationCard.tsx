import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC, useMemo } from "react";
import { useSettingsContext } from "src/contexts";
import { Translation } from "src/types";

interface TranslationCardProps {
  translation: Translation;
}

const TranslationCard: FC<TranslationCardProps> = ({ translation }) => {
  const { config } = useSettingsContext();

  console.log(translation);

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
    <div
      key={translation.key}
      className="py-3 px-6 bg-background-light flex items-center justify-between cursor-pointer rounded-md border border-solid shadow-sm border-background-light hover:border-secondary duration-100"
    >
      <div className="flex gap-4">
        <p className="text-gray-1 capitalize flex items-center">
          {`${translation.key.split("_").join(" ")}`}
          {emptyFields && <span className="px-2 ">•</span>}
          <span className="text-sm lowercase text-secondary">
            {emptyFields ? `${emptyFields || 0} languages unassigned` : ""}
          </span>
        </p>
      </div>
      <button className="text-secondary">
        <FontAwesomeIcon icon={faAngleDown} />
      </button>
    </div>
  );
};

export default TranslationCard;
