import { FC } from "react";
import { useSettingsContext } from "src/contexts";

const TranslationsHeader: FC = () => {
  const { config } = useSettingsContext();
  return (
    <div className="mt-12">
      <h1 className="text-3xl font-semibold capitalize text-gray-1">
        Qtrans / {config.name}
      </h1>
      <p className="text-sm mt-4 text-gray-2">
        the translation manager for{" "}
        <span className="text-accent">{config.name}</span>
      </p>
    </div>
  );
};

export default TranslationsHeader;
