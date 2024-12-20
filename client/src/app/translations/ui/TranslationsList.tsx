import { FC } from "react";
import { ActivityIndicator, SearchInput } from "src/components";
import { useTranslations } from "src/hooks";
import NewTranslation from "../components/NewTranslation";
import TranslationCard from "../components/TranslationCard";

const TranslationsList: FC = () => {
  const { fetchTranslations } = useTranslations();

  const { data: translations, isLoading: isLoadingTranslations } =
    fetchTranslations();

  if (isLoadingTranslations) {
    return (
      <div className="flex justify-center items-center h-96">
        <ActivityIndicator size={16} />
      </div>
    );
  }
  if (!translations || typeof translations !== "object") {
    return (
      <div className="flex justify-center items-center flex-col py-40">
        <p className="text-gray-1 text-3xl py-4">No translations found</p>
        <NewTranslation />
      </div>
    );
  }

  return (
    <div>
      <SearchInput placeholder="search for translations" />
      <div className="flex flex-col gap-4 mt-12">
        {translations?.map((translation) => (
          <TranslationCard key={translation.key} translation={translation} />
        ))}
      </div>
    </div>
  );
};

export default TranslationsList;
