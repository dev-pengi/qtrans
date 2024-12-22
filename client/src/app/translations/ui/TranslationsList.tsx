import { FC, useState, useEffect, useMemo } from "react";
import { ActivityIndicator, SearchInput } from "src/components";
import { useTranslations } from "src/hooks";
import NewTranslation from "../components/NewTranslation";
import TranslationCard from "../components/TranslationCard";
import { useSettingsContext } from "src/contexts";
import Fuse from "fuse.js";
import { Translation } from "src/types";
import MissingValuesChecker from "../components/MissingValuesChecker";

const TranslationsList: FC = () => {
  const { setSearchKeyword, config } = useSettingsContext();
  const { fetchTranslations } = useTranslations();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTranslations, setFilteredTranslations] = useState<
    Translation[]
  >([]);

  const { data: translations, isLoading: isLoadingTranslations } =
    fetchTranslations();

  const { languages, defaultLanguage } = config;

  useEffect(() => {
    if (translations) {
      const fuse = new Fuse(translations, {
        keys: ["key", ...languages.map((lang) => `value.${lang}`)],
      });

      const results = searchTerm
        ? fuse.search(searchTerm).map((result) => result.item)
        : translations;

      setFilteredTranslations(results);
    }
  }, [translations, searchTerm, languages]);

  const translationStats = useMemo(() => {
    if (!translations || !Array.isArray(translations)) return null;

    let unassignedLanguagesCount = 0;
    let unassignedDefaultCount = 0;

    const unassignedLanguages: Translation[] = [];
    const unassignedDefault: Translation[] = [];

    for (const translation of translations) {
      let hasUnassignedLanguage = false;

      for (const language of languages) {
        const languageFields = translation.value[language];
        if (
          !languageFields ||
          Object.values(languageFields).every((field) => !field)
        ) {
          hasUnassignedLanguage = true;
          break;
        }
      }

      if (hasUnassignedLanguage) {
        unassignedLanguagesCount++;
        unassignedLanguages.push(translation);
      }

      if (!translation.value[defaultLanguage]) {
        unassignedDefaultCount++;
        unassignedDefault.push(translation);
      }
    }

    return {
      unassignedLanguages,
      unassignedDefault,
    };
  }, [translations, languages, defaultLanguage]);

  if (isLoadingTranslations) {
    return (
      <div className="flex justify-center items-center h-96">
        <ActivityIndicator size={16} />
      </div>
    );
  }

  if (
    !translations ||
    typeof translations !== "object" ||
    !translations.length
  ) {
    return (
      <div className="flex justify-center items-center flex-col py-40">
        <p className="text-gray-1 text-3xl py-4">No translations found</p>
        <NewTranslation />
      </div>
    );
  }

  return (
    <div>
      {translationStats && (
        <MissingValuesChecker translationStats={translationStats} />
      )}
      <SearchInput
        placeholder="search for translations"
        handleType={(value) => {
          setSearchKeyword(value);
          setSearchTerm(value);
        }}
      />
      {filteredTranslations && filteredTranslations.length > 0 ? (
        <div className="flex flex-col gap-4 mt-6">
          {filteredTranslations?.map((translation) => (
            <TranslationCard key={translation.key} translation={translation} />
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center flex-col py-40">
          <p className="text-gray-1 text-3xl py-4">
            No translations found with this search keyword
          </p>
        </div>
      )}
    </div>
  );
};

export default TranslationsList;
