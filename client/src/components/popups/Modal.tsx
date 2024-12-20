import { FC, ReactNode, useEffect, useState, useRef, useMemo } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import ReactDOM from "react-dom";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { ActivityIndicator, IconButton } from "src/components";
import { ModalRef } from "src/hooks";
import clsx from "clsx";

interface ModalProps {
  children: ReactNode;
  modalRef: ModalRef;
  style?: {
    overlay?: React.CSSProperties;
    box?: React.CSSProperties;
    content?: React.CSSProperties;
  };
  onSubmit?: () => void;
  onClose?: () => void;
  onCancel?: () => void;
  title?: string;
  isLoading?: boolean;
  useHeaders?: boolean;
  useActionButtons?: boolean;
  submitButton?: string;
  secondaryButton?: string;
  isSecondaryDanger?: boolean;
  isDangerous?: boolean;
  closeOnEsc?: boolean;
  submitOnEnter?: boolean;
  disabled?: boolean;
}

const Modal: FC<ModalProps> = ({
  modalRef,
  title,
  children,
  style,
  onSubmit,
  onClose,
  onCancel,
  useHeaders = true,
  isLoading,
  useActionButtons,
  submitButton = "confirm",
  secondaryButton,
  isSecondaryDanger,
  isDangerous,
  closeOnEsc = true,
  submitOnEnter = true,
  disabled = false,
}) => {
  const [hasOverflow, setHasOverflow] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);

  const [isAnimatingExit, setIsAnimatingExit] = useState(false);

  const rootElement = useMemo(() => {
    if (typeof document === "undefined") return null;
    const root = document.getElementById("root");
    return root;
  }, []);

  const handleClose = () => {
    if (isLoading || !modalRef.isOpen) return;

    setIsAnimatingExit(true);
    setTimeout(() => {
      setIsAnimatingExit(false);
      modalRef.close();
      onClose && onClose();
    }, 100);
  };
  const handleCancel = () => {
    if (isLoading || !modalRef.isOpen) return;

    setIsAnimatingExit(true);
    setTimeout(() => {
      setIsAnimatingExit(false);
      modalRef.close();
      onCancel ? onCancel() : onClose && onClose();
    }, 100);
  };

  useHotkeys("esc", () => {
    closeOnEsc && modalRef.isOpen && handleClose();
  });

  useHotkeys("enter", () => {
    submitOnEnter && modalRef.isOpen && onSubmit && onSubmit();
  });

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      if (contentRef.current) {
        setHasOverflow(
          contentRef.current.scrollHeight > contentRef.current.clientHeight
        );
      }
    });

    if (contentRef.current) {
      observer.observe(contentRef.current);
    }

    return () => {
      if (contentRef.current) {
        observer.unobserve(contentRef.current);
      }
    };
  }, [children, modalRef]);

  if (!rootElement) {
    return null;
  }

  return ReactDOM.createPortal(
    <>
      {modalRef.isOpen && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
          className="overlay-fade"
          style={{
            ...ModalStyles.overlay,
            ...style?.overlay,
            opacity: isAnimatingExit ? 0 : 1,
            transition: "0.1s",
            pointerEvents: isAnimatingExit ? "none" : "auto",
          }}
        />
      )}
      {modalRef.isOpen && (
        <div
          aria-modal
          role="dialog"
          className={`modal-pop bg-background ${
            isLoading ? "pointer-events-none" : ""
          }`}
          style={{
            ...ModalStyles.box,
            ...style?.box,
            opacity: isAnimatingExit ? 0 : 1,
            transform: `scale(${isAnimatingExit ? 0.5 : 1})`,
            transition: "0.1s",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {useHeaders && (
            <>
              <div className="py-2 px-2 flex items-center justify-between">
                <div>
                  {title && <h3 className="text-lg font-semibold">{title}</h3>}
                </div>
                <IconButton onClick={handleClose} icon={faClose} />
              </div>
              <div className="h-[1px] w-full bg-white/10" />
            </>
          )}
          <div className="py-2 px-2">
            <div
              ref={contentRef}
              className="w-full px-1 py-2 min-scrollbar"
              style={{ ...ModalStyles.content, ...style?.content }}
            >
              <div>{children}</div>
            </div>
          </div>
          {useActionButtons && (
            <div
              className="py-2 px-3 !border-white/25 "
              style={{
                borderTop: hasOverflow ? "1px solid" : "none",
              }}
            >
              <div
                className={`flex flex-row-reverse ${
                  isLoading ? "gap-0" : "gap-2"
                }`}
              >
                <button
                  onClick={onSubmit}
                  disabled={isLoading || disabled}
                  className={clsx(
                    "py-2 text-sm rounded flex-1 duration-100 capitalize",
                    isDangerous
                      ? "bg-danger/10 border-danger text-danger border-solid border hover:bg-danger/90 hover:text-white"
                      : "bg-accent/10 border-accent text-accent border-solid border",
                    disabled
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-accent/90 hover:text-white"
                  )}
                >
                  {isLoading ? (
                    <div className="text-[10px] flex justify-center">
                      <ActivityIndicator size={10} />
                    </div>
                  ) : (
                    <>{submitButton}</>
                  )}
                </button>
                <button
                  onClick={handleCancel}
                  className={`py-2 text-sm rounded duration-100 ${
                    isLoading ? "w-0 opacity-0" : "flex-1"
                  } ${
                    isSecondaryDanger
                      ? "bg-danger/10 border-danger text-danger border-solid border hover:bg-danger/90 hover:text-white"
                      : "border-white/10 bg-white/5 hover:bg-white/15 hover:border-white/25 border-solid border"
                  }`}
                >
                  {secondaryButton ? secondaryButton : "Cancel"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>,
    rootElement
  );
};

const ModalStyles: Record<string, React.CSSProperties> = {
  box: {
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    margin: "auto",
    position: "fixed",
    width: "95%",
    maxWidth: "450px",
    height: "max-content",
    padding: "0",
    borderRadius: "6px",
    zIndex: 1001,
  },
  content: {
    height: "max-content",
    minHeight: "30px",
    maxHeight: "430px",
    overflowY: "auto",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 1000,
  },
};

export default Modal;
