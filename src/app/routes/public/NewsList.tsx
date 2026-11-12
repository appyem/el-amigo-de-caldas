import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/Card';
import { Loader } from '@/components/ui/Loader';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { getPublishedNews, News } from '@/services/firebase/news';
import { FiCalendar, FiArrowRight, FiFileText } from 'react-icons/fi';

export function NewsList() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        const data = await getPublishedNews();
        setNews(data);
        setError('');
      } catch (err) {
        setError('Error al cargar las noticias. Por favor, intenta de nuevo.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadNews();
  }, []);

  if (loading) return <Loader variant="fullscreen" text="Cargando noticias..." />;
  if (error) return <ErrorState title="Error de conexión" description={error} onRetry={() => window.location.reload()} />;

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header vibrante */}
      <section className="relative overflow-hidden bg-slate-900 py-20">
        <div className="absolute inset-0 bg-party-gradient opacity-85" />
        <div className="absolute inset-0 bg-grid-pattern opacity-15" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-yellow-400/30 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4" />
        <div className="container-app relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-white uppercase bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <FiFileText className="text-yellow-300" /> Información y Actualidad
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight">
              Noticias y <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-white">Actualidad</span>
            </h1>
            <p className="mt-6 text-xl text-white/90 max-w-2xl mx-auto font-light">
              Mantente informado sobre las últimas acciones, proyectos y eventos en los municipios de Caldas.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="container-app py-16">
        {news.length === 0 ? (
          <Card><CardContent className="p-12"><EmptyState title="No hay noticias publicadas" description="Pronto compartiremos nuevas actualizaciones. ¡Vuelve pronto!" /></CardContent></Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item, index) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }}>
                <Link to={`/noticias/${item.id}`} className="block h-full group">
                  <div className="relative bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border border-slate-100 h-full flex flex-col">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-yellow-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
                    <div className="aspect-video w-full bg-slate-100 overflow-hidden relative">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300"><FiFileText className="h-16 w-16" /></div>
                      )}
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-red-600 shadow-md">
                        <FiCalendar className="inline h-3 w-3 mr-1" />
                        {item.date instanceof Date ? item.date.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' }) : 'Fecha'}
                      </div>
                    </div>
                    <CardContent className="p-6 flex flex-col flex-1 relative z-10">
                      <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-red-600 transition-colors">{item.title}</h3>
                      <p className="text-sm text-slate-600 line-clamp-3 mb-4 flex-1">{item.summary}</p>
                      <div className="flex items-center text-sm font-bold text-red-600 group-hover:translate-x-1 transition-transform">
                        Leer más <FiArrowRight className="ml-1 h-4 w-4" />
                      </div>
                    </CardContent>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
