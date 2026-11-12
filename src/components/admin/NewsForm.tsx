import { useState } from 'react';
import { Timestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { News } from '@/services/firebase/news';
import { FiSave, FiX, FiImage } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface NewsFormProps {
  initialData?: News | null;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export function NewsForm({ initialData, onSubmit, onCancel, isLoading }: NewsFormProps) {
  const getDateValue = () => {
    if (!initialData?.date) return new Date().toISOString().split('T')[0];
    if (initialData.date instanceof Timestamp) {
      return initialData.date.toDate().toISOString().split('T')[0];
    }
    if (initialData.date instanceof Date) {
      return initialData.date.toISOString().split('T')[0];
    }
    return new Date().toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    summary: initialData?.summary || '',
    content: initialData?.content || '',
    imageUrl: initialData?.imageUrl || '',
    date: getDateValue(),
    status: initialData?.status || 'draft',
  });

  const [imagePreview, setImagePreview] = useState<string>(initialData?.imageUrl || '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      toast.error('Solo se permiten archivos de imagen (JPG, PNG, WEBP)');
      return;
    }

    // Validar tamaño máximo (500 KB)
    const maxSize = 500 * 1024; // 500 KB
    if (file.size > maxSize) {
      toast.error(`La imagen es muy pesada. Máximo permitido: 500 KB. Tamaño actual: ${(file.size / 1024).toFixed(1)} KB`);
      return;
    }

    // Convertir a Base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFormData({ ...formData, imageUrl: base64String });
      setImagePreview(base64String);
      toast.success('Imagen cargada correctamente');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Título</label>
        <Input name="title" value={formData.title} onChange={handleChange} placeholder="Ej: Nueva obra en Manizales" required />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Resumen</label>
        <textarea
          name="summary"
          value={formData.summary}
          onChange={handleChange}
          className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          rows={2}
          placeholder="Breve descripción de la noticia..."
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Contenido</label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          rows={6}
          placeholder="Detalles completos de la noticia..."
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Imagen de portada (Máx. 500 KB)</label>
        <div className="flex items-center gap-4">
          <label className="flex-1 cursor-pointer">
            <div className="flex h-24 w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors">
              {imagePreview ? (
                <img src={imagePreview} alt="Vista previa" className="h-full w-full object-cover rounded-lg" />
              ) : (
                <div className="text-center p-4">
                  <FiImage className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-1 text-xs text-gray-500">Haz clic para subir una imagen</p>
                </div>
              )}
            </div>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleImageChange} 
            />
          </label>
          {imagePreview && (
            <Button type="button" variant="outline" size="sm" onClick={() => {
              setImagePreview('');
              setFormData({ ...formData, imageUrl: '' });
            }}>
              <FiX className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Fecha</label>
          <Input type="date" name="date" value={formData.date} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Estado</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="draft">Borrador</option>
            <option value="published">Publicado</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          <FiX className="mr-2 h-4 w-4" /> Cancelar
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          <FiSave className="mr-2 h-4 w-4" /> {initialData ? 'Actualizar' : 'Crear'} Noticia
        </Button>
      </div>
    </form>
  );
}
