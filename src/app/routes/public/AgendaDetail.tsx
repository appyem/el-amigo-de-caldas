import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/Card';
import { Loader } from '@/components/ui/Loader';
import { ErrorState } from '@/components/ui/ErrorState';
import { ShareButtons } from '@/components/common/ShareButtons';
import { useDynamicMeta } from '@/hooks/useDynamicMeta';
import { getAgendaById, AgendaEvent } from '@/services/firebase/agenda';
import { FiCalendar, FiMapPin, FiArrowLeft, FiClock } from 'react-icons/fi';

export function AgendaDetail() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<AgendaEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadEvent = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getAgendaById(id);
        if (data && data.status === 'published') setEvent(data);
        else setError('Este evento no existe o no está publicado.');
      } catch (err) {
        setError('Error al cargar el evento.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadEvent();
  }, [id]);

  // Actualizar meta tags dinámicamente con la imagen del evento
  useDynamicMeta({
    title: event ? `${event.title} | Agenda Freddy Arenas` : 'Cargando...',
    description: event ? `Evento en ${event.location}: ${event.description}` : 'Evento de Freddy Arenas',
    image: event?.imageUrl || undefined,
    url: typeof window !== 'undefined' ? window.location.href : undefined,
  });

  const formatDateTime = (dateField: any) => {
    if (!dateField) return 'No definida';
    const d = dateField instanceof Date ? dateField : dateField.toDate();
    return d.toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (loading) return <Loader variant="fullscreen" text="Cargando evento..." />;
  if (error || !event) return <ErrorState title="Evento no encontrado" description={error || 'El evento que buscas no existe.'} />;

  return (
    <div className="bg-slate-50 min-h-screen">
      <section className="relative overflow-hidden bg-slate-900 py-16">
        <div className="absolute inset-0 bg-party-gradient opacity-85" />
        <div className="container-app relative z-10">
          <Link to="/agenda" className="inline-flex items-center text-sm font-bold text-white/90 hover:text-white mb-6 transition-colors bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
            <FiArrowLeft className="mr-2 h-4 w-4" /> Volver a la agenda
          </Link>
        </div>
      </section>

      <div className="container-app -mt-12 relative z-10 pb-16">
        <motion.article initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-4xl mx-auto">
          <Card className="overflow-hidden shadow-2xl border-0">
            {event.imageUrl && (
              <div className="aspect-video w-full bg-slate-100 relative">
                <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            )}
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-wrap gap-3 mb-6">
                <div className="flex items-center gap-2 text-sm font-bold text-red-600 bg-red-50 px-4 py-2 rounded-full">
                  <FiCalendar className="h-4 w-4" />
                  <span>Inicio: {formatDateTime(event.startDate)}</span>
                </div>
                {event.endDate && (
                  <div className="flex items-center gap-2 text-sm font-bold text-green-700 bg-green-50 px-4 py-2 rounded-full">
                    <FiClock className="h-4 w-4" />
                    <span>Fin: {formatDateTime(event.endDate)}</span>
                  </div>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
                {event.title}
              </h1>

              {/* Botones de compartir debajo del título */}
              <div className="mb-8 pb-8 border-b border-slate-200">
                <ShareButtons
                  title={event.title}
                  description={`Evento en ${event.location} - Freddy Arenas El Amigo de Caldas`}
                  imageUrl={event.imageUrl}
                />
              </div>

              <div className="flex items-start gap-4 text-slate-700 mb-8 p-6 bg-gradient-to-br from-yellow-50 to-red-50 rounded-2xl border border-yellow-100">
                <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-white shadow-md flex items-center justify-center">
                  <FiMapPin className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-1">Ubicación</p>
                  <p className="text-lg text-slate-700">{event.location}</p>
                </div>
              </div>

              <div className="prose prose-lg max-w-none">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Descripción del evento</h3>
                <div className="whitespace-pre-wrap leading-relaxed text-slate-700 text-lg">
                  {event.description}
                </div>
              </div>

              {/* Botones de compartir al final también */}
              <div className="mt-12 pt-8 border-t border-slate-200">
                <p className="text-sm font-bold text-slate-700 mb-4">¿Te interesa este evento? Invita a otros:</p>
                <ShareButtons
                  title={event.title}
                  description={`Evento en ${event.location} - Freddy Arenas El Amigo de Caldas`}
                  imageUrl={event.imageUrl}
                />
              </div>
            </CardContent>
          </Card>
        </motion.article>
      </div>
    </div>
  );
}
