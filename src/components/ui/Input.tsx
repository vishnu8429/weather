import React from "react";

interface InputProps {
  className?: string;
  type?: "text" | "search";
  disabled?: boolean;
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  className = "",
  type = "text",
  disabled = false,
  placeholder,
  value,
  onChange,
  onBlur,
  onKeyDown,
  onFocus,
}, ref) => {
  const inputClasses = `bg-white flex h-12 w-full min-w-0 md:text-sm rounded-md border px-3 py-3 text-base outline-none disabled:pointer-events-none disabled:cursor-not-allowed ${className}`;
  return (
    <input
      ref={ref}
      className={inputClasses}
      type={type}
      disabled={disabled}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
    />
  );
});

export default Input;
