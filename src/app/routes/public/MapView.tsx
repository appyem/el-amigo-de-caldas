import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { Card, CardContent } from '@/components/ui/Card';
import { Loader } from '@/components/ui/Loader';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { getPublishedMapProjects, MapProject } from '@/services/firebase/map';
import { FiMapPin, FiNavigation } from 'react-icons/fi';
import 'leaflet/dist/leaflet.css';

const markerIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export function MapView() {
  const [projects, setProjects] = useState<MapProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    const load = async () => {
      try { setLoading(true); setProjects(await getPublishedMapProjects()); }
      catch (err) { setError('Error al cargar el mapa'); console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  useEffect(() => {
    if (loading || error || projects.length === 0 || !mapRef.current) return;
    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView([5.2, -75.5], 9);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
        maxZoom: 19,
      }).addTo(mapInstance.current);
    }
    const map = mapInstance.current;
    const markers: L.Marker[] = [];
    projects.forEach((project) => {
      const container = document.createElement('div');
      container.style.maxWidth = '220px';
      if (project.imageUrl) {
        const img = document.createElement('img');
        img.src = project.imageUrl;
        img.alt = project.title;
        img.style.cssText = 'width:100%;height:110px;object-fit:cover;border-radius:8px;margin-bottom:6px;';
        container.appendChild(img);
      }
      const title = document.createElement('h3');
      title.textContent = project.title;
      title.style.cssText = 'font-weight:700;color:#111827;margin:0 0 2px;font-size:14px;';
      container.appendChild(title);
      const meta = document.createElement('p');
      meta.textContent = `${project.municipality} • ${project.category}`;
      meta.style.cssText = 'font-size:11px;color:#6b7280;margin:0 0 4px;';
      container.appendChild(meta);
      const desc = document.createElement('p');
      desc.textContent = project.description;
      desc.style.cssText = 'font-size:12px;color:#374151;margin:0;';
      container.appendChild(desc);
      const marker = L.marker([project.lat, project.lng], { icon: markerIcon }).addTo(map).bindPopup(container);
      markers.push(marker);
    });
    if (markers.length > 0) {
      const group = L.featureGroup(markers);
      map.fitBounds(group.getBounds().pad(0.2));
    }
    setTimeout(() => map.invalidateSize(), 100);
    return () => { markers.forEach(m => m.remove()); };
  }, [loading, error, projects]);

  useEffect(() => {
    return () => { mapInstance.current?.remove(); mapInstance.current = null; };
  }, []);

  if (loading) return <Loader variant="fullscreen" text="Cargando mapa..." />;
  if (error) return <ErrorState title="Error" description={error} onRetry={() => window.location.reload()} />;

  return (
    <div className="bg-slate-50 min-h-screen">
      <section className="relative overflow-hidden bg-slate-900 py-20">
        <div className="absolute inset-0 bg-party-gradient opacity-85" />
        <div className="absolute inset-0 bg-grid-pattern opacity-15" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/30 rounded-full blur-[100px] translate-y-1/2 translate-x-1/4" />
        <div className="container-app relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-white uppercase bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <FiNavigation className="text-yellow-300" /> Geolocalización
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight">
              Mapa de <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-white">Proyectos</span>
            </h1>
            <p className="mt-6 text-xl text-white/90 max-w-2xl mx-auto font-light">
              Explora las obras y proyectos en los municipios de Caldas.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="container-app py-16">
        {projects.length === 0 ? (
          <Card><CardContent className="p-12"><EmptyState title="Mapa vacío" description="Pronto publicaremos proyectos en el mapa." /></CardContent></Card>
        ) : (
          <>
            <div className="rounded-3xl overflow-hidden border-4 border-white shadow-2xl">
              <div ref={mapRef} style={{ height: '600px', width: '100%' }} />
            </div>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white shadow-md"><FiMapPin className="h-7 w-7" /></div>
                  <div><p className="text-3xl font-black text-slate-900">{projects.length}</p><p className="text-sm text-slate-500 font-medium">Proyectos publicados</p></div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-white shadow-md"><FiMapPin className="h-7 w-7" /></div>
                  <div><p className="text-3xl font-black text-slate-900">{new Set(projects.map(p => p.municipality)).size}</p><p className="text-sm text-slate-500 font-medium">Municipios alcanzados</p></div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white shadow-md"><FiMapPin className="h-7 w-7" /></div>
                  <div><p className="text-3xl font-black text-slate-900">{new Set(projects.map(p => p.category)).size}</p><p className="text-sm text-slate-500 font-medium">Categorías de proyecto</p></div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
