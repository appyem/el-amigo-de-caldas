import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import { FiMenu, FiX, FiLogIn, FiLayout } from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';

const navigation = [
  { name: 'Inicio', href: '/' },
  { name: 'Noticias', href: '/noticias' },
  { name: 'Agenda', href: '/agenda' },
  { name: 'Mapa', href: '/mapa' },
  { name: 'Galería', href: '/galeria' },
  { name: 'Juegos', href: '/juegos' },
  { name: 'Contacto', href: '/contacto' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container-app">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white font-bold text-lg">
              AC
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-gray-900">El Amigo de Caldas</span>
              <span className="text-xs text-gray-500">Freddy Arenas</span>
            </div>
          </Link>

          <nav className="hidden md:flex md:items-center md:space-x-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <Link to="/admin">
                <Button variant="primary" size="sm">
                  <FiLayout className="mr-2 h-4 w-4" />
                  Panel
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button variant="outline" size="sm">
                  <FiLogIn className="mr-2 h-4 w-4" />
                  Ingresar
                </Button>
              </Link>
            )}

            <button
              type="button"
              className="md:hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-gray-200 bg-white"
          >
            <div className="container-app py-4 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'block rounded-lg px-3 py-2 text-base font-medium transition-colors',
                      isActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
