import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PublicLayout } from '@/app/layouts/PublicLayout';
import { AdminLayout } from '@/app/layouts/AdminLayout';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { RoleGuard } from '@/components/common/RoleGuard';
import { ToastProvider } from '@/components/ui/Toast';
import { Home } from '@/app/routes/public/Home';
import { Login } from '@/app/routes/auth/Login';
import { Dashboard } from '@/app/routes/admin/Dashboard';
import { NewsList as AdminNewsList } from '@/app/routes/admin/NewsList';
import { NewsList as PublicNewsList } from '@/app/routes/public/NewsList';
import { NewsDetail } from '@/app/routes/public/NewsDetail';
import { AgendaList as PublicAgendaList } from '@/app/routes/public/AgendaList';
import { AgendaDetail } from '@/app/routes/public/AgendaDetail';
import { AgendaList as AdminAgendaList } from '@/app/routes/admin/AgendaList';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/noticias" element={<PublicNewsList />} />
          <Route path="/noticias/:id" element={<NewsDetail />} />
          <Route path="/agenda" element={<PublicAgendaList />} />
          <Route path="/agenda/:id" element={<AgendaDetail />} />
          <Route path="/mapa" element={<div className="container-app py-12"><h1 className="text-3xl font-bold">Mapa</h1><p className="mt-4 text-gray-600">Próximamente...</p></div>} />
          <Route path="/galeria" element={<div className="container-app py-12"><h1 className="text-3xl font-bold">Galería</h1><p className="mt-4 text-gray-600">Próximamente...</p></div>} />
          <Route path="/juegos" element={<div className="container-app py-12"><h1 className="text-3xl font-bold">Juegos</h1><p className="mt-4 text-gray-600">Próximamente...</p></div>} />
          <Route path="/contacto" element={<div className="container-app py-12"><h1 className="text-3xl font-bold">Contacto</h1><p className="mt-4 text-gray-600">Próximamente...</p></div>} />
        </Route>

        <Route path="/login" element={<Login />} />

        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="noticias" element={
            <RoleGuard requiredRole="editor">
              <AdminNewsList />
            </RoleGuard>
          } />
          <Route path="agenda" element={
            <RoleGuard requiredRole="editor">
              <AdminAgendaList />
            </RoleGuard>
          } />
          <Route path="mapa" element={
            <RoleGuard requiredRole="editor">
              <div><h1 className="text-2xl font-bold">Gestión de Mapa</h1><p className="mt-2 text-gray-600">Próximamente...</p></div>
            </RoleGuard>
          } />
          <Route path="galeria" element={
            <RoleGuard requiredRole="editor">
              <div><h1 className="text-2xl font-bold">Gestión de Galería</h1><p className="mt-2 text-gray-600">Próximamente...</p></div>
            </RoleGuard>
          } />
          <Route path="juegos" element={
            <RoleGuard requiredRole="editor">
              <div><h1 className="text-2xl font-bold">Gestión de Juegos</h1><p className="mt-2 text-gray-600">Próximamente...</p></div>
            </RoleGuard>
          } />
          <Route path="usuarios" element={
            <RoleGuard requiredRole="admin">
              <div><h1 className="text-2xl font-bold">Gestión de Usuarios</h1><p className="mt-2 text-gray-600">Próximamente...</p></div>
            </RoleGuard>
          } />
          <Route path="configuracion" element={
            <RoleGuard requiredRole="super_admin">
              <div><h1 className="text-2xl font-bold">Configuración</h1><p className="mt-2 text-gray-600">Próximamente...</p></div>
            </RoleGuard>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
