import React from "react";

interface CardProps {
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  header?: React.ReactNode;
  content?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  onClick?: () => void;
}

export default function Card({
  className = "",
  headerClassName = "",
  contentClassName = "",
  footerClassName = "",
  header,
  children,
  footer,
  onClick,
}: CardProps) {
  const cardClasses = `bg-background rounded-xl ${className}`;
  const headerClasses = `p-4 ${headerClassName}`;
  const contentClasses = `p-6 ${contentClassName}`;
  const footerClasses = `flex items-center px-6 pb-6 ${footerClassName}`;

  return (
    <div className={cardClasses} onClick={onClick}>
      {header && (
        <div className={headerClasses}>{header}</div>
      )}
      {children && (
        <div className={contentClasses}>{children}</div>
      )}
      {footer && (
        <div className={footerClasses}>{footer}</div>
      )}
    </div>
  );
}