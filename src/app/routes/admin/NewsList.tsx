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
import { News, getNews, createNews, updateNews, deleteNews } from '@/services/firebase/news';
import { NewsForm } from '@/components/admin/NewsForm';
import { FiPlus, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import toast from 'react-hot-toast';

export function NewsList() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadNews = async () => {
    try {
      setLoading(true);
      const data = await getNews();
      setNews(data);
      setError('');
    } catch (err) {
      setError('Error al cargar las noticias');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  const handleOpenModal = (item: News | null = null) => {
    setEditingNews(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingNews(null);
  };

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      const dateObj = new Date(formData.date);
      const dataToSave = {
        ...formData,
        date: Timestamp.fromDate(dateObj),
      };

      if (editingNews?.id) {
        await updateNews(editingNews.id, dataToSave);
        toast.success('Noticia actualizada correctamente');
      } else {
        await createNews(dataToSave);
        toast.success('Noticia creada correctamente');
      }
      handleCloseModal();
      await loadNews();
    } catch (err) {
      toast.error('Error al guardar la noticia');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de eliminar esta noticia? Esta acción no se puede deshacer.')) return;
    
    try {
      await deleteNews(id);
      toast.success('Noticia eliminada');
      await loadNews();
    } catch (err) {
      toast.error('Error al eliminar la noticia');
    }
  };

  if (loading) return <Loader variant="fullscreen" text="Cargando noticias..." />;
  if (error) return <ErrorState title="Error de conexión" description={error} onRetry={loadNews} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Noticias</h1>
          <p className="text-sm text-gray-500 mt-1">Administra el contenido informativo del sitio</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <FiPlus className="mr-2 h-4 w-4" /> Nueva Noticia
        </Button>
      </div>

      {news.length === 0 ? (
        <Card>
          <CardContent className="p-12">
            <EmptyState 
              title="No hay noticias aún" 
              description="Comienza creando la primera noticia para tu comunidad."
              action={<Button onClick={() => handleOpenModal()}>Crear primera noticia</Button>}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {news.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
                      ) : (
                        <FiEye className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-semibold text-gray-900 truncate">{item.title}</h3>
                        <Badge variant={item.status === 'published' ? 'success' : 'warning'}>
                          {item.status === 'published' ? 'Publicado' : 'Borrador'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{item.summary}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {item.date instanceof Date ? item.date.toLocaleDateString() : 'Fecha no disponible'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="sm" onClick={() => handleOpenModal(item)}>
                      <FiEdit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => item.id && handleDelete(item.id)}>
                      <FiTrash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingNews ? 'Editar Noticia' : 'Nueva Noticia'}
        size="lg"
      >
        <NewsForm 
          initialData={editingNews} 
          onSubmit={handleSubmit} 
          onCancel={handleCloseModal} 
          isLoading={isSubmitting} 
        />
      </Modal>
    </div>
  );
}
