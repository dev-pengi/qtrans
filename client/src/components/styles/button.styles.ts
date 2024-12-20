import { cva } from "class-variance-authority";

export const buttonStyles = cva(
  "relative duration-100 rounded flex items-center justify-center gap-2.5 leading-[20px]",
  {
    variants: {
      variant: {
        primary: "bg-accent text-white hover:opacity-80",
        secondary: "text-accent hover:text-white hover:bg-accent/70",
        danger: "bg-danger text-white hover:opacity-70 active:opacity-60",
        secondaryDanger: "text-danger hover:text-white hover:bg-danger/50",
      },
      size: {
        sm: "px-3 py-1.5 text-[13px]",
        base: "px-3 py-1.5 text-sm",
      },
      fullWidth: {
        true: "w-full",
        false: "w-max",
      },
      isLoading: {
        true: "opacity-70 cursor-not-allowed",
        false: "",
      },
      disabled: {
        true: "opacity-80 cursor-not-allowed",
        false: "",
      },
    },
    compoundVariants: [
      {
        disabled: true,
        isLoading: true,
        className: "cursor-not-allowed opacity-80",
      },
    ],
    defaultVariants: {
      variant: "primary",
      fullWidth: false,
      isLoading: false,
      disabled: false,
      size: "base",
    },
  }
);

export const iconButtonStyles = cva(
  "relative  rounded-md duration-200 flex items-center justify-center",
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-white hover:opacity-80 dark:hover:bg-accent font-normal",
        transparent: "hover:bg-black/10 hover:dark:bg-white/20",
        danger: "hover:bg-danger hover:text-white text-danger",
      },
      isLoading: {
        true: "opacity-80 cursor-not-allowed",
        false: "",
      },
      disabled: {
        true: "opacity-80 cursor-not-allowed hover:bg-transparent",
        false: "",
      },
      alwaysDark: {
        true: "text-white hover:bg-white/20",
      },
      size: {
        base: "w-[32px] h-[32px] text-[16px]",
        sm: "w-[24px] h-[24px] text-[14px]",
      },
    },
    compoundVariants: [
      {
        isLoading: true,
        disabled: true,
        className: "opacity-50 cursor-not-allowed",
      },
    ],
    defaultVariants: {
      isLoading: false,
      disabled: false,
      alwaysDark: false,
      variant: "transparent",
      size: "base",
    },
  }
);
