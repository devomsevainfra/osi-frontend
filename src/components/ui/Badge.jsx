import React from 'react';

/**
 * Reusable Badge component for categories and statuses.
 * 
 * @param {Object} props
 * @param {string} props.children
 * @param {'status' | 'category'} [props.type='category']
 * @param {string} [props.className='']
 */
export function Badge({
  children,
  type = 'category',
  className = '',
  ...rest
}) {
  const isStatus = type === 'status';
  const label = String(children).toLowerCase().trim();

  let styles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide border';

  if (isStatus) {
    styles += ' bg-brand-green text-white border-brand-green font-bold uppercase';
  } else {
    // Categories: Transportation, Water, Structural, Surveying, Consultancy
    if (label === 'transportation') {
      styles += ' bg-blue-50 text-blue-800 border-blue-200';
    } else if (label === 'water') {
      styles += ' bg-cyan-50 text-cyan-800 border-cyan-200';
    } else if (label === 'structural') {
      styles += ' bg-amber-50 text-amber-800 border-amber-200';
    } else if (label === 'surveying') {
      styles += ' bg-indigo-50 text-indigo-800 border-indigo-200';
    } else if (label === 'consultancy') {
      styles += ' bg-purple-50 text-purple-800 border-purple-200';
    } else {
      styles += ' bg-brand-bg text-brand-black border-brand-border';
    }
  }

  return (
    <span className={`${styles} ${className}`} {...rest}>
      {children}
    </span>
  );
}
