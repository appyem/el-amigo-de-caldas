import { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { FiAlertTriangle } from 'react-icons/fi';
import { Button } from './Button';

export interface ErrorStateProps {
  icon?: ReactNode;
  title?: string;
  description?: string;
  onRetry?: () => void;
  onContact?: () => void;
  className?: string;
}

export function ErrorState({
  icon,
  title = 'Algo salió mal',
  description = 'No pudimos cargar la información. Por favor, intenta de nuevo.',
  onRetry,
  onContact,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 text-center', className)}>
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
        {icon || <FiAlertTriangle className="h-8 w-8" />}
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-gray-500">{description}</p>}
      {(onRetry || onContact) && (
        <div className="mt-6 flex gap-3">
          {onRetry && (
            <Button variant="primary" onClick={onRetry}>
              Reintentar
            </Button>
          )}
          {onContact && (
            <Button variant="outline" onClick={onContact}>
              Contactar soporte
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
