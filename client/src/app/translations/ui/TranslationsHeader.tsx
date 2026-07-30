import { FC } from "react";
import { useSettingsContext } from "src/contexts";
import SettingsConfiguration from "../components/SettingsConfiguration";
import NewTranslation from "../components/NewTranslation";
import { useTranslations } from "src/hooks";

const TranslationsHeader: FC = () => {
  const { config } = useSettingsContext();

  const { fetchTranslations } = useTranslations();
  const { data: translations, isLoading: isLoadingTranslations } =
    fetchTranslations();

  return (
    <div className="py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold capitalize text-gray-1">
          Qtrans / {config.name}
        </h1>
        <div className="flex items-center gap-3">
          <NewTranslation />
          <SettingsConfiguration />
        </div>
      </div>
      <p className="text-sm mt-4 ml-2 text-gray-2">
        the translation manager for {config.name}
        {" - "}
        <span className="text-accent">
          {config.languages.length} language
          {config.languages.length > 1 ? "s" : ""}
        </span>{" "}
        configured
        {!isLoadingTranslations &&
          translations &&
          typeof translations === "object" && (
            <>
              {" - "}{" "}
              <span className="text-accent">
                {translations.length ?? 0} translation
                {translations.length > 1 ? "s" : ""}
              </span>{" "}
              created
            </>
          )}
      </p>
    </div>
  );
};

export default TranslationsHeader;
