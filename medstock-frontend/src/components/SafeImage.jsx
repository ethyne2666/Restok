import { useState } from 'react';
import { cn } from '@/utils/cn';

export function SafeImage({ src, alt = '', className }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return <div className={cn('bg-gradient-to-br from-green-200 to-emerald-400', className)} role="img" aria-label={alt} />;
  }
  return (
    <img src={src} alt={alt} loading="lazy" referrerPolicy="no-referrer"
      onError={() => setFailed(true)} className={cn('object-cover', className)} />
  );
}