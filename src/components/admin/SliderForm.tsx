import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Slider } from '@/services/firebase/sliders';
import { FiSave, FiX, FiImage } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface SliderFormProps {
  initialData?: Slider | null;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export function SliderForm({ initialData, onSubmit, onCancel, isLoading }: SliderFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    subtitle: initialData?.subtitle || '',
    imageUrl: initialData?.imageUrl || '',
    linkText: initialData?.linkText || '',
    linkUrl: initialData?.linkUrl || '',
    order: initialData?.order?.toString() || '1',
    focusPosition: initialData?.focusPosition || 'center',
    status: initialData?.status || 'draft',
  });
  const [imagePreview, setImagePreview] = useState<string>(initialData?.imageUrl || '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Solo se permiten imágenes'); return; }
    if (file.size > 500 * 1024) {
      toast.error(`Máximo 500 KB. Tamaño: ${(file.size / 1024).toFixed(1)} KB`);
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setFormData({ ...formData, imageUrl: base64 });
      setImagePreview(base64);
      toast.success('Imagen cargada');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ ...formData, order: parseInt(formData.order) || 1 });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Título principal</label>
        <Input name="title" value={formData.title} onChange={handleChange} placeholder="Ej: Trabajando por un mejor Caldas" required />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Subtítulo</label>
        <textarea name="subtitle" value={formData.subtitle} onChange={handleChange} rows={2} className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" placeholder="Mensaje complementario..." required />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Texto del botón (opcional)</label>
          <Input name="linkText" value={formData.linkText} onChange={handleChange} placeholder="Ej: Conoce mi gestión" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">URL del botón (opcional)</label>
          <Input name="linkUrl" value={formData.linkUrl} onChange={handleChange} placeholder="Ej: /agenda" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Orden de aparición</label>
          <Input type="number" name="order" value={formData.order} onChange={handleChange} min="1" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Posición del foco</label>
          <select name="focusPosition" value={formData.focusPosition} onChange={handleChange} className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
            <option value="center">Centro</option>
            <option value="top">Arriba</option>
            <option value="bottom">Abajo</option>
            <option value="left">Izquierda</option>
            <option value="right">Derecha</option>
            <option value="top-left">Arriba-Izquierda</option>
            <option value="top-right">Arriba-Derecha</option>
            <option value="bottom-left">Abajo-Izquierda</option>
            <option value="bottom-right">Abajo-Derecha</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Estado</label>
          <select name="status" value={formData.status} onChange={handleChange} className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
            <option value="draft">Borrador</option>
            <option value="published">Publicado</option>
          </select>
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Imagen de fondo (Máx. 500 KB)</label>
        <div className="flex items-center gap-4">
          <label className="flex-1 cursor-pointer">
            <div className="flex h-32 w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors overflow-hidden">
              {imagePreview ? (
                <img src={imagePreview} alt="Vista previa" className="h-full w-full object-cover" style={{ objectPosition: formData.focusPosition.replace('-', ' ') }} />
              ) : (
                <div className="text-center p-4">
                  <FiImage className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-1 text-xs text-gray-500">Haz clic para subir imagen</p>
                </div>
              )}
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </label>
          {imagePreview && (
            <Button type="button" variant="outline" size="sm" onClick={() => { setImagePreview(''); setFormData({ ...formData, imageUrl: '' }); }}>
              <FiX className="h-4 w-4" />
            </Button>
          )}
        </div>
        <p className="text-xs text-gray-500">💡 Recomendación: usa imágenes horizontales (16:9) de alta calidad. La "Posición del foco" te permite elegir qué parte de la imagen debe verse mejor.</p>
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}><FiX className="mr-2 h-4 w-4" /> Cancelar</Button>
        <Button type="submit" variant="primary" isLoading={isLoading}><FiSave className="mr-2 h-4 w-4" /> {initialData ? 'Actualizar' : 'Crear'}</Button>
      </div>
    </form>
  );
}
