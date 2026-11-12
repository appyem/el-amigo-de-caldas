import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { createContact } from '@/services/firebase/contacts';
import { FiSend, FiMail, FiPhone, FiMapPin, FiUser, FiMessageSquare } from 'react-icons/fi';
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
    } catch (error) { toast.error('Error al enviar el mensaje.'); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <section className="relative overflow-hidden bg-slate-900 py-20">
        <div className="absolute inset-0 bg-party-gradient opacity-85" />
        <div className="absolute inset-0 bg-grid-pattern opacity-15" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-red-500/30 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4" />
        <div className="container-app relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-white uppercase bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <FiMessageSquare className="text-yellow-300" /> Tu voz importa
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight">
              Contáctanos <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-white">Directamente</span>
            </h1>
            <p className="mt-6 text-xl text-white/90 max-w-2xl mx-auto font-light">
              Envíanos tus propuestas, peticiones, quejas o sugerencias. Estamos para escucharte.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container-app -mt-12 relative z-10 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1 space-y-5">
            <Card className="shadow-xl border-0">
              <CardContent className="p-6 space-y-5">
                <h3 className="text-lg font-black text-slate-900">Información de Contacto</h3>
                {[
                  { icon: FiMail, title: 'Correo', value: 'contacto@elamigodecaldas.com', color: 'from-red-500 to-red-600' },
                  { icon: FiPhone, title: 'Teléfono', value: '+57 300 000 0000', color: 'from-yellow-400 to-amber-500' },
                  { icon: FiMapPin, title: 'Oficina', value: 'Manizales, Caldas', color: 'from-green-500 to-emerald-600' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className={`flex-shrink-0 h-11 w-11 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-md`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{item.title}</p>
                      <p className="text-sm text-slate-600">{item.value}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="shadow-xl border-0 bg-gradient-to-br from-red-500 via-yellow-400 to-green-500 text-white">
              <CardContent className="p-6">
                <h3 className="text-lg font-black mb-2">Partido de la U</h3>
                <p className="text-sm text-white/90">Partido Social de Unidad Nacional. Comprometidos con el desarrollo de Caldas.</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
            <Card className="shadow-2xl border-0">
              <CardHeader>
                <CardTitle className="text-2xl font-black text-slate-900">Envíanos un mensaje</CardTitle>
                <CardDescription className="text-slate-600">Completa el formulario y te responderemos a la brevedad.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Nombre completo</label>
                      <Input name="name" value={formData.name} onChange={handleChange} iconLeft={<FiUser className="h-4 w-4" />} placeholder="Tu nombre" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Correo electrónico</label>
                      <Input type="email" name="email" value={formData.email} onChange={handleChange} iconLeft={<FiMail className="h-4 w-4" />} placeholder="tu@correo.com" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Teléfono</label>
                      <Input type="tel" name="phone" value={formData.phone} onChange={handleChange} iconLeft={<FiPhone className="h-4 w-4" />} placeholder="300 000 0000" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Municipio</label>
                      <Input name="municipality" value={formData.municipality} onChange={handleChange} iconLeft={<FiMapPin className="h-4 w-4" />} placeholder="Ej: Manizales" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Tipo de solicitud</label>
                    <select name="type" value={formData.type} onChange={handleChange} className="flex h-11 w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent">
                      <option value="Contacto">Contacto general</option>
                      <option value="Petición">Petición</option>
                      <option value="Queja">Queja</option>
                      <option value="Sugerencia">Sugerencia</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Mensaje</label>
                    <textarea name="message" value={formData.message} onChange={handleChange} rows={5} className="flex w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Escribe tu mensaje aquí..." required />
                  </div>
                  <Button type="submit" className="w-full btn-glow" isLoading={isLoading}>
                    <FiSend className="mr-2 h-4 w-4" /> Enviar mensaje
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
