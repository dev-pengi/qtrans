import { FC, forwardRef } from "react";
import { VariantProps } from "class-variance-authority";
import { inputStyles, labelStyles } from "../styles/input.styles";
import clsx from "clsx";

interface InputProps
  extends Omit<VariantProps<typeof inputStyles>, "hasError" | "label">,
    React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  id: string;
  label?: string;
  placeholder?: string;
  value?: string | number;
  error?: string;
  type?: string;
  disabled?: boolean;
  textarea?: boolean;
  onChange?: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
}

const Input: FC<InputProps> = forwardRef(
  (
    {
      value,
      label,
      placeholder,
      error,
      type = "text",
      disabled,
      textarea,
      id,
      onChange,
      ...props
    },
    ref
  ) => {
    const hasError = Boolean(error);

    return (
      <div className="w-full flex-1">
        {label && (
          <label htmlFor={id} className={labelStyles({ hasError })}>
            {label}
            {error && (
              <>
                <span className="mx-[8px]">-</span>
                <span className="text-[13px]">{error}</span>
              </>
            )}
          </label>
        )}
        {textarea ? (
          <textarea
            dir="auto"
            id={id}
            value={value}
            disabled={disabled}
            onChange={onChange}
            placeholder={placeholder}
            {...props}
            className={clsx(
              inputStyles({
                hasError,
                disabled,
                textarea: true,
                label: Boolean(label),
              }),
              props.className
            )}
            ref={ref as React.Ref<HTMLTextAreaElement>}
          ></textarea>
        ) : (
          <input
            id={id}
            dir="auto"
            type={type}
            value={value}
            disabled={disabled}
            onChange={onChange}
            placeholder={placeholder}
            {...props}
            className={clsx(
              inputStyles({ hasError, disabled, label: Boolean(label) }),
              props.className
            )}
            ref={ref as React.Ref<HTMLInputElement>}
          />
        )}
      </div>
    );
  }
);

export default Input;
