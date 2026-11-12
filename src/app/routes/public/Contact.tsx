import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { createContact } from '@/services/firebase/contacts';
import { FiSend, FiMail, FiPhone, FiMapPin, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';

type ContactType = 'Contacto' | 'Petición' | 'Queja' | 'Sugerencia';

interface FormData {
  name: string;
  email: string;
  phone: string;
  municipality: string;
  type: ContactType;
  message: string;
}

export function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: '', email: '', phone: '', municipality: '', type: 'Contacto', message: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await createContact(formData);
      toast.success('¡Mensaje enviado! Te contactaremos pronto.');
      setFormData({ name: '', email: '', phone: '', municipality: '', type: 'Contacto', message: '' });
    } catch (error) {
      toast.error('Error al enviar el mensaje. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-app py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Contáctanos</h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Tu voz es importante. Envíanos tus propuestas, peticiones o inquietudes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Información de Contacto</h3>
              <div className="flex items-start gap-3">
                <FiMail className="h-5 w-5 text-primary mt-1" />
                <div><p className="font-medium text-gray-900">Correo</p><p className="text-sm text-gray-600">contacto@elamigodecaldas.com</p></div>
              </div>
              <div className="flex items-start gap-3">
                <FiPhone className="h-5 w-5 text-primary mt-1" />
                <div><p className="font-medium text-gray-900">Teléfono</p><p className="text-sm text-gray-600">+57 300 000 0000</p></div>
              </div>
              <div className="flex items-start gap-3">
                <FiMapPin className="h-5 w-5 text-primary mt-1" />
                <div><p className="font-medium text-gray-900">Oficina</p><p className="text-sm text-gray-600">Manizales, Caldas</p></div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Envíanos un mensaje</CardTitle>
              <CardDescription>Completa el formulario y te responderemos a la brevedad.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Nombre completo</label>
                    <Input name="name" value={formData.name} onChange={handleChange} iconLeft={<FiUser className="h-4 w-4" />} placeholder="Tu nombre" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Correo electrónico</label>
                    <Input type="email" name="email" value={formData.email} onChange={handleChange} iconLeft={<FiMail className="h-4 w-4" />} placeholder="tu@correo.com" required />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Teléfono</label>
                    <Input type="tel" name="phone" value={formData.phone} onChange={handleChange} iconLeft={<FiPhone className="h-4 w-4" />} placeholder="300 000 0000" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Municipio</label>
                    <Input name="municipality" value={formData.municipality} onChange={handleChange} iconLeft={<FiMapPin className="h-4 w-4" />} placeholder="Ej: Manizales" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Tipo de solicitud</label>
                  <select name="type" value={formData.type} onChange={handleChange} className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option value="Contacto">Contacto general</option>
                    <option value="Petición">Petición</option>
                    <option value="Queja">Queja</option>
                    <option value="Sugerencia">Sugerencia</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Mensaje</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} rows={5} className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Escribe tu mensaje aquí..." required />
                </div>
                <Button type="submit" className="w-full" isLoading={isLoading}>
                  <FiSend className="mr-2 h-4 w-4" /> Enviar mensaje
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
