// Button.tsx
import React, { forwardRef } from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "success";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      className = "",
      disabled,
      type = "button",
      ...props
    },
    ref,
  ) => {
    // Base styles - school-friendly with rounded corners
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl";

    // Variant styles - school-friendly green theme
    const variants = {
      primary:
        "bg-[#16A34A] text-white hover:bg-[#15803D] focus:ring-[#4ADE80] active:bg-[#14532D] shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]",
      secondary:
        "bg-[#4ADE80] text-[#14532D] hover:bg-[#22C55E] focus:ring-[#16A34A] active:bg-[#16A34A] shadow-md hover:shadow-lg",
      outline:
        "border-2 border-[#16A34A] text-[#16A34A] hover:bg-[#F0FDF4] focus:ring-[#4ADE80] active:bg-[#DCFCE7]",
      ghost:
        "text-[#16A34A] hover:bg-[#F0FDF4] focus:ring-[#4ADE80] active:bg-[#DCFCE7]",
      danger:
        "bg-red-600 text-white hover:bg-red-700 focus:ring-red-400 active:bg-red-800",
      success:
        "bg-[#22C55E] text-white hover:bg-[#16A34A] focus:ring-[#4ADE80] active:bg-[#15803D]",
    };

    // Size styles
    const sizes = {
      sm: "px-3 py-1.5 text-sm gap-1.5",
      md: "px-4 py-2 text-base gap-2",
      lg: "px-6 py-3 text-lg gap-2",
    };

    const widthClass = fullWidth ? "w-full" : "";

    return (
      <button
        ref={ref}
        type={type}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {!isLoading && leftIcon && (
          <span className="flex items-center">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && (
          <span className="flex items-center">{rightIcon}</span>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
