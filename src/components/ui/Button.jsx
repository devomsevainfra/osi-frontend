import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Reusable Button component that handles normal clicks and React Router links.
 * 
 * @param {Object} props
 * @param {'primary' | 'secondary' | 'outline-green' | 'outline-white' | 'white'} [props.variant='primary']
 * @param {string} [props.to] - Router Link path. If supplied, renders a <Link> instead of a <button>
 * @param {string} [props.type='button']
 * @param {boolean} [props.disabled=false]
 * @param {React.ReactNode} props.children
 * @param {function} [props.onClick]
 * @param {string} [props.className='']
 */
export function Button({
  variant = 'primary',
  to,
  type = 'button',
  disabled = false,
  children,
  onClick,
  className = '',
  ...rest
}) {
  const baseStyle = 'inline-flex items-center justify-center font-body font-semibold px-6 py-3 rounded-lg text-sm transition-all duration-300 transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-brand-green/30 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-brand-green text-white hover:bg-brand-green-hover shadow-sm hover:shadow-md',
    secondary: 'bg-white text-brand-black border border-brand-border hover:border-brand-black hover:bg-brand-bg',
    'outline-green': 'bg-transparent text-brand-green border-2 border-brand-green hover:bg-brand-green hover:text-white',
    'outline-white': 'bg-transparent text-white border-2 border-white hover:bg-white hover:text-brand-black',
    white: 'bg-white text-brand-green hover:bg-brand-bg shadow-sm hover:shadow-md'
  };

  const combinedStyles = `${baseStyle} ${variants[variant] || variants.primary} ${className}`;

  if (to) {
    return (
      <Link to={to} className={combinedStyles} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      className={combinedStyles}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}
