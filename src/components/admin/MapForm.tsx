import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { MapProject } from '@/services/firebase/map';
import { FiSave, FiX, FiImage, FiMapPin } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface MapFormProps {
  initialData?: MapProject | null;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export function MapForm({ initialData, onSubmit, onCancel, isLoading }: MapFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    municipality: initialData?.municipality || '',
    category: initialData?.category || 'Obra',
    lat: initialData?.lat?.toString() || '5.0684',
    lng: initialData?.lng?.toString() || '-75.5174',
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
    if (!file.type.startsWith('image/')) { toast.error('Solo se permiten imágenes'); return; }
    if (file.size > 500 * 1024) {
      toast.error(`Máximo 500 KB. Tamaño actual: ${(file.size / 1024).toFixed(1)} KB`);
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setFormData({ ...formData, imageUrl: base64 });
      setImagePreview(base64);
      toast.success('Imagen cargada correctamente');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(formData.lat);
    const lng = parseFloat(formData.lng);
    if (isNaN(lat) || isNaN(lng)) { toast.error('Coordenadas inválidas'); return; }
    await onSubmit({ ...formData, lat, lng });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Título del proyecto</label>
        <Input name="title" value={formData.title} onChange={handleChange} placeholder="Ej: Parque lineal de Chinchiná" required />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Descripción</label>
        <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Detalles del proyecto..." required />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Municipio</label>
          <Input name="municipality" value={formData.municipality} onChange={handleChange} placeholder="Ej: Manizales" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Categoría</label>
          <select name="category" value={formData.category} onChange={handleChange} className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
            <option value="Obra">Obra</option>
            <option value="Proyecto Social">Proyecto Social</option>
            <option value="Infraestructura">Infraestructura</option>
            <option value="Educación">Educación</option>
            <option value="Salud">Salud</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1"><FiMapPin className="h-3 w-3" /> Latitud</label>
          <Input type="number" step="any" name="lat" value={formData.lat} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1"><FiMapPin className="h-3 w-3" /> Longitud</label>
          <Input type="number" step="any" name="lng" value={formData.lng} onChange={handleChange} required />
        </div>
      </div>
      <p className="text-xs text-gray-500">
        💡 Obtén coordenadas gratis en <a href="https://www.openstreetmap.org" target="_blank" rel="noreferrer" className="text-primary hover:underline">openstreetmap.org</a> (clic derecho sobre el lugar → "Mostrar dirección").
      </p>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Imagen (Máx. 500 KB)</label>
        <div className="flex items-center gap-4">
          <label className="flex-1 cursor-pointer">
            <div className="flex h-24 w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors">
              {imagePreview ? (
                <img src={imagePreview} alt="Vista previa" className="h-full w-full object-cover rounded-lg" />
              ) : (
                <div className="text-center p-4">
                  <FiImage className="mx-auto h-6 w-6 text-gray-400" />
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
        <select name="status" value={formData.status} onChange={handleChange} className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
          <option value="draft">Borrador</option>
          <option value="published">Publicado</option>
        </select>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}><FiX className="mr-2 h-4 w-4" /> Cancelar</Button>
        <Button type="submit" variant="primary" isLoading={isLoading}><FiSave className="mr-2 h-4 w-4" /> {initialData ? 'Actualizar' : 'Crear'}</Button>
      </div>
    </form>
  );
}
