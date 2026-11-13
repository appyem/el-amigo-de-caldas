import { Link, Outlet, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import { FiMenu, FiX, FiUser, FiLogIn } from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import FreddyLogo from '@/assets/Freddy-arenas.jpg';
import partidoLogo from '@/assets/partido-u.jpeg';

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
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Barra superior con degradado del partido */}
      <div className="h-1.5 w-full bg-party-gradient" />
      
      {/* Header Glassmorphic */}
      <header className={cn(
        "sticky top-0 z-40 transition-all duration-300 border-b",
        scrolled ? "glass border-slate-200/50 shadow-lg py-2" : "bg-white/90 border-slate-100 py-3"
      )}>
        <div className="container-app">
          <div className="flex h-12 items-center justify-between">
            {/* Logo con foto de Freddy + texto SIEMPRE visible */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="relative">
                <div className="absolute inset-0 bg-party-gradient rounded-full blur-md opacity-50 group-hover:opacity-80 transition-opacity" />
                <div className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-white shadow-md flex-shrink-0">
                  <img src={FreddyLogo} alt="Freddy Arenas" className="h-full w-full object-cover" />
                </div>
              </div>
              <div className="flex flex-col leading-tight">
                <p className="text-sm font-black text-slate-900 tracking-tight">Freddy Arenas</p>
                <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider">El Amigo de Caldas</p>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-1 bg-slate-100/50 p-1 rounded-xl border border-slate-200/50">
              {publicNavigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200',
                      isActive 
                        ? 'bg-white text-red-600 shadow-sm' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                    )}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              {user ? (
                <Link to="/admin">
                  <button className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-party-gradient rounded-xl hover:opacity-90 transition-opacity shadow-md">
                    <FiUser className="h-4 w-4" /> Panel
                  </button>
                </Link>
              ) : (
                <Link to="/login">
                  <button className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-600 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 transition-colors">
                    <FiLogIn className="h-4 w-4" /> Ingresar
                  </button>
                </Link>
              )}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden rounded-xl p-2 text-slate-600 hover:bg-slate-100 transition-colors"
              >
                {mobileMenuOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
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
              className="lg:hidden border-t border-slate-200 bg-white overflow-hidden"
            >
              <div className="container-app py-4 space-y-1">
                {publicNavigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        'block px-4 py-3 text-sm font-semibold rounded-xl transition-colors',
                        isActive ? 'text-red-600 bg-red-50' : 'text-slate-600 hover:bg-slate-50'
                      )}
                    >
                      {item.name}
                    </Link>
                  );
                })}
                {user ? (
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-bold text-white bg-party-gradient rounded-xl text-center mt-4">
                    Panel Administrativo
                  </Link>
                ) : (
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-bold text-red-600 border border-red-200 rounded-xl text-center mt-4">
                    Iniciar Sesión
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer Premium */}
      <footer className="bg-slate-900 text-white mt-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-party-gradient" />
        <div className="container-app py-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500 rounded-full blur-md opacity-40" />
                  <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-white/20 shadow-xl">
                    <img src={FreddyLogo} alt="Freddy Arenas" className="h-full w-full object-cover" />
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-yellow-400 rounded-full blur-md opacity-40" />
                  <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-white/20 shadow-xl">
                    <img src={partidoLogo} alt="Partido de la U" className="h-full w-full object-cover" />
                  </div>
                </div>
                <div>
                  <p className="text-xl font-black tracking-tight">Freddy Arenas</p>
                  <p className="text-sm text-slate-400 font-medium">El Amigo de Caldas</p>
                  <p className="text-xs font-bold text-yellow-400 uppercase tracking-wider mt-1">Partido de la U</p>
                </div>
              </div>
              <p className="text-sm text-slate-400 max-w-md leading-relaxed">
                Diputado de la Asamblea Departamental de Caldas. Comprometidos con el emprendimiento, la seguridad, el deporte y la cultura para nuestros 27 municipios.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Navegación</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><Link to="/noticias" className="hover:text-yellow-400 transition-colors">Noticias</Link></li>
                <li><Link to="/agenda" className="hover:text-yellow-400 transition-colors">Agenda</Link></li>
                <li><Link to="/mapa" className="hover:text-yellow-400 transition-colors">Mapa de Proyectos</Link></li>
                <li><Link to="/contacto" className="hover:text-yellow-400 transition-colors">Contacto</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Contacto</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li>Manizales, Caldas</li>
                <li>contacto@elamigodecaldas.com</li>
                <li className="text-yellow-400 font-semibold">Partido Social de Unidad Nacional</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} Freddy Arenas - El Amigo de Caldas. Todos los derechos reservados.</p>
            <p>Diseñado con los colores del <span className="text-yellow-400 font-bold">Partido de la U</span> 🇨🇴</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
