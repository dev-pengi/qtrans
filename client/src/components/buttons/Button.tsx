import { FC, ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { VariantProps } from "class-variance-authority";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { buttonStyles } from "../styles/button.styles";
import ActivityIndicator from "../loaders/ActivityIndicator";

interface ButtonProps extends VariantProps<typeof buttonStyles> {
  children: ReactNode;
  icon?: IconDefinition;
  isLoading?: boolean;
  fullWidth?: boolean;
  stopPropagation?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const Button: FC<ButtonProps> = ({
  variant,
  isLoading,
  fullWidth,
  icon,
  children,
  disabled,
  stopPropagation = false,
  onClick,
  size,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    stopPropagation && e.stopPropagation();
    if (!disabled && !isLoading && onClick) onClick(e);
  };

  return (
    <button
      {...props}
      onClick={handleClick}
      className={buttonStyles({
        variant,
        fullWidth,
        isLoading,
        disabled,
        size,
      })}
    >
      <div
        className={`flex items-center gap-3 w-max ${
          isLoading ? "opacity-0" : ""
        }`}
      >
        {icon && <FontAwesomeIcon icon={icon} />}
        <span>{children}</span>
      </div>
      {isLoading && (
        <div className="absolute left-0 top-0 flex items-center justify-center h-full w-full">
          <ActivityIndicator size={10} />
        </div>
      )}
    </button>
  );
};

export default Button;
