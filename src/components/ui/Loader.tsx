import { cn } from '@/utils/cn';

export interface LoaderProps {
  variant?: 'spinner' | 'skeleton' | 'fullscreen';
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export function Loader({ variant = 'spinner', size = 'md', text, className }: LoaderProps) {
  if (variant === 'fullscreen') {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm">
        <Loader variant="spinner" size="lg" />
        {text && <p className="mt-4 text-sm font-medium text-gray-600">{text}</p>}
      </div>
    );
  }

  if (variant === 'skeleton') {
    return (
      <div
        className={cn(
          'animate-pulse rounded-lg bg-gray-200',
          size === 'sm' && 'h-4 w-24',
          size === 'md' && 'h-6 w-40',
          size === 'lg' && 'h-10 w-full',
          className
        )}
      />
    );
  }

  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <svg
        className={cn('animate-spin text-primary', sizes[size])}
        viewBox="0 0 24 24"
        fill="none"
        role="status"
        aria-label="Cargando"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>
  );
}
