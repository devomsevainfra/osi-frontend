export function Spinner({ size = 'md', className = '' }) {
  const sizes = { sm: 'admin-spinner--sm', md: 'admin-spinner--md', lg: 'admin-spinner--lg' };
  return <div className={`admin-spinner ${sizes[size] || sizes.md} ${className}`} aria-label="Loading" />;
}
