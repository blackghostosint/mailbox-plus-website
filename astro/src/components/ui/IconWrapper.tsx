import React from 'react';

export interface IconWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const IconWrapper: React.FC<IconWrapperProps> = ({ children, className }) => {
  if (React.isValidElement(children)) {
    const childProps = children.props as { className?: string };
    const mergedClassName = className
      ? `${childProps.className || ''} ${className}`.trim()
      : childProps.className;

    return React.cloneElement(
      children as React.ReactElement<{
        className?: string;
        'aria-hidden'?: string;
        focusable?: string;
      }>,
      {
        'aria-hidden': 'true',
        focusable: 'false',
        className: mergedClassName,
      }
    );
  }

  return (
    <span className={className} aria-hidden="true">
      {children}
    </span>
  );
};
