import { FC } from "react";
import { useSettingsContext } from "src/contexts";
import SettingsConfiguration from "../components/SettingsConfiguration";
import NewTranslation from "../components/NewTranslation";

const TranslationsHeader: FC = () => {
  const { config } = useSettingsContext();
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
        the translation manager for {config.name} -{" "}
        <span className="text-accent">{config.languages.length} language</span>
        {config.languages.length > 1 ? "s" : ""} configured
      </p>
    </div>
  );
};

export default TranslationsHeader;
