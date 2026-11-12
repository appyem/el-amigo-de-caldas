import { useState, useEffect } from 'react';
import { Timestamp } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Loader } from '@/components/ui/Loader';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { AgendaEvent, getAgenda, createAgenda, updateAgenda, deleteAgenda } from '@/services/firebase/agenda';
import { AgendaForm } from '@/components/admin/AgendaForm';
import { FiPlus, FiEdit2, FiTrash2, FiCalendar } from 'react-icons/fi';
import toast from 'react-hot-toast';

export function AgendaList() {
  const [events, setEvents] = useState<AgendaEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AgendaEvent | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await getAgenda();
      setEvents(data);
      setError('');
    } catch (err) {
      setError('Error al cargar la agenda');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadEvents(); }, []);

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      const dataToSave = {
        ...formData,
        startDate: Timestamp.fromDate(new Date(formData.startDate)),
        endDate: Timestamp.fromDate(new Date(formData.endDate)),
      };
      if (editingEvent?.id) {
        await updateAgenda(editingEvent.id, dataToSave);
        toast.success('Evento actualizado');
      } else {
        await createAgenda(dataToSave);
        toast.success('Evento creado');
      }
      setIsModalOpen(false);
      setEditingEvent(null);
      await loadEvents();
    } catch (err) {
      toast.error('Error al guardar');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Eliminar este evento?')) return;
    try {
      await deleteAgenda(id);
      toast.success('Evento eliminado');
      await loadEvents();
    } catch (err) {
      toast.error('Error al eliminar');
    }
  };

  if (loading) return <Loader variant="fullscreen" text="Cargando agenda..." />;
  if (error) return <ErrorState title="Error" description={error} onRetry={loadEvents} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Agenda</h1>
          <p className="text-sm text-gray-500 mt-1">Administra los eventos y actividades</p>
        </div>
        <Button onClick={() => { setEditingEvent(null); setIsModalOpen(true); }}>
          <FiPlus className="mr-2 h-4 w-4" /> Nuevo Evento
        </Button>
      </div>

      {events.length === 0 ? (
        <Card><CardContent className="p-12"><EmptyState title="No hay eventos" description="Crea el primer evento de la agenda." action={<Button onClick={() => setIsModalOpen(true)}>Crear evento</Button>} /></CardContent></Card>
      ) : (
        <div className="grid gap-4">
          {events.map((item, index) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {item.imageUrl ? <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" /> : <FiCalendar className="h-6 w-6 text-gray-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-semibold text-gray-900 truncate">{item.title}</h3>
                        <Badge variant={item.status === 'published' ? 'success' : 'warning'}>{item.status === 'published' ? 'Publicado' : 'Borrador'}</Badge>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{item.location}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {item.startDate instanceof Date ? item.startDate.toLocaleString() : 'Fecha no disponible'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="sm" onClick={() => { setEditingEvent(item); setIsModalOpen(true); }}><FiEdit2 className="h-4 w-4" /></Button>
                    <Button variant="danger" size="sm" onClick={() => item.id && handleDelete(item.id)}><FiTrash2 className="h-4 w-4" /></Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingEvent(null); }} title={editingEvent ? 'Editar Evento' : 'Nuevo Evento'} size="lg">
        <AgendaForm initialData={editingEvent} onSubmit={handleSubmit} onCancel={() => { setIsModalOpen(false); setEditingEvent(null); }} isLoading={isSubmitting} />
      </Modal>
    </div>
  );
}
