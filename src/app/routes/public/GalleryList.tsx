import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/Card';
import { Loader } from '@/components/ui/Loader';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { getPublishedGallery, GalleryItem } from '@/services/firebase/gallery';
import { FiImage } from 'react-icons/fi';

export function GalleryList() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadItems = async () => {
      try {
        setLoading(true);
        const data = await getPublishedGallery();
        setItems(data);
        setError('');
      } catch (err) {
        setError('Error al cargar la galería.');
      } finally {
        setLoading(false);
      }
    };
    loadItems();
  }, []);

  if (loading) return <Loader variant="fullscreen" text="Cargando galería..." />;
  if (error) return <ErrorState title="Error de conexión" description={error} onRetry={() => window.location.reload()} />;

  return (
    <div className="container-app py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Galería de Imágenes</h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Un recorrido visual por las obras, eventos y actividades en Caldas.
        </p>
      </div>

      {items.length === 0 ? (
        <Card><CardContent className="p-12"><EmptyState title="Galería vacía" description="Pronto añadiremos nuevas imágenes." /></CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((item, index) => (
            <motion.div key={item.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.05 }}>
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer">
                <div className="aspect-square w-full bg-gray-100 relative overflow-hidden">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300"><FiImage className="h-12 w-12" /></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div>
                      <p className="text-white font-semibold text-sm">{item.title}</p>
                      <p className="text-white/80 text-xs">{item.category}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
