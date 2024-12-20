import { FC } from "react";
import { useSettingsContext } from "src/contexts";

const TranslationsHeader: FC = () => {
  const { config } = useSettingsContext();
  return (
    <div className="py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold capitalize text-gray-1">
          Qtrans / {config.name}
        </h1>
        <button className="text-accent px-3 py-1.5 text-sm hover:text-white hover:bg-accent/50 duration-100 rounded">
          Add Language
        </button>
      </div>
      <p className="text-sm mt-4 ml-2 text-gray-2">
        the translation manager for {config.name} -{" "}
        <span className="text-accent">{config.languages.length} language</span>
        {config.languages.length > 1 ? "s" : ""} available configured
      </p>
    </div>
  );
};

export default TranslationsHeader;
