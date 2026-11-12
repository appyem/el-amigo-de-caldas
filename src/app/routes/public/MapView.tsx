import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { Card, CardContent } from '@/components/ui/Card';
import { Loader } from '@/components/ui/Loader';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { getPublishedMapProjects, MapProject } from '@/services/firebase/map';
import { FiMapPin } from 'react-icons/fi';
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
      try {
        setLoading(true);
        setProjects(await getPublishedMapProjects());
      } catch (err) {
        setError('Error al cargar el mapa');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (loading || error || projects.length === 0 || !mapRef.current) return;

    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView([5.2, -75.5], 9);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
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
        img.style.cssText = 'width:100%;height:110px;object-fit:cover;border-radius:6px;margin-bottom:6px;';
        container.appendChild(img);
      }

      const title = document.createElement('h3');
      title.textContent = project.title;
      title.style.cssText = 'font-weight:700;color:#111827;margin:0 0 2px;';
      container.appendChild(title);

      const meta = document.createElement('p');
      meta.textContent = `${project.municipality} • ${project.category}`;
      meta.style.cssText = 'font-size:11px;color:#6b7280;margin:0 0 4px;';
      container.appendChild(meta);

      const desc = document.createElement('p');
      desc.textContent = project.description;
      desc.style.cssText = 'font-size:13px;color:#374151;margin:0;';
      container.appendChild(desc);

      const marker = L.marker([project.lat, project.lng], { icon: markerIcon })
        .addTo(map)
        .bindPopup(container);
      markers.push(marker);
    });

    if (markers.length > 0) {
      const group = L.featureGroup(markers);
      map.fitBounds(group.getBounds().pad(0.2));
    }

    setTimeout(() => map.invalidateSize(), 100);

    return () => {
      markers.forEach(m => m.remove());
    };
  }, [loading, error, projects]);

  useEffect(() => {
    return () => {
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
  }, []);

  if (loading) return <Loader variant="fullscreen" text="Cargando mapa..." />;
  if (error) return <ErrorState title="Error" description={error} onRetry={() => window.location.reload()} />;

  return (
    <div className="container-app py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Mapa de Proyectos</h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Explora las obras y proyectos en los municipios de Caldas.
        </p>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="p-12">
            <EmptyState title="Mapa vacío" description="Pronto publicaremos proyectos en el mapa." />
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="rounded-xl overflow-hidden border border-gray-200 shadow-lg">
            <div ref={mapRef} style={{ height: '600px', width: '100%' }} />
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700"><FiMapPin className="h-5 w-5" /></div>
                <div><p className="text-2xl font-bold text-gray-900">{projects.length}</p><p className="text-sm text-gray-500">Proyectos publicados</p></div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-secondary-100 flex items-center justify-center text-secondary-700"><FiMapPin className="h-5 w-5" /></div>
                <div><p className="text-2xl font-bold text-gray-900">{new Set(projects.map(p => p.municipality)).size}</p><p className="text-sm text-gray-500">Municipios alcanzados</p></div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-accent-100 flex items-center justify-center text-accent-700"><FiMapPin className="h-5 w-5" /></div>
                <div><p className="text-2xl font-bold text-gray-900">{new Set(projects.map(p => p.category)).size}</p><p className="text-sm text-gray-500">Categorías de proyecto</p></div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
