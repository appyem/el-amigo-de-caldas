import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Loader } from '@/components/ui/Loader';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { MapProject, getMapProjects, createMapProject, updateMapProject, deleteMapProject } from '@/services/firebase/map';
import { MapForm } from '@/components/admin/MapForm';
import { FiPlus, FiEdit2, FiTrash2, FiMapPin } from 'react-icons/fi';
import toast from 'react-hot-toast';

export function MapList() {
  const [projects, setProjects] = useState<MapProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MapProject | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadProjects = async () => {
    try { setLoading(true); setProjects(await getMapProjects()); setError(''); }
    catch (err) { setError('Error al cargar proyectos'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadProjects(); }, []);

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      if (editingItem?.id) { await updateMapProject(editingItem.id, formData); toast.success('Proyecto actualizado'); }
      else { await createMapProject(formData); toast.success('Proyecto creado'); }
      setIsModalOpen(false); setEditingItem(null); await loadProjects();
    } catch (err) { toast.error('Error al guardar'); }
    finally { setIsSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Eliminar este proyecto?')) return;
    try { await deleteMapProject(id); toast.success('Proyecto eliminado'); await loadProjects(); }
    catch (err) { toast.error('Error al eliminar'); }
  };

  if (loading) return <Loader variant="fullscreen" text="Cargando proyectos..." />;
  if (error) return <ErrorState title="Error" description={error} onRetry={loadProjects} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Mapa</h1>
          <p className="text-sm text-gray-500 mt-1">Administra los proyectos y obras geolocalizados</p>
        </div>
        <Button onClick={() => { setEditingItem(null); setIsModalOpen(true); }}><FiPlus className="mr-2 h-4 w-4" /> Nuevo Proyecto</Button>
      </div>

      {projects.length === 0 ? (
        <Card><CardContent className="p-12"><EmptyState title="No hay proyectos" description="Agrega el primer proyecto al mapa." action={<Button onClick={() => setIsModalOpen(true)}>Agregar proyecto</Button>} /></CardContent></Card>
      ) : (
        <div className="grid gap-4">
          {projects.map((item, index) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="h-14 w-14 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0 text-primary-700"><FiMapPin className="h-6 w-6" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-semibold text-gray-900 truncate">{item.title}</h3>
                        <Badge variant={item.status === 'published' ? 'success' : 'warning'}>{item.status === 'published' ? 'Publicado' : 'Borrador'}</Badge>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{item.municipality} • {item.category}</p>
                      <p className="text-xs text-gray-400 mt-1">Coordenadas: {item.lat.toFixed(4)}, {item.lng.toFixed(4)}</p>
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

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingItem(null); }} title={editingItem ? 'Editar Proyecto' : 'Nuevo Proyecto'} size="lg">
        <MapForm initialData={editingItem} onSubmit={handleSubmit} onCancel={() => { setIsModalOpen(false); setEditingItem(null); }} isLoading={isSubmitting} />
      </Modal>
    </div>
  );
}
