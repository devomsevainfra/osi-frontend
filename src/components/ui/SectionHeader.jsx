import React from 'react';

/**
 * Reusable SectionHeader component.
 * 
 * @param {Object} props
 * @param {string} [props.tag] - Small pre-header tag.
 * @param {string} props.title - Main section heading.
 * @param {string} [props.subtitle] - Paragraph subtext below the title.
 * @param {'center' | 'left'} [props.align='center'] - Alignment of the text.
 * @param {string} [props.className='']
 */
export function SectionHeader({
  tag,
  title,
  subtitle,
  align = 'center',
  className = ''
}) {
  const isCenter = align === 'center';
  const containerStyle = isCenter ? 'text-center max-w-3xl mx-auto mb-12' : 'text-left mb-8';
  const dividerStyle = isCenter ? 'mx-auto' : '';

  return (
    <div className={`${containerStyle} ${className}`}>
      {tag && (
        <span className="inline-block text-xs font-bold tracking-widest text-brand-green uppercase mb-3 font-body bg-brand-green/5 px-3 py-1 rounded">
          {tag}
        </span>
      )}
      
      <h2 className="text-3xl md:text-4xl font-bold font-display text-brand-black leading-tight">
        {title}
      </h2>
      
      <div className={`w-12 h-1 bg-brand-green mt-4 mb-4 rounded ${dividerStyle}`} />
      
      {subtitle && (
        <p className="text-brand-gray text-base md:text-lg font-body leading-relaxed mt-2">
          {subtitle}
        </p>
      )}
    </div>
  );
}
