import { FC, ReactNode } from "react";
import toast from "react-hot-toast";
import { Modal } from "src/components";
import { useModalRef, useTranslations } from "src/hooks";
import { Translation } from "src/types";

interface RemoveTranslationProps {
  children: ReactNode;
  translation: Translation;
}

const RemoveTranslation: FC<RemoveTranslationProps> = ({
  children,
  translation,
}) => {
  const deleteModal = useModalRef();

  const { removeTranslation } = useTranslations();

  const deleteTranslationMutation = removeTranslation();

  const handleDeleteTranslation = () => {
    deleteTranslationMutation.mutate(translation.key, {
      onSuccess: () =>
        toast.success("Translation has been successfully deleted"),
    });
  };

  return (
    <>
      <div
        onClick={(e) => {
          e.stopPropagation();
          deleteModal.open();
        }}
      >
        {children}
      </div>

      <Modal
        modalRef={deleteModal}
        useActionButtons
        isDangerous
        isLoading={deleteTranslationMutation.isPending}
        submitButton="Delete Translation"
        onSubmit={handleDeleteTranslation}
      >
        <p className="text-[15px]">
          Are you sure you want to remove this translation? ({translation.key})
        </p>
        <h4 className="text-[13px] py-2 px-1 text-gray-2">
          <span className="text-danger font-semibold">WARNING: </span> all of
          the translations set for this key will be removed
        </h4>
      </Modal>
    </>
  );
};

export default RemoveTranslation;
