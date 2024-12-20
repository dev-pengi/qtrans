import { FC } from "react";
import TranslationsHeader from "../ui/TranslationsHeader";
import TranslationsList from "../ui/TranslationsList";

const TranslationsPage: FC = () => {
  return (
    <main className="max-w-[1200px] mx-auto py-4 px-6">
      <TranslationsHeader />
      <TranslationsList />
    </main>
  );
};

export default TranslationsPage;
