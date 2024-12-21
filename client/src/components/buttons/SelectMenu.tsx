import { FC, ReactNode, useMemo } from "react";
import { DropdownBase } from "../popups/DropdownBase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import ActivityIndicator from "../loaders/ActivityIndicator";
import { SelectMenuOption } from "src/types";
import { cva, VariantProps } from "class-variance-authority";
import clsx from "clsx";
import { labelStyles } from "../styles/input.styles";

const triggerStyles = cva(
  "block transition-colors duration-100 min-w-[160px] cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-gray-5/20 hover:bg-gray-5/30 text-white rounded",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
      size: {
        base: "px-4 py-3",
        sm: "py-2 px-5 text-[15px]",
      },
      highlight: {
        true: "dark:bg-accent/95 bg-accent/95 hover:!bg-accent/80 dark:hover:!bg-accent/80 text-white dark:text-white",
      },
      label: {
        true: "mt-2",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "base",
      fullWidth: false,
      highlight: false,
      label: false,
    },
  }
);

const itemStyles = cva(
  "py-2 px-3 text-[15px] rounded-sm w-full text-start capitalize",
  {
    variants: {
      isActive: {
        true: "bg-accent text-white",
        false: "hover:bg-white/10",
      },
    },
  }
);

const menuStyles = cva(
  "z-[10000] min-w-[185px] rounded-md px-1 py-1 w-full flex flex-col gap-1 max-h-[300px] overflow-auto min-scrollbar",
  {
    variants: {
      menuVariant: {
        default: "bg-background shadow-light",
        secondary: "bg-background dark:bg-dark-1 shadow-light dark:shadow-none",
      },
    },
    defaultVariants: {
      menuVariant: "default",
    },
  }
);

interface SelectMenuProps
  extends Omit<VariantProps<typeof triggerStyles>, "label">,
    VariantProps<typeof menuStyles> {
  defaultOption: SelectMenuOption;
  children: ReactNode;
  options: SelectMenuOption[];
  isLoading: boolean;
  activeOption: string | number;
  multi?: boolean;
  activeOptions?: string[];
  label?: string;
  onSelect: (option: SelectMenuOption) => void;
}
const SelectMenu: FC<Partial<SelectMenuProps>> = ({
  defaultOption,
  children,
  options,
  isLoading = false,
  activeOption,
  fullWidth,
  variant = "default",
  menuVariant,
  size = "base",
  label,
  highlight = false,
  onSelect,
}) => {
  const pickedOption = useMemo(() => {
    const fullActiveOption =
      options && options.find((op) => op.value === activeOption);

    if (fullActiveOption) {
      return fullActiveOption;
    } else return defaultOption;
  }, [options, activeOption, isLoading]);

  return (
    <div className="w-full flex-1">
      {label && <label className={labelStyles()}>{label}</label>}
      <DropdownBase.Root inheritTriggerWidth>
        <DropdownBase.Trigger
          className={clsx(
            triggerStyles({
              variant,
              size,
              fullWidth,
              highlight: highlight && pickedOption && !pickedOption.default,
              label: Boolean(label),
            })
          )}
        >
          {children ? (
            <>{children}</>
          ) : (
            <>
              {pickedOption && (
                <div className="flex items-center w-full gap-3 justify-between capitalize">
                  <div className="flex items-center gap-3">
                    {isLoading && <ActivityIndicator size={8} />}
                    {pickedOption.label}
                  </div>
                  <FontAwesomeIcon icon={faAngleDown} />
                </div>
              )}
            </>
          )}
        </DropdownBase.Trigger>
        <DropdownBase.Content
          className={menuStyles({
            menuVariant,
          })}
        >
          {isLoading ? (
            <div className="py-3 flex items-center justify-center">
              <ActivityIndicator />
            </div>
          ) : (
            <>
              {defaultOption && (
                <DropdownBase.Item
                  onClick={() => onSelect && onSelect(defaultOption)}
                  key={defaultOption.value}
                  className={itemStyles({
                    isActive: pickedOption?.value === defaultOption.value,
                  })}
                >
                  {defaultOption.label}
                </DropdownBase.Item>
              )}

              {!defaultOption && (!options || !options.length) && (
                <div>No Option Provided</div>
              )}

              {options &&
                options.map((option) => (
                  <DropdownBase.Item
                    onClick={() => onSelect && onSelect(option)}
                    key={option.value}
                    className={itemStyles({
                      isActive: pickedOption?.value === option.value,
                    })}
                  >
                    {option.label}
                  </DropdownBase.Item>
                ))}
            </>
          )}
        </DropdownBase.Content>
      </DropdownBase.Root>
    </div>
  );
};

export default SelectMenu;
