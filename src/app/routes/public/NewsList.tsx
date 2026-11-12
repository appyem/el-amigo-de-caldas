import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/Card';
import { Loader } from '@/components/ui/Loader';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { getPublishedNews, News } from '@/services/firebase/news';
import { FiCalendar, FiArrowRight } from 'react-icons/fi';

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
    <div className="container-app py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Noticias y Actualidad</h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Mantente informado sobre las últimas acciones, proyectos y eventos en los municipios de Caldas.
        </p>
      </div>

      {news.length === 0 ? (
        <Card>
          <CardContent className="p-12">
            <EmptyState 
              title="No hay noticias publicadas" 
              description="Pronto compartiremos nuevas actualizaciones. ¡Vuelve pronto!"
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/noticias/${item.id}`} className="block h-full">
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
                  <div className="aspect-video w-full bg-gray-100 overflow-hidden">
                    {item.imageUrl ? (
                      <img 
                        src={item.imageUrl} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <FiCalendar className="h-12 w-12" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6 flex flex-col h-[calc(100%-12rem)]">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                      <FiCalendar className="h-3 w-3" />
                      <span>
                        {item.date instanceof Date 
                          ? item.date.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })
                          : 'Fecha no disponible'}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-1">
                      {item.summary}
                    </p>
                    <div className="flex items-center text-sm font-semibold text-primary group-hover:translate-x-1 transition-transform">
                      Leer más <FiArrowRight className="ml-1 h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
