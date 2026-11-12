import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/Card';
import { Loader } from '@/components/ui/Loader';
import { ErrorState } from '@/components/ui/ErrorState';
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
        if (data && data.status === 'published') {
          setEvent(data);
        } else {
          setError('Este evento no existe o no está publicado.');
        }
      } catch (err) {
        setError('Error al cargar el evento.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadEvent();
  }, [id]);

  const formatDateTime = (dateField: any) => {
    if (!dateField) return 'No definida';
    const d = dateField instanceof Date ? dateField : dateField.toDate();
    return d.toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (loading) return <Loader variant="fullscreen" text="Cargando evento..." />;
  if (error || !event) return <ErrorState title="Evento no encontrado" description={error || 'El evento que buscas no existe.'} />;

  return (
    <div className="container-app py-12">
      <Link to="/agenda" className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-primary mb-8 transition-colors">
        <FiArrowLeft className="mr-2 h-4 w-4" /> Volver a la agenda
      </Link>

      <motion.article 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <Card className="overflow-hidden">
          {event.imageUrl && (
            <div className="aspect-video w-full bg-gray-100">
              <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
            </div>
          )}
          <CardContent className="p-8 md:p-12">
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2 text-sm font-medium text-primary-700 bg-primary-50 px-3 py-1.5 rounded-full">
                <FiCalendar className="h-4 w-4" />
                <span>Inicio: {formatDateTime(event.startDate)}</span>
              </div>
              {event.endDate && (
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full">
                  <FiClock className="h-4 w-4" />
                  <span>Fin: {formatDateTime(event.endDate)}</span>
                </div>
              )}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {event.title}
            </h1>
            
            <div className="flex items-start gap-3 text-gray-700 mb-8 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <FiMapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-900">Ubicación</p>
                <p className="text-gray-600">{event.location}</p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none text-gray-700">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Descripción del evento</h3>
              <div className="whitespace-pre-wrap leading-relaxed">
                {event.description}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.article>
    </div>
  );
}
