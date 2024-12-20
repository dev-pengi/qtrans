import { FC, HTMLAttributes } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { VariantProps } from "class-variance-authority";
import { iconButtonStyles } from "../styles/button.styles";
import ActivityIndicator from "../loaders/ActivityIndicator";

interface IconButtonProps
  extends HTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonStyles> {
  icon: any;
  tooltip?: {
    content: string;
    placement?: "bottom" | "top" | "right" | "left";
    singleton?: any;
  };
  stopPropagation?: boolean;
}

const IconButton: FC<IconButtonProps> = ({
  icon,
  isLoading = false,
  tooltip,
  disabled,
  alwaysDark,
  variant,
  stopPropagation,
  size,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    stopPropagation && e.stopPropagation();
    if (!disabled && !isLoading && props.onClick) props.onClick(e);
  };
  return (
    <button
      {...props}
      onClick={handleClick}
      disabled={Boolean(isLoading || disabled)}
      className={iconButtonStyles({
        isLoading,
        disabled,
        alwaysDark,
        variant,
        size,
      })}
    >
      {isLoading ? (
        <div className="absolute left-0 top-0 flex items-center justify-center h-full w-full">
          <ActivityIndicator size={8} />
        </div>
      ) : (
        <FontAwesomeIcon icon={icon} />
      )}
    </button>
  );
};

export default IconButton;
