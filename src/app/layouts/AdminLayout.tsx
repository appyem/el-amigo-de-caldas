import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import {
  FiHome, FiFileText, FiCalendar, FiMap, FiImage, FiGrid, FiUsers, FiSettings, FiMenu, FiX, FiLogOut, FiBell, FiMail
} from 'react-icons/fi';
import { logout } from '@/services/firebase/auth';
import toast from 'react-hot-toast';

const adminNavigation = [
  { name: 'Dashboard', href: '/admin', icon: FiHome },
  { name: 'Noticias', href: '/admin/noticias', icon: FiFileText },
  { name: 'Agenda', href: '/admin/agenda', icon: FiCalendar },
  { name: 'Solicitudes', href: '/admin/solicitudes', icon: FiMail },
  { name: 'Sliders Header', href: '/admin/sliders', icon: FiImage },
  { name: 'Mapa', href: '/admin/mapa', icon: FiMap },
  { name: 'Galería', href: '/admin/galeria', icon: FiImage },
  { name: 'Juegos', href: '/admin/juegos', icon: FiGrid },
  { name: 'Usuarios', href: '/admin/usuarios', icon: FiUsers },
  { name: 'Configuración', href: '/admin/configuracion', icon: FiSettings },
];

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Sesión cerrada correctamente');
      navigate('/login');
    } catch (error) {
      toast.error('Error al cerrar sesión');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}
      </AnimatePresence>

      <aside className={cn('fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto', sidebarOpen ? 'translate-x-0' : '-translate-x-full')}>
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-6">
          <Link to="/admin" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold text-sm">AC</div>
            <span className="text-sm font-bold text-gray-900">Admin</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden rounded-lg p-1 text-gray-400 hover:bg-gray-100"><FiX className="h-5 w-5" /></button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <ul className="space-y-1">
            {adminNavigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.name}>
                  <Link to={item.href} onClick={() => setSidebarOpen(false)} className={cn('flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors', isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900')}>
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-gray-200 p-4">
          <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-700 transition-colors">
            <FiLogOut className="h-5 w-5" /> Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100"><FiMenu className="h-5 w-5" /></button>
          <div className="flex items-center gap-4 ml-auto">
            <button className="relative rounded-lg p-2 text-gray-600 hover:bg-gray-100 transition-colors"><FiBell className="h-5 w-5" /><span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" /></button>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-sm font-medium">FA</div>
              <div className="hidden sm:block"><p className="text-sm font-medium text-gray-900">Freddy Arenas</p><p className="text-xs text-gray-500">Administrador</p></div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6"><Outlet /></main>
      </div>
    </div>
  );
}
