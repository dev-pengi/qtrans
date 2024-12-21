import { FC, ReactNode, useMemo } from "react";
import { DropdownBase } from "../popups/DropdownBase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faCheck } from "@fortawesome/free-solid-svg-icons";
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
  "py-2 px-3 text-[15px] rounded-sm w-full text-start capitalize flex items-center justify-between hover:bg-white/10"
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

interface MultiSelectProps
  extends Omit<VariantProps<typeof triggerStyles>, "label">,
    VariantProps<typeof menuStyles> {
  defaultOption: SelectMenuOption;
  children: ReactNode;
  options?: SelectMenuOption[];
  isLoading: boolean;
  activeOptions: string[];
  label?: string;
  onSelect: (options: SelectMenuOption[]) => void;
}
const MultiSelect: FC<Partial<MultiSelectProps>> = ({
  defaultOption,
  children,
  options = [],
  isLoading = false,
  activeOptions = [],
  fullWidth,
  variant = "default",
  menuVariant,
  size = "base",
  label,
  highlight = false,
  onSelect,
}) => {
  const pickedOptions = useMemo(() => {
    if (!options || !options.length) return [];
    return options.filter((op) => activeOptions.includes(op.value));
  }, [options, activeOptions]);

  const handleSelect = (option: SelectMenuOption) => {
    const isSelected = activeOptions.includes(option.value);
    const newActiveOptions = isSelected
      ? activeOptions.filter((value) => value !== option.value)
      : [...activeOptions, option.value];

    const newPickedOptions = options.filter((op) =>
      newActiveOptions.includes(op.value)
    );

    onSelect && onSelect(newPickedOptions);
  };

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
              highlight: highlight && pickedOptions.length > 0,
              label: Boolean(label),
            })
          )}
        >
          <div className="flex items-center w-full gap-3 justify-between capitalize">
            {children ? (
              <>{children}</>
            ) : (
              <div className="flex items-center gap-3">
                {isLoading && <ActivityIndicator size={8} />}
                {pickedOptions.length} selected
              </div>
            )}
            <FontAwesomeIcon icon={faAngleDown} />
          </div>
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
              {defaultOption && !options.length && (
                <DropdownBase.Item
                  onClick={() => handleSelect(defaultOption)}
                  key={defaultOption.value}
                  className={itemStyles()}
                >
                  {defaultOption.label}
                </DropdownBase.Item>
              )}

              {!options.length && !defaultOption && (
                <div>No Options Provided</div>
              )}

              {options.map((option) => (
                <DropdownBase.Item
                  onClick={() => handleSelect(option)}
                  key={option.value}
                  className={itemStyles()}
                >
                  <span>{option.label}</span>
                  {activeOptions.includes(option.value) && (
                    <div className="w-[20px] h-[20px] rounded-full bg-accent flex items-center justify-center">
                      <FontAwesomeIcon icon={faCheck} className="text-[12px]" />
                    </div>
                  )}
                </DropdownBase.Item>
              ))}
            </>
          )}
        </DropdownBase.Content>
      </DropdownBase.Root>
    </div>
  );
};

export default MultiSelect;
