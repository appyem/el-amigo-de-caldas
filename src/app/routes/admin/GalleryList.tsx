import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Loader } from '@/components/ui/Loader';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { GalleryItem, getGallery, createGallery, updateGallery, deleteGallery } from '@/services/firebase/gallery';
import { GalleryForm } from '@/components/admin/GalleryForm';
import { FiPlus, FiEdit2, FiTrash2, FiImage } from 'react-icons/fi';
import toast from 'react-hot-toast';

export function GalleryList() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await getGallery();
      setItems(data);
      setError('');
    } catch (err) {
      setError('Error al cargar la galería');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadItems(); }, []);

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      if (editingItem?.id) {
        await updateGallery(editingItem.id, formData);
        toast.success('Imagen actualizada');
      } else {
        await createGallery(formData);
        toast.success('Imagen creada');
      }
      setIsModalOpen(false);
      setEditingItem(null);
      await loadItems();
    } catch (err) {
      toast.error('Error al guardar');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Eliminar esta imagen?')) return;
    try {
      await deleteGallery(id);
      toast.success('Imagen eliminada');
      await loadItems();
    } catch (err) {
      toast.error('Error al eliminar');
    }
  };

  if (loading) return <Loader variant="fullscreen" text="Cargando galería..." />;
  if (error) return <ErrorState title="Error" description={error} onRetry={loadItems} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Galería</h1>
          <p className="text-sm text-gray-500 mt-1">Administra las imágenes del sitio</p>
        </div>
        <Button onClick={() => { setEditingItem(null); setIsModalOpen(true); }}>
          <FiPlus className="mr-2 h-4 w-4" /> Nueva Imagen
        </Button>
      </div>

      {items.length === 0 ? (
        <Card><CardContent className="p-12"><EmptyState title="No hay imágenes" description="Comienza subiendo la primera imagen." action={<Button onClick={() => setIsModalOpen(true)}>Subir imagen</Button>} /></CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, index) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
              <Card className="overflow-hidden hover:shadow-md transition-shadow group">
                <div className="aspect-video w-full bg-gray-100 relative">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300"><FiImage className="h-8 w-8" /></div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="secondary" size="sm" className="h-8 w-8 p-0" onClick={() => { setEditingItem(item); setIsModalOpen(true); }}><FiEdit2 className="h-4 w-4" /></Button>
                    <Button variant="danger" size="sm" className="h-8 w-8 p-0" onClick={() => item.id && handleDelete(item.id)}><FiTrash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 truncate max-w-[150px]">{item.title}</h3>
                      <p className="text-xs text-gray-500">{item.category}</p>
                    </div>
                    <Badge variant={item.status === 'published' ? 'success' : 'warning'} className="text-xs">{item.status === 'published' ? 'Publicado' : 'Borrador'}</Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingItem(null); }} title={editingItem ? 'Editar Imagen' : 'Nueva Imagen'} size="md">
        <GalleryForm initialData={editingItem} onSubmit={handleSubmit} onCancel={() => { setIsModalOpen(false); setEditingItem(null); }} isLoading={isSubmitting} />
      </Modal>
    </div>
  );
}
