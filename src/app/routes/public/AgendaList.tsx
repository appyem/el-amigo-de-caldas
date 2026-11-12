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
        setError('Error al cargar la agenda.');
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
    <div className="bg-slate-50 min-h-screen">
      <section className="relative overflow-hidden bg-slate-900 py-20">
        <div className="absolute inset-0 bg-party-gradient opacity-85" />
        <div className="absolute inset-0 bg-grid-pattern opacity-15" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-green-500/30 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />
        <div className="container-app relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-white uppercase bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <FiCalendar className="text-yellow-300" /> Actividades y Encuentros
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight">
              Agenda de <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-white">Actividades</span>
            </h1>
            <p className="mt-6 text-xl text-white/90 max-w-2xl mx-auto font-light">
              Conoce los próximos eventos, reuniones y actividades en los municipios de Caldas.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="container-app py-16">
        {events.length === 0 ? (
          <Card><CardContent className="p-12"><EmptyState title="No hay eventos programados" description="Pronto anunciaremos nuevas actividades. ¡Mantente atento!" /></CardContent></Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((item, index) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }}>
                <Link to={`/agenda/${item.id}`} className="block h-full group">
                  <div className="relative bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border border-slate-100 h-full flex flex-col">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-500 via-yellow-400 to-green-500" />
                    <div className="aspect-video w-full bg-slate-100 overflow-hidden relative">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300"><FiCalendar className="h-16 w-16" /></div>
                      )}
                    </div>
                    <CardContent className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-red-600 bg-red-50 w-fit px-3 py-1.5 rounded-full mb-4">
                        <FiCalendar className="h-3 w-3" />
                        <span>{formatDate(item.startDate).split(' a las ')[0]}</span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-red-600 transition-colors">{item.title}</h3>
                      <div className="flex items-start gap-2 text-sm text-slate-600 mb-4 flex-1">
                        <FiMapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-600" />
                        <span className="line-clamp-2">{item.location}</span>
                      </div>
                      <div className="flex items-center text-sm font-bold text-red-600 group-hover:translate-x-1 transition-transform mt-auto">
                        Ver detalles <FiArrowRight className="ml-1 h-4 w-4" />
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
