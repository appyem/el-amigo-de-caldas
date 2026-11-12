import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Loader } from '@/components/ui/Loader';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { ContactRequest, getContacts, markAsRead } from '@/services/firebase/contacts';
import { FiMail, FiEye, FiCheckCircle } from 'react-icons/fi';

export function ContactsList() {
  const [contacts, setContacts] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedContact, setSelectedContact] = useState<ContactRequest | null>(null);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const data = await getContacts();
      setContacts(data);
    } catch (err) {
      setError('Error al cargar las solicitudes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadContacts(); }, []);

  const handleOpen = (contact: ContactRequest) => {
    setSelectedContact(contact);
    if (contact.status === 'pending' && contact.id) {
      markAsRead(contact.id).then(() => {
        setContacts(prev => prev.map(c => c.id === contact.id ? { ...c, status: 'read' } : c));
      });
    }
  };

  const handleClose = () => setSelectedContact(null);

  if (loading) return <Loader variant="fullscreen" text="Cargando solicitudes..." />;
  if (error) return <ErrorState title="Error" description={error} onRetry={loadContacts} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Solicitudes Ciudadanas</h1>
        <p className="text-sm text-gray-500 mt-1">Gestiona los mensajes y PQRSD de la comunidad</p>
      </div>

      {contacts.length === 0 ? (
        <Card><CardContent className="p-12"><EmptyState title="No hay solicitudes" description="Aún no has recibido mensajes de la comunidad." /></CardContent></Card>
      ) : (
        <div className="grid gap-4">
          {contacts.map((item, index) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
              <Card className={`hover:shadow-md transition-shadow cursor-pointer ${item.status === 'pending' ? 'border-l-4 border-l-primary' : ''}`} onClick={() => handleOpen(item)}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${item.status === 'pending' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-500'}`}>
                      <FiMail className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`text-base truncate ${item.status === 'pending' ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>{item.name} - {item.type}</h3>
                        <Badge variant={item.status === 'pending' ? 'warning' : 'default'}>{item.status === 'pending' ? 'Nuevo' : 'Leído'}</Badge>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{item.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{item.email} | {item.municipality}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleOpen(item); }}>
                    <FiEye className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={!!selectedContact} onClose={handleClose} title="Detalle de Solicitud" size="lg">
        {selectedContact && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="font-medium text-gray-500">Nombre</p><p className="text-gray-900">{selectedContact.name}</p></div>
              <div><p className="font-medium text-gray-500">Correo</p><p className="text-gray-900">{selectedContact.email}</p></div>
              <div><p className="font-medium text-gray-500">Teléfono</p><p className="text-gray-900">{selectedContact.phone}</p></div>
              <div><p className="font-medium text-gray-500">Municipio</p><p className="text-gray-900">{selectedContact.municipality}</p></div>
            </div>
            <div>
              <p className="font-medium text-gray-500 text-sm mb-1">Tipo de solicitud</p>
              <Badge variant="primary">{selectedContact.type}</Badge>
            </div>
            <div>
              <p className="font-medium text-gray-500 text-sm mb-1">Mensaje</p>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-gray-800 whitespace-pre-wrap">
                {selectedContact.message}
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-gray-200">
              <Button variant="primary" onClick={handleClose}><FiCheckCircle className="mr-2 h-4 w-4" /> Cerrar</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
