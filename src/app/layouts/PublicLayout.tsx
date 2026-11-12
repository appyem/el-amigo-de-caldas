import { Link, Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import { FiMenu, FiX, FiUser, FiLogIn } from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import fredyLogo from '@/assets/fredy-arenas.jpg';

const publicNavigation = [
  { name: 'Inicio', href: '/' },
  { name: 'Noticias', href: '/noticias' },
  { name: 'Agenda', href: '/agenda' },
  { name: 'Mapa', href: '/mapa' },
  { name: 'Galería', href: '/galeria' },
  { name: 'Juegos', href: '/juegos' },
  { name: 'Contacto', href: '/contacto' },
];

export function PublicLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header con logo de Fredy */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="container-app">
          <div className="flex h-16 items-center justify-between">
            {/* Logo con foto de Fredy */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="h-11 w-11 rounded-full overflow-hidden border-2 border-primary flex-shrink-0 group-hover:scale-105 transition-transform">
                <img src={fredyLogo} alt="Fredy Arenas" className="h-full w-full object-cover" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-gray-900 leading-tight">Fredy Arenas</p>
                <p className="text-xs text-primary-600 leading-tight">El Amigo de Caldas</p>
              </div>
            </Link>

            {/* Navegación Desktop */}
            <nav className="hidden lg:flex items-center gap-1">
              {publicNavigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                      isActive ? 'text-primary-700 bg-primary-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    )}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Botones de acción */}
            <div className="flex items-center gap-2">
              {user ? (
                <Link to="/admin">
                  <button className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-700 transition-colors">
                    <FiUser className="h-4 w-4" /> Panel
                  </button>
                </Link>
              ) : (
                <Link to="/login">
                  <button className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary-50 transition-colors">
                    <FiLogIn className="h-4 w-4" /> Ingresar
                  </button>
                </Link>
              )}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100"
              >
                {mobileMenuOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Menú Mobile */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-gray-200 bg-white"
            >
              <div className="container-app py-3 space-y-1">
                {publicNavigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        'block px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                        isActive ? 'text-primary-700 bg-primary-50' : 'text-gray-600 hover:bg-gray-50'
                      )}
                    >
                      {item.name}
                    </Link>
                  );
                })}
                {user ? (
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-white bg-primary rounded-lg text-center">
                    Panel Administrativo
                  </Link>
                ) : (
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-primary border border-primary rounded-lg text-center">
                    Iniciar Sesión
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Contenido principal */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="container-app py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-primary">
                  <img src={fredyLogo} alt="Fredy Arenas" className="h-full w-full object-cover" />
                </div>
                <div>
                  <p className="font-bold">Fredy Arenas</p>
                  <p className="text-sm text-gray-400">El Amigo de Caldas</p>
                </div>
              </div>
              <p className="text-sm text-gray-400 max-w-md">
                Diputado de la Asamblea Departamental de Caldas. Comprometidos con el emprendimiento, la seguridad, el deporte y la cultura para nuestros 27 municipios.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Enlaces</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/noticias" className="hover:text-white transition-colors">Noticias</Link></li>
                <li><Link to="/agenda" className="hover:text-white transition-colors">Agenda</Link></li>
                <li><Link to="/mapa" className="hover:text-white transition-colors">Mapa de Proyectos</Link></li>
                <li><Link to="/contacto" className="hover:text-white transition-colors">Contacto</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Contacto</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Manizales, Caldas</li>
                <li>contacto@elamigodecaldas.com</li>
                <li>Partido de la U</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Fredy Arenas - El Amigo de Caldas. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
