import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Loader } from '@/components/ui/Loader';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { QuizQuestion, getQuizQuestions, createQuizQuestion, updateQuizQuestion, deleteQuizQuestion } from '@/services/firebase/games';
import { GameForm } from '@/components/admin/GameForm';
import { FiPlus, FiEdit2, FiTrash2, FiHelpCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

export function GamesList() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<QuizQuestion | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadQuestions = async () => {
    try { setLoading(true); setQuestions(await getQuizQuestions()); setError(''); }
    catch (err) { setError('Error al cargar preguntas'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadQuestions(); }, []);

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      if (editingItem?.id) { await updateQuizQuestion(editingItem.id, formData); toast.success('Pregunta actualizada'); }
      else { await createQuizQuestion(formData); toast.success('Pregunta creada'); }
      setIsModalOpen(false); setEditingItem(null); await loadQuestions();
    } catch (err) { toast.error('Error al guardar'); }
    finally { setIsSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Eliminar esta pregunta?')) return;
    try { await deleteQuizQuestion(id); toast.success('Pregunta eliminada'); await loadQuestions(); }
    catch (err) { toast.error('Error al eliminar'); }
  };

  if (loading) return <Loader variant="fullscreen" text="Cargando preguntas..." />;
  if (error) return <ErrorState title="Error" description={error} onRetry={loadQuestions} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Trivia</h1>
          <p className="text-sm text-gray-500 mt-1">Administra las preguntas del juego educativo</p>
        </div>
        <Button onClick={() => { setEditingItem(null); setIsModalOpen(true); }}><FiPlus className="mr-2 h-4 w-4" /> Nueva Pregunta</Button>
      </div>

      {questions.length === 0 ? (
        <Card><CardContent className="p-12"><EmptyState title="No hay preguntas" description="Crea la primera pregunta para la trivia." action={<Button onClick={() => setIsModalOpen(true)}>Crear pregunta</Button>} /></CardContent></Card>
      ) : (
        <div className="grid gap-4">
          {questions.map((item, index) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="h-10 w-10 rounded-full bg-accent-100 flex items-center justify-center flex-shrink-0 text-accent-700"><FiHelpCircle className="h-5 w-5" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-semibold text-gray-900 truncate">{item.question}</h3>
                        <Badge variant={item.status === 'published' ? 'success' : 'warning'}>{item.status === 'published' ? 'Publicado' : 'Borrador'}</Badge>
                      </div>
                      <p className="text-xs text-gray-500">Correcta: {item.correctOption} • Categoría: {item.category}</p>
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

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingItem(null); }} title={editingItem ? 'Editar Pregunta' : 'Nueva Pregunta'} size="lg">
        <GameForm initialData={editingItem} onSubmit={handleSubmit} onCancel={() => { setIsModalOpen(false); setEditingItem(null); }} isLoading={isSubmitting} />
      </Modal>
    </div>
  );
}
