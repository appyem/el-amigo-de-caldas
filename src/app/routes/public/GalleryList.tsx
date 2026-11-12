import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/Card';
import { Loader } from '@/components/ui/Loader';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { getPublishedGallery, GalleryItem } from '@/services/firebase/gallery';
import { FiImage, FiCamera } from 'react-icons/fi';

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
    <div className="bg-slate-50 min-h-screen">
      <section className="relative overflow-hidden bg-slate-900 py-20">
        <div className="absolute inset-0 bg-party-gradient opacity-85" />
        <div className="absolute inset-0 bg-grid-pattern opacity-15" />
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-red-500/30 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/4" />
        <div className="container-app relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-white uppercase bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <FiCamera className="text-yellow-300" /> Recorrido Visual
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight">
              Galería de <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-white">Imágenes</span>
            </h1>
            <p className="mt-6 text-xl text-white/90 max-w-2xl mx-auto font-light">
              Un recorrido visual por las obras, eventos y actividades en Caldas.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="container-app py-16">
        {items.length === 0 ? (
          <Card><CardContent className="p-12"><EmptyState title="Galería vacía" description="Pronto añadiremos nuevas imágenes." /></CardContent></Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {items.map((item, index) => (
              <motion.div key={item.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.05 }}>
                <div className="group relative aspect-square rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-100"><FiImage className="h-12 w-12" /></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-70 group-hover:opacity-100 transition-opacity flex items-end p-5">
                    <div>
                      <p className="text-white font-bold text-base leading-tight">{item.title}</p>
                      <p className="text-yellow-300 text-xs font-bold uppercase tracking-wider mt-1">{item.category}</p>
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 h-10 w-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <FiImage className="h-5 w-5 text-white" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
