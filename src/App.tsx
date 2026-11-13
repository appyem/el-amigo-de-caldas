import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PublicLayout } from '@/app/layouts/PublicLayout';
import { AdminLayout } from '@/app/layouts/AdminLayout';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { RoleGuard } from '@/components/common/RoleGuard';
import { ToastProvider } from '@/components/ui/Toast';
import { ScrollToTop } from '@/components/common/ScrollToTop';
import { Home } from '@/app/routes/public/Home';
import { Login } from '@/app/routes/auth/Login';
import { Dashboard } from '@/app/routes/admin/Dashboard';
import { NewsList as AdminNewsList } from '@/app/routes/admin/NewsList';
import { AgendaList as AdminAgendaList } from '@/app/routes/admin/AgendaList';
import { ContactsList as AdminContactsList } from '@/app/routes/admin/ContactsList';
import { GalleryList as AdminGalleryList } from '@/app/routes/admin/GalleryList';
import { MapList as AdminMapList } from '@/app/routes/admin/MapList';
import { GamesList as AdminGamesList } from '@/app/routes/admin/GamesList';
import { SlidersList as AdminSlidersList } from '@/app/routes/admin/SlidersList';
import { NewsList as PublicNewsList } from '@/app/routes/public/NewsList';
import { NewsDetail } from '@/app/routes/public/NewsDetail';
import { AgendaList as PublicAgendaList } from '@/app/routes/public/AgendaList';
import { AgendaDetail } from '@/app/routes/public/AgendaDetail';
import { Contact as PublicContact } from '@/app/routes/public/Contact';
import { GalleryList as PublicGalleryList } from '@/app/routes/public/GalleryList';
import { MapView as PublicMapView } from '@/app/routes/public/MapView';
import { GameView as PublicGameView } from '@/app/routes/public/GameView';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider />
      <ScrollToTop />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/noticias" element={<PublicNewsList />} />
          <Route path="/noticias/:id" element={<NewsDetail />} />
          <Route path="/agenda" element={<PublicAgendaList />} />
          <Route path="/agenda/:id" element={<AgendaDetail />} />
          <Route path="/contacto" element={<PublicContact />} />
          <Route path="/galeria" element={<PublicGalleryList />} />
          <Route path="/mapa" element={<PublicMapView />} />
          <Route path="/juegos" element={<PublicGameView />} />
        </Route>

        <Route path="/login" element={<Login />} />

        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="noticias" element={<RoleGuard requiredRole="editor"><AdminNewsList /></RoleGuard>} />
          <Route path="agenda" element={<RoleGuard requiredRole="editor"><AdminAgendaList /></RoleGuard>} />
          <Route path="solicitudes" element={<RoleGuard requiredRole="editor"><AdminContactsList /></RoleGuard>} />
          <Route path="galeria" element={<RoleGuard requiredRole="editor"><AdminGalleryList /></RoleGuard>} />
          <Route path="mapa" element={<RoleGuard requiredRole="editor"><AdminMapList /></RoleGuard>} />
          <Route path="juegos" element={<RoleGuard requiredRole="editor"><AdminGamesList /></RoleGuard>} />
          <Route path="sliders" element={<RoleGuard requiredRole="editor"><AdminSlidersList /></RoleGuard>} />
          <Route path="usuarios" element={<RoleGuard requiredRole="admin"><div><h1 className="text-2xl font-bold">Gestión de Usuarios</h1><p className="mt-2 text-gray-600">Próximamente...</p></div></RoleGuard>} />
          <Route path="configuracion" element={<RoleGuard requiredRole="super_admin"><div><h1 className="text-2xl font-bold">Configuración</h1><p className="mt-2 text-gray-600">Próximamente...</p></div></RoleGuard>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
