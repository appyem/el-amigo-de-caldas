import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { QuizQuestion } from '@/services/firebase/games';
import { FiSave, FiX } from 'react-icons/fi';

interface GameFormProps {
  initialData?: QuizQuestion | null;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export function GameForm({ initialData, onSubmit, onCancel, isLoading }: GameFormProps) {
  const [formData, setFormData] = useState({
    question: initialData?.question || '',
    optionA: initialData?.optionA || '',
    optionB: initialData?.optionB || '',
    optionC: initialData?.optionC || '',
    optionD: initialData?.optionD || '',
    correctOption: initialData?.correctOption || 'A',
    category: initialData?.category || 'General',
    status: initialData?.status || 'draft',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Pregunta</label>
        <Input name="question" value={formData.question} onChange={handleChange} placeholder="Ej: ¿Cuál es la capital de Caldas?" required />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Opción A</label>
          <Input name="optionA" value={formData.optionA} onChange={handleChange} placeholder="Respuesta A" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Opción B</label>
          <Input name="optionB" value={formData.optionB} onChange={handleChange} placeholder="Respuesta B" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Opción C</label>
          <Input name="optionC" value={formData.optionC} onChange={handleChange} placeholder="Respuesta C" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Opción D</label>
          <Input name="optionD" value={formData.optionD} onChange={handleChange} placeholder="Respuesta D" required />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Respuesta Correcta</label>
          <select name="correctOption" value={formData.correctOption} onChange={handleChange} className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
            <option value="A">Opción A</option>
            <option value="B">Opción B</option>
            <option value="C">Opción C</option>
            <option value="D">Opción D</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Categoría</label>
          <select name="category" value={formData.category} onChange={handleChange} className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
            <option value="General">General</option>
            <option value="Geografía">Geografía</option>
            <option value="Cultura">Cultura</option>
            <option value="Historia">Historia</option>
          </select>
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Estado</label>
        <select name="status" value={formData.status} onChange={handleChange} className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
          <option value="draft">Borrador</option>
          <option value="published">Publicado</option>
        </select>
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}><FiX className="mr-2 h-4 w-4" /> Cancelar</Button>
        <Button type="submit" variant="primary" isLoading={isLoading}><FiSave className="mr-2 h-4 w-4" /> {initialData ? 'Actualizar' : 'Crear'} Pregunta</Button>
      </div>
    </form>
  );
}
