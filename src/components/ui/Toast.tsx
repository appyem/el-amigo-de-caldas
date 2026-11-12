import { Toaster } from 'react-hot-toast';

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          borderRadius: '0.75rem',
          padding: '1rem',
          fontSize: '0.875rem',
          fontWeight: '500',
          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        },
        success: {
          style: {
            background: '#ECFDF5',
            color: '#065F46',
            border: '1px solid #A7F3D0',
          },
          iconTheme: {
            primary: '#10B981',
            secondary: '#ECFDF5',
          },
        },
        error: {
          style: {
            background: '#FEF2F2',
            color: '#991B1B',
            border: '1px solid #FECACA',
          },
          iconTheme: {
            primary: '#EF4444',
            secondary: '#FEF2F2',
          },
        },
        loading: {
          style: {
            background: '#EFF6FF',
            color: '#1E40AF',
            border: '1px solid #BFDBFE',
          },
        },
      }}
    />
  );
}
