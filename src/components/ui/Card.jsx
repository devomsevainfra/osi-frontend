import React from 'react';

/**
 * Reusable Card container.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.className='']
 * @param {boolean} [props.hoverEffect=true] - Applies elevation and translate-y hover effects.
 * @param {function} [props.onClick]
 */
export function Card({
  children,
  className = '',
  hoverEffect = true,
  onClick,
  ...rest
}) {
  const baseStyle = 'bg-white border border-brand-border rounded-lg p-6 transition-all duration-300';
  const hoverStyle = hoverEffect ? 'hover:shadow-lg hover:-translate-y-1 shadow-sm' : 'shadow-sm';
  const clickStyle = onClick ? 'cursor-pointer' : '';

  return (
    <div
      className={`${baseStyle} ${hoverStyle} ${clickStyle} ${className}`}
      onClick={onClick}
      {...rest}
    >
      {children}
    </div>
  );
}

Card.Header = function CardHeader({ children, className = '' }) {
  return <div className={`border-b border-brand-border pb-4 mb-4 ${className}`}>{children}</div>;
};

Card.Body = function CardBody({ children, className = '' }) {
  return <div className={`font-body text-brand-gray text-sm leading-relaxed ${className}`}>{children}</div>;
};

Card.Footer = function CardFooter({ children, className = '' }) {
  return <div className={`border-t border-brand-border pt-4 mt-4 ${className}`}>{children}</div>;
};
