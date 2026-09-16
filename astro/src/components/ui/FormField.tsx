import React, { useId } from 'react';

export interface FormFieldProps {
  id?: string;
  label: string;
  error?: string;
  helpText?: string;
  required?: boolean;
  className?: string;
  labelClassName?: string;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  error,
  helpText,
  required,
  className = '',
  labelClassName = '',
  children,
}) => {
  const generatedId = useId();
  const fieldId = id || `field-${generatedId.replace(/:/g, '')}`;
  const errorId = `${fieldId}-error`;
  const helpId = `${fieldId}-help`;

  const describedByIDs: string[] = [];
  if (error) describedByIDs.push(errorId);
  if (helpText) describedByIDs.push(helpId);
  const ariaDescribedBy = describedByIDs.length > 0 ? describedByIDs.join(' ') : undefined;

  const focusRingClasses =
    'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2';

  const renderControl = () => {
    if (React.isValidElement(children)) {
      const childProps = children.props as {
        className?: string;
        id?: string;
        'aria-describedby'?: string;
        'aria-invalid'?: boolean;
        required?: boolean;
      };

      const mergedClassName = `${childProps.className || ''} ${focusRingClasses}`.trim();

      return React.cloneElement(
        children as React.ReactElement<{
          id?: string;
          className?: string;
          'aria-describedby'?: string;
          'aria-invalid'?: boolean;
          required?: boolean;
        }>,
        {
          id: childProps.id || fieldId,
          'aria-describedby': childProps['aria-describedby'] || ariaDescribedBy,
          'aria-invalid': Boolean(error),
          required: childProps.required !== undefined ? childProps.required : required,
          className: mergedClassName,
        }
      );
    }

    return children;
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      <label
        htmlFor={fieldId}
        className={`block text-xs font-bold text-text-primary ${labelClassName}`}
      >
        {label}
        {required && (
          <span className="text-red-600 ml-1" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {renderControl()}
      {helpText && (
        <p id={helpId} className="text-xs text-text-muted mt-1">
          {helpText}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-xs text-red-600 font-medium mt-1">
          {error}
        </p>
      )}
    </div>
  );
};
