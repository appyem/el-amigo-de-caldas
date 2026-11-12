import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/Card';
import { Loader } from '@/components/ui/Loader';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { getPublishedAgenda, AgendaEvent } from '@/services/firebase/agenda';
import { FiCalendar, FiMapPin, FiArrowRight } from 'react-icons/fi';

export function AgendaList() {
  const [events, setEvents] = useState<AgendaEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const data = await getPublishedAgenda();
        setEvents(data);
        setError('');
      } catch (err) {
        setError('Error al cargar la agenda. Por favor, intenta de nuevo.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  const formatDate = (dateField: any) => {
    if (!dateField) return 'Fecha no disponible';
    const d = dateField instanceof Date ? dateField : dateField.toDate();
    return d.toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (loading) return <Loader variant="fullscreen" text="Cargando eventos..." />;
  if (error) return <ErrorState title="Error de conexión" description={error} onRetry={() => window.location.reload()} />;

  return (
    <div className="container-app py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Agenda de Actividades</h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Conoce los próximos eventos, reuniones y actividades en los municipios de Caldas.
        </p>
      </div>

      {events.length === 0 ? (
        <Card>
          <CardContent className="p-12">
            <EmptyState 
              title="No hay eventos programados" 
              description="Pronto anunciaremos nuevas actividades. ¡Mantente atento!"
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/agenda/${item.id}`} className="block h-full">
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
                    <div className="flex items-center gap-2 text-xs text-primary-700 font-medium mb-3 bg-primary-50 w-fit px-2 py-1 rounded">
                      <FiCalendar className="h-3 w-3" />
                      <span>{formatDate(item.startDate).split(' a las ')[0]}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <div className="flex items-start gap-2 text-sm text-gray-600 mb-4">
                      <FiMapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">{item.location}</span>
                    </div>
                    <div className="mt-auto flex items-center text-sm font-semibold text-primary group-hover:translate-x-1 transition-transform">
                      Ver detalles <FiArrowRight className="ml-1 h-4 w-4" />
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
