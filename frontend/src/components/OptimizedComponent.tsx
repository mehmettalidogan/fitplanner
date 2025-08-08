import React, { memo, forwardRef, ComponentType } from 'react';

/**
 * HOC for optimizing components with React.memo
 */
export function withMemo<P extends object>(
  Component: ComponentType<P>,
  areEqual?: (prevProps: P, nextProps: P) => boolean
) {
  const MemoizedComponent = memo(Component, areEqual);
  MemoizedComponent.displayName = `Memo(${Component.displayName || Component.name})`;
  return MemoizedComponent;
}

/**
 * Simple HOC for optimizing forwardRef components
 * Use this pattern directly in your components instead of this helper
 * Example: 
 * const MyComponent = memo(forwardRef<HTMLDivElement, Props>((props, ref) => {
 *   return <div ref={ref} {...props} />;
 * }));
 */

/**
 * Generic memo equality functions
 */
export const shallowEqual = <P extends object>(prevProps: P, nextProps: P): boolean => {
  const prevKeys = Object.keys(prevProps) as (keyof P)[];
  const nextKeys = Object.keys(nextProps) as (keyof P)[];
  
  if (prevKeys.length !== nextKeys.length) {
    return false;
  }
  
  return prevKeys.every(key => prevProps[key] === nextProps[key]);
};

export const deepEqual = <P extends object>(prevProps: P, nextProps: P): boolean => {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps);
};

/**
 * Specific equality functions for common prop patterns
 */
export const arrayEqual = <P extends { items: any[] }>(
  prevProps: P,
  nextProps: P
): boolean => {
  if (prevProps.items.length !== nextProps.items.length) {
    return false;
  }
  
  return prevProps.items.every((item, index) => item === nextProps.items[index]);
};

export const idEqual = <P extends { id: string | number }>(
  prevProps: P,
  nextProps: P
): boolean => {
  return prevProps.id === nextProps.id;
};

/**
 * Performance-optimized list item component
 */
interface ListItemProps {
  id: string | number;
  children: React.ReactNode;
  className?: string;
  onClick?: (id: string | number) => void;
}

export const OptimizedListItem = memo<ListItemProps>(
  ({ id, children, className, onClick }) => {
    const handleClick = React.useCallback(() => {
      onClick?.(id);
    }, [id, onClick]);

    return (
      <div className={className} onClick={handleClick}>
        {children}
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.id === nextProps.id &&
      prevProps.className === nextProps.className &&
      prevProps.onClick === nextProps.onClick &&
      prevProps.children === nextProps.children
    );
  }
);

/**
 * Performance-optimized card component
 */
interface CardProps {
  title: string;
  description?: string;
  image?: string;
  children?: React.ReactNode;
  className?: string;
  onAction?: () => void;
}

export const OptimizedCard = memo<CardProps>(
  ({ title, description, image, children, className, onAction }) => {
    return (
      <div className={`card ${className || ''}`}>
        {image && (
          <img 
            src={image} 
            alt={title}
            className="w-full h-48 object-cover rounded-t-lg"
            loading="lazy"
          />
        )}
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          {description && (
            <p className="text-gray-600 dark:text-gray-400 mb-4">{description}</p>
          )}
          {children}
          {onAction && (
            <button
              onClick={onAction}
              className="btn-primary mt-4"
            >
              Action
            </button>
          )}
        </div>
      </div>
    );
  },
  shallowEqual
);

/**
 * Performance-optimized form field component
 */
interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  error?: string;
  placeholder?: string;
  required?: boolean;
  onChange: (name: string, value: string) => void;
}

export const OptimizedFormField = memo<FormFieldProps>(
  ({ label, name, type = 'text', value, error, placeholder, required, onChange }) => {
    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(name, e.target.value);
      },
      [name, onChange]
    );

    return (
      <div className="form-field">
        <label htmlFor={name} className="block text-sm font-medium mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={handleChange}
          className={`input-field ${error ? 'border-red-500' : ''}`}
        />
        {error && (
          <p className="text-red-500 text-sm mt-1">{error}</p>
        )}
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.name === nextProps.name &&
      prevProps.value === nextProps.value &&
      prevProps.error === nextProps.error &&
      prevProps.label === nextProps.label &&
      prevProps.type === nextProps.type &&
      prevProps.placeholder === nextProps.placeholder &&
      prevProps.required === nextProps.required &&
      prevProps.onChange === nextProps.onChange
    );
  }
);

OptimizedListItem.displayName = 'OptimizedListItem';
OptimizedCard.displayName = 'OptimizedCard';
OptimizedFormField.displayName = 'OptimizedFormField';

export default {
  withMemo,
  shallowEqual,
  deepEqual,
  arrayEqual,
  idEqual,
  OptimizedListItem,
  OptimizedCard,
  OptimizedFormField
};

