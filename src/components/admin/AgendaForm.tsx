import { useState } from 'react';
import { Timestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AgendaEvent } from '@/services/firebase/agenda';
import { FiSave, FiX, FiImage, FiMapPin, FiCalendar } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface AgendaFormProps {
  initialData?: AgendaEvent | null;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export function AgendaForm({ initialData, onSubmit, onCancel, isLoading }: AgendaFormProps) {
  const getDateTimeValue = (dateField: any) => {
    if (!dateField) return '';
    const d = dateField instanceof Timestamp ? dateField.toDate() : (dateField instanceof Date ? dateField : new Date());
    return d.toISOString().slice(0, 16); // Formato YYYY-MM-DDThh:mm
  };

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    location: initialData?.location || '',
    startDate: getDateTimeValue(initialData?.startDate),
    endDate: getDateTimeValue(initialData?.endDate),
    imageUrl: initialData?.imageUrl || '',
    status: initialData?.status || 'draft',
  });

  const [imagePreview, setImagePreview] = useState<string>(initialData?.imageUrl || '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Solo se permiten archivos de imagen (JPG, PNG, WEBP)');
      return;
    }
    if (file.size > 500 * 1024) {
      toast.error(`La imagen es muy pesada. Máximo permitido: 500 KB. Tamaño: ${(file.size / 1024).toFixed(1)} KB`);
      return;
    }
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
        <label className="text-sm font-medium text-gray-700">Nombre del Evento</label>
        <Input name="title" value={formData.title} onChange={handleChange} placeholder="Ej: Feria de Manizales 2024" required />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Descripción</label>
        <textarea name="description" value={formData.description} onChange={handleChange} className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" rows={3} placeholder="Detalles del evento..." required />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2"><FiMapPin className="h-4 w-4" /> Ubicación</label>
        <Input name="location" value={formData.location} onChange={handleChange} placeholder="Ej: Plaza de Bolívar, Manizales" required />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2"><FiCalendar className="h-4 w-4" /> Fecha y Hora de Inicio</label>
          <Input type="datetime-local" name="startDate" value={formData.startDate} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2"><FiCalendar className="h-4 w-4" /> Fecha y Hora de Fin</label>
          <Input type="datetime-local" name="endDate" value={formData.endDate} onChange={handleChange} required />
        </div>
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
                  <p className="mt-1 text-xs text-gray-500">Haz clic para subir</p>
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
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Estado</label>
        <select name="status" value={formData.status} onChange={handleChange} className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
          <option value="draft">Borrador</option>
          <option value="published">Publicado</option>
        </select>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}><FiX className="mr-2 h-4 w-4" /> Cancelar</Button>
        <Button type="submit" variant="primary" isLoading={isLoading}><FiSave className="mr-2 h-4 w-4" /> {initialData ? 'Actualizar' : 'Crear'} Evento</Button>
      </div>
    </form>
  );
}
