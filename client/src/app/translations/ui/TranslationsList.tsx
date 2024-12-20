import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC } from "react";
import { ActivityIndicator } from "src/components";
import { useTranslations } from "src/hooks";

const TranslationsList: FC = () => {
  const { fetchTranslations } = useTranslations();

  const { data: translations, isLoading: isLoadingTranslations } =
    fetchTranslations();

  if (isLoadingTranslations) {
    return (
      <div className="flex justify-center items-center h-96">
        <ActivityIndicator size={16}/>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-4">
        {translations?.map((translation) => (
          <div
            key={translation.key}
            className="py-3 px-6 bg-background-light flex items-center justify-between cursor-pointer rounded-md border border-solid shadow-sm border-background-light hover:border-secondary duration-100"
          >
            <div className="flex gap-4">
              <p className="text-gray-1 capitalize">
                {translation.key.split("_").join(" ")}
              </p>
            </div>
            <button className="text-secondary">
              <FontAwesomeIcon icon={faAngleDown} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TranslationsList;
