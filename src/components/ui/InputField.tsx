// InputField.tsx - Updated with green theme
import { forwardRef, useState } from "react";
import type { InputProps, inputSize } from "../../types/types";

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helper,
      leftIcon,
      rightIcon,
      size = "md",
      fullWidth = false,
      showPasswordToggle = false,
      type = "text",
      className = "",
      disabled,
      required,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputType = showPasswordToggle && showPassword ? "text" : type;

    const baseStyles =
      "block rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed";

    const sizeStyles: Record<inputSize, string> = {
      sm: "px-2 py-1.5 text-sm",
      md: "px-3 py-2 text-base",
      lg: "px-4 py-2.5 text-lg",
    };

    // Updated state styles for green theme
    const stateStyles = error
      ? "border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50"
      : "border-[#BBF7D0] focus:border-[#16A34A] focus:ring-[#4ADE80] hover:border-[#4ADE80] bg-white";

    const widthClass = fullWidth ? "w-full" : "";

    const paddingLeft = leftIcon ? "pl-10" : "pl-3";
    const paddingRight = rightIcon || showPasswordToggle ? "pr-10" : "pr-3";

    return (
      <div className={`${widthClass} ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-[#14532D] mb-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#166534]">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            type={inputType}
            disabled={disabled}
            required={required}
            className={`${baseStyles} ${sizeStyles[size]} ${stateStyles} ${paddingLeft} ${paddingRight} ${widthClass}`}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${label}-error` : helper ? `${label}-helper` : undefined
            }
            {...props}
          />

          {(rightIcon || showPasswordToggle) && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {rightIcon && !showPasswordToggle && (
                <div className="text-[#166534]">{rightIcon}</div>
              )}

              {showPasswordToggle && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#166534] hover:text-[#16A34A] focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  )}
                </button>
              )}
            </div>
          )}
        </div>

        {error && (
          <p className="mt-1 text-sm text-red-600" id={`${label}-error`}>
            {error}
          </p>
        )}

        {helper && !error && (
          <p className="mt-1 text-sm text-[#166534]" id={`${label}-helper`}>
            {helper}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
