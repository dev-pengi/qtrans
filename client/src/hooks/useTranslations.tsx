import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createTranslation,
  fetchAllTranslations,
  fetchTranslation,
  deleteTranslation,
  updateTranslation,
} from "src/api/translations";
import { Translation, TranslationValue } from "src/types";

const useTranslations = () => {
  const queryClient = useQueryClient();

  const fetchTranslations = () => {
    return useQuery<Translation[]>({
      queryKey: ["translations"],
      queryFn: () => fetchAllTranslations(),
    });
  };

  const fetchTranslationByKey = (key: string) => {
    return useQuery<Translation>({
      queryKey: ["translations", key],
      queryFn: () => fetchTranslation(key),
      enabled: !!key,
      initialData: undefined,
    });
  };

  const createNewTranslation = () => {
    return useMutation<
      Translation,
      Error,
      {
        key: string;
        translation: TranslationValue;
      }
    >({
      mutationFn: ({
        key,
        translation,
      }: {
        key: string;
        translation: TranslationValue;
      }) => createTranslation(key, translation),
      onSuccess: (data) => {
        queryClient.setQueryData<Translation[]>(["translations"], (old) => [
          ...(old || []),
          data,
        ]);
      },
    });
  };

  const modifyTranslation = () => {
    return useMutation<
      null,
      Error,
      { key: string; updatedTranslation: TranslationValue }
    >({
      mutationFn: async ({ key, updatedTranslation }) => {
        await updateTranslation(key, updatedTranslation);
        return null; // explicitly return null to match the expected type
      },
      onSuccess: (_, { key, updatedTranslation }) => {
        queryClient.setQueryData<Translation[]>(["translations"], (old) =>
          old?.map((translation) =>
            translation.key === key
              ? { ...translation, ...updatedTranslation }
              : translation
          )
        );
        queryClient.setQueryData<Translation>(["translations", key], (old) =>
          old ? { ...old, ...updatedTranslation } : old
        );
      },
    });
  };

  const removeTranslation = () => {
    return useMutation<null, Error, string>({
      mutationFn: (key: string) => deleteTranslation(key),
      onSuccess: (_, key) => {
        queryClient.setQueryData<Translation[]>(["translations"], (old) =>
          old?.filter((translation) => translation.key !== key)
        );
      },
    });
  };

  return {
    fetchTranslations,
    fetchTranslationByKey,
    createNewTranslation,
    modifyTranslation,
    removeTranslation,
  };
};

export default useTranslations;
