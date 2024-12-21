import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  Dispatch,
  DetailedHTMLProps,
  HTMLAttributes,
  forwardRef,
  useEffect,
  MutableRefObject,
} from "react";
import ReactDOM from "react-dom";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  size,
  shift,
  useClick,
  useDismiss,
  useInteractions,
} from "@floating-ui/react";
import clsx from "clsx";

interface DropdownMenuContextProps {
  showMenu: boolean;
  setShowMenu: Dispatch<React.SetStateAction<boolean>>;
  floatingStyles: React.CSSProperties;
  refs: any;
  getReferenceProps: any;
  getFloatingProps: any;
  isContext: boolean;
  setIsContext: Dispatch<React.SetStateAction<boolean>>;
}

interface DropdownMenuBaseProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {}
type DropdownMenuContentProps = DropdownMenuBaseProps;

type DropdownMenuTriggerProps = DropdownMenuBaseProps &
  DetailedHTMLProps<HTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

type DropdownMenuItemProps = DropdownMenuBaseProps &
  DetailedHTMLProps<HTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
    hideInContext?: boolean;
  };

const DropdownMenuContext = createContext<DropdownMenuContextProps | undefined>(
  undefined
);

const Root: React.FC<{
  children?: ReactNode;
  inheritTriggerWidth?: boolean;
  contextReference?: MutableRefObject<HTMLElement | null>;
}> = ({ children, inheritTriggerWidth, contextReference }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isContext, setIsContext] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: showMenu,
    onOpenChange: (status) => {
      setShowMenu(status);
      if (!status && isContext) {
        setIsContext(false);
      }
    },
    whileElementsMounted: autoUpdate,
    placement: "bottom-start",
    middleware: [
      offset(8),
      inheritTriggerWidth &&
        size({
          apply({ rects, elements }) {
            Object.assign(elements.floating.style, {
              width: `${rects.reference.width}px`,
            });
          },
        }),
      flip(),
      shift({ padding: 20 }),
    ],
  });

  const dismiss = useDismiss(context);
  const click = useClick(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    dismiss,
    click,
  ]);

  const contextValue = useMemo(
    () => ({
      showMenu,
      setShowMenu,
      floatingStyles,
      refs,
      getReferenceProps,
      getFloatingProps,
      isContext,
      setIsContext,
    }),
    [showMenu, floatingStyles, refs, getReferenceProps, getFloatingProps]
  );

  useEffect(() => {
    if (!contextReference || !contextReference.current) return;

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setIsContext(true);
      refs.setPositionReference({
        getBoundingClientRect() {
          return {
            width: 0,
            height: 0,
            x: e.clientX,
            y: e.clientY,
            top: e.clientY,
            right: e.clientX,
            bottom: e.clientY,
            left: e.clientX,
          };
        },
      });
      setShowMenu(true);
    };

    contextReference.current.addEventListener("contextmenu", handleContextMenu);
    return () => {
      if (contextReference && contextReference.current)
        contextReference.current.removeEventListener(
          "contextmenu",
          handleContextMenu
        );
    };
  }, [contextReference, refs]);

  return (
    <DropdownMenuContext.Provider value={contextValue}>
      {children}
    </DropdownMenuContext.Provider>
  );
};

const Trigger = forwardRef<HTMLDivElement, DropdownMenuTriggerProps>(
  ({ ...props }, ref) => {
    const context = useContext(DropdownMenuContext);

    if (!context) {
      throw new Error(
        "DropdownMenuTrigger must be used within a DropdownMenuRoot"
      );
    }

    const { getReferenceProps, refs, setShowMenu, isContext, setIsContext } =
      context;

    return (
      <div
        ref={(node) => {
          refs.setReference(node);
          if (ref) {
            if (typeof ref === "function") ref(node);
            else ref.current = node;
          }
        }}
        {...getReferenceProps()}
        {...props}
        className={clsx(props.className)}
        onMouseDown={() => {
          refs.setPositionReference(null);
        }}
        onClick={(e) => {
          e.stopPropagation();

          if (isContext) {
            setShowMenu(false);
            setIsContext(false);
            setTimeout(() => {
              setShowMenu((prev) => !prev);
            }, 0);
          } else {
            setShowMenu((prev) => !prev);
          }
          props.onClick && props.onClick(e);
        }}
      ></div>
    );
  }
);

const Content = forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  ({ ...props }, ref) => {
    const context = useContext(DropdownMenuContext);

    if (!context) {
      throw new Error(
        "DropdownMenuContent must be used within a DropdownMenuRoot"
      );
    }

    const rootElement = useMemo(() => document.getElementById("root"), []);

    const { floatingStyles, refs, getFloatingProps, showMenu } = context;

    return (
      <>
        {rootElement &&
          showMenu &&
          ReactDOM.createPortal(
            <div
              {...props}
              ref={(node) => {
                refs.setFloating(node);
                if (ref) {
                  if (typeof ref === "function") ref(node);
                  else ref.current = node;
                }
              }}
              {...getFloatingProps()}
              style={{
                zIndex: 10000,
                ...floatingStyles,
              }}
              className={clsx(props.className)}
              onClick={(e) => {
                e.stopPropagation();
                props.onClick && props.onClick(e);
              }}
            >
              {props.children}
            </div>,
            rootElement
          )}
      </>
    );
  }
);

const Item = forwardRef<HTMLButtonElement, DropdownMenuItemProps>(
  ({ ...props }, ref) => {
    const context = useContext(DropdownMenuContext);

    if (!context) {
      throw new Error(
        "DropdownMenuItem must be used within a DropdownMenuRoot"
      );
    }

    const { setShowMenu, isContext } = context;

    return (
      <>
        {(!props.hideInContext || !isContext) && (
          <button
            ref={ref}
            {...props}
            className={clsx(props.className)}
            onClick={(e) => {
              setShowMenu(false);
              props.onClick && props.onClick(e);
            }}
          >
            {props.children}
          </button>
        )}
      </>
    );
  }
);

export const DropdownBase = {
  Root,
  Trigger,
  Content,
  Item,
};
