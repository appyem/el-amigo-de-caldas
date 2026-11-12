import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Loader } from '@/components/ui/Loader';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { Slider, getSliders, createSlider, updateSlider, deleteSlider } from '@/services/firebase/sliders';
import { SliderForm } from '@/components/admin/SliderForm';
import { FiPlus, FiEdit2, FiTrash2, FiImage } from 'react-icons/fi';
import toast from 'react-hot-toast';

export function SlidersList() {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Slider | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadSliders = async () => {
    try { setLoading(true); setSliders(await getSliders()); setError(''); }
    catch (err) { setError('Error al cargar sliders'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadSliders(); }, []);

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      if (editingItem?.id) { await updateSlider(editingItem.id, formData); toast.success('Slider actualizado'); }
      else { await createSlider(formData); toast.success('Slider creado'); }
      setIsModalOpen(false); setEditingItem(null); await loadSliders();
    } catch (err) { toast.error('Error al guardar'); }
    finally { setIsSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Eliminar este slider?')) return;
    try { await deleteSlider(id); toast.success('Slider eliminado'); await loadSliders(); }
    catch (err) { toast.error('Error al eliminar'); }
  };

  if (loading) return <Loader variant="fullscreen" text="Cargando sliders..." />;
  if (error) return <ErrorState title="Error" description={error} onRetry={loadSliders} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Sliders del Header</h1>
          <p className="text-sm text-gray-500 mt-1">Administra las imágenes rotativas de la portada</p>
        </div>
        <Button onClick={() => { setEditingItem(null); setIsModalOpen(true); }}><FiPlus className="mr-2 h-4 w-4" /> Nuevo Slider</Button>
      </div>

      {sliders.length === 0 ? (
        <Card><CardContent className="p-12"><EmptyState title="No hay sliders" description="Agrega la primera imagen del carrusel." action={<Button onClick={() => setIsModalOpen(true)}>Crear slider</Button>} /></CardContent></Card>
      ) : (
        <div className="grid gap-4">
          {sliders.map((item, index) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="h-16 w-24 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {item.imageUrl ? <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" /> : <FiImage className="h-6 w-6 text-gray-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-semibold text-gray-900 truncate">{item.title}</h3>
                        <Badge variant={item.status === 'published' ? 'success' : 'warning'}>{item.status === 'published' ? 'Publicado' : 'Borrador'}</Badge>
                        <span className="text-xs text-gray-400">Orden: {item.order}</span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{item.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="sm" onClick={() => { setEditingItem(item); setIsModalOpen(true); }}><FiEdit2 className="h-4 w-4" /></Button>
                    <Button variant="danger" size="sm" onClick={() => item.id && handleDelete(item.id)}><FiTrash2 className="h-4 w-4" /></Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingItem(null); }} title={editingItem ? 'Editar Slider' : 'Nuevo Slider'} size="lg">
        <SliderForm initialData={editingItem} onSubmit={handleSubmit} onCancel={() => { setIsModalOpen(false); setEditingItem(null); }} isLoading={isSubmitting} />
      </Modal>
    </div>
  );
}
