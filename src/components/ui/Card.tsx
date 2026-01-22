import React from "react";

interface CardProps {
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

export default function Card({
  className = "",
  children,
  onClick,
}: CardProps) {
  return (
    <div className={`bg-background rounded-xl ${className}`} onClick={onClick}>
      {children && children}
    </div>
  );
}