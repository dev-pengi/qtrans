import { cva } from "class-variance-authority";

export const inputStyles = cva(
  "min-scrollbar block duration-200 transition-colors w-full px-4 py-2.5 tracking-wide border-none border bg-gray-5/20 border-solid rounded",
  {
    variants: {
      hasError: {
        true: "border-danger text-danger placeholder-danger",
        false:
          "border-gray-3 focus:border-accent focus:border-accent",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed",
        false: "",
      },
      textarea: {
        true: "min-h-[150px] max-h-[300px] scroll-auto",
        false: "",
      },
      label: {
        true: "mt-2",
        false: "",
      },
    },
    defaultVariants: {
      hasError: false,
      disabled: false,
      textarea: false,
      label: false,
    },
  }
);

export const labelStyles = cva(
  "text-[13px] dark:text-gray-5 font-semibold ml-1 capitalize duration-200",
  {
    variants: {
      hasError: {
        true: "text-danger dark:text-danger",
        false: "text-gray-2 dark:text-gray-1 focus:!text-accent",
      },
    },
    defaultVariants: {
      hasError: false,
    },
  }
);
