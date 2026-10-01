import { Link } from 'react-router-dom';
import { BRAND } from '@/utils/brand';

// Uses /logo.png straight from the public folder. The PNG has empty space
// around the oval, so we crop it with a clipped box (no new file needed).
export function BrandLogo({ className = 'h-10', to = '/' }) {
  return (
    <Link to={to} aria-label={`${BRAND.name} home`} className={`relative inline-block shrink-0 overflow-hidden ${className}`} style={{ aspectRatio: '309 / 163' }}>
      <img
        src="/logo.png"
        alt={BRAND.name}
        draggable="false"
        className="absolute max-w-none select-none"
        style={{ width: '170.5%', left: '-39.5%', top: '-68.1%' }}
      />
    </Link>
  );
}
