"use client";

import React from "react";

interface AgButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const AgButton: React.FC<AgButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  className = "",
  type = "button",
  icon,
  iconPosition = "right",
}) => {
  const baseClasses =
    "rounded-full font-medium transition-colors flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantClasses = {
    primary: "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-500",
    secondary: "bg-white text-gray-900 hover:bg-gray-100 focus:ring-gray-300",
    outline:
      "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-300",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const disabledClasses =
    disabled || loading ? "opacity-50 cursor-not-allowed" : "";

  const finalClassName =
    `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`.trim();

  const handleClick = () => {
    if (!disabled && !loading && onClick) {
      onClick();
    }
  };

  const renderIcon = () => {
    if (loading) {
      return (
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      );
    }
    return icon;
  };

  return (
    <button
      type={type}
      className={finalClassName}
      onClick={handleClick}
      disabled={disabled || loading}
    >
      {iconPosition === "left" && renderIcon()}
      <span>{children}</span>
      {iconPosition === "right" && renderIcon()}
    </button>
  );
};

export default AgButton;
