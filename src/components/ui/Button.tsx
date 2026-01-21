import React from "react";

interface ButtonProps {
  className?: string;
  type?: "button" | "submit" | "reset";
  variant?: "solid" | "outline" | "icon";
  color?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  label?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

export default function Button({
  className = "",
  type = "button",
  variant = "solid",
  color = "primary",
  size = "md",
  disabled = false,
  label = "",
  children = "",
  onClick,
}: ButtonProps) {
  const getVariantClasses = () => {
    if (variant === "solid") {
      return color === "primary"
        ? "bg-primary text-white"
        : "bg-secondary text-white";
    }
    if (variant === "outline") {
      return color === "primary"
        ? "bg-white text-primary border border-primary"
        : "bg-white text-secondary border border-secondary";
    }
    if (variant === "icon") {
      return color === "primary"
        ? "bg-transparent text-primary"
        : "bg-transparent text-secondary";
    }
    return "";
  };

  const getSizeClasses = () => {
    const isIcon = variant === "icon";

    if (size === "sm") {
      return isIcon
        ? "text-sm p-1.5 h-8 w-8 font-medium"
        : "text-sm px-3 py-1.5 h-8 font-medium";
    }
    if (size === "md") {
      return isIcon
        ? "text-base p-2 h-10 w-10 font-medium"
        : "text-base p-4 h-12 font-medium";
    }
    if (size === "lg") {
      return isIcon
        ? "text-lg p-2.5 h-12 w-12 font-semibold"
        : "text-lg px-6 py-3 h-12 font-semibold";
    }

    return isIcon
      ? "text-base p-2 h-10 w-10 font-medium"
      : "text-base p-4 h-12 font-medium";
  };

  const getFocusRingClasses = () => {
    if (variant === "icon") return "";
    return color === "primary"
      ? "focus:ring-2 focus:ring-primary focus:ring-offset-2"
      : "focus:ring-2 focus:ring-secondary focus:ring-offset-2";
  };

  const variantClasses = getVariantClasses();
  const sizeClasses = getSizeClasses();
  const focusRingClasses = getFocusRingClasses();

  return (
    <button
      className={`flex items-center justify-center gap-2 
        rounded-md transition-all 
        hover:opacity-90 active:scale-95 disabled:pointer-events-none disabled:opacity-50 outline-none 
        ${variantClasses} ${sizeClasses} ${focusRingClasses} ${className}
      `}
      type={type}
      aria-label={label}
      aria-disabled={disabled}
      disabled={disabled}
      onClick={onClick}
    >
      {label || children}
    </button>
  );
}
