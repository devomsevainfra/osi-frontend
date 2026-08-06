import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';

/**
 * @param {Object} props
 * @param {'header' | 'footer'} [props.variant='header']
 * @param {boolean} [props.showText=true]
 */
export function BrandLogo({ variant = 'header', showText = true }) {
  const isFooter = variant === 'footer';

  const content = (
    <>
      <img
        src={logo}
        alt="Om Seva Design & Build"
        className="h-12 w-auto object-contain shrink-0"
      />
      {showText && (
        <div className="flex flex-col">
          <span
            className={`font-display font-bold text-lg leading-tight tracking-wide ${
              isFooter
                ? 'text-white'
                : 'text-brand-black group-hover:text-brand-green transition-colors duration-300'
            }`}
          >
            OM SEVA
          </span>
          <span
            className={`font-body text-[9px] font-semibold tracking-wider uppercase leading-none ${
              isFooter ? 'text-brand-border' : 'text-brand-gray'
            }`}
          >
            Design & Build Pvt. Ltd.
          </span>
        </div>
      )}
    </>
  );

  if (isFooter) {
    return (
      <Link to="/osi-console/login" className="flex items-center gap-3 cursor-pointer opacity-90 hover:opacity-100 transition-opacity duration-300" title="Admin">
        {content}
      </Link>
    );
  }

  return (
    <Link to="/" className="flex items-center gap-3 group">
      {content}
    </Link>
  );
}
