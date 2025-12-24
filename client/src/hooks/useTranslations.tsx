import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createTranslation,
  fetchAllTranslations,
  fetchTranslation,
  deleteTranslation,
  updateTranslation,
  renameTranslationKey,
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
      Translation,
      Error,
      { key: string; updatedTranslation: TranslationValue }
    >({
      mutationFn: async ({ key, updatedTranslation }) => {
        const updated = await updateTranslation(key, updatedTranslation);
        return updated; // return the updated translation
      },
      onSuccess: (data, { key }) => {
        queryClient.setQueryData<Translation[]>(["translations"], (old) =>
          old?.map((translation) =>
            translation.key === key ? data : translation
          )
        );
        queryClient.setQueryData<Translation>(["translations", key], data);
      },
    });
  };

  const modifyTranslationKey = () => {
    return useMutation<void, Error, { key: string; newKey: string }>({
      mutationFn: async ({ key, newKey }) => {
        const updated = await renameTranslationKey(key, newKey);
        return updated; // return the updated translation
      },
      onSuccess: (_, { key, newKey }) => {
        queryClient.setQueryData<Translation[]>(["translations"], (old) =>
          old?.map((translation) =>
            translation.key === key
              ? { ...translation, key: newKey }
              : translation
          )
        );
        queryClient.setQueryData<Translation>(["translations", key], (old) => {
          if (old) {
            return { ...old, key: newKey };
          }
          return old;
        });
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
    modifyTranslationKey,
    removeTranslation,
  };
};

export default useTranslations;
