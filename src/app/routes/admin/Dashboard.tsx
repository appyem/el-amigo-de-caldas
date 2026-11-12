import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { FiFileText, FiCalendar, FiUsers, FiEye, FiTrendingUp, FiActivity } from 'react-icons/fi';

const stats = [
  { name: 'Noticias publicadas', value: '24', change: '+12%', icon: FiFileText, color: 'primary' },
  { name: 'Eventos activos', value: '8', change: '+3%', icon: FiCalendar, color: 'secondary' },
  { name: 'Solicitudes ciudadanas', value: '156', change: '+23%', icon: FiUsers, color: 'accent' },
  { name: 'Visitas este mes', value: '2,847', change: '+18%', icon: FiEye, color: 'green' },
];

const recentActivity = [
  { action: 'Nueva noticia publicada', time: 'Hace 2 horas', type: 'noticia' },
  { action: 'Evento creado: Feria de Manizales', time: 'Hace 5 horas', type: 'evento' },
  { action: 'Solicitud ciudadana recibida', time: 'Hace 1 día', type: 'solicitud' },
  { action: 'Imagen agregada a galería', time: 'Hace 2 días', type: 'galeria' },
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Bienvenido al panel de administración</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <p className="text-xs text-green-600 font-medium mt-1 flex items-center">
                      <FiTrendingUp className="h-3 w-3 mr-1" />
                      {stat.change}
                    </p>
                  </div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-${stat.color}-100 text-${stat.color}-700`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FiActivity className="h-5 w-5 text-primary" />
              Actividad reciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {recentActivity.map((activity, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-700 flex-shrink-0">
                    <FiActivity className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Accesos rápidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <FiFileText className="h-6 w-6 text-primary mb-2" />
                <span className="text-sm font-medium text-gray-700">Nueva noticia</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <FiCalendar className="h-6 w-6 text-secondary mb-2" />
                <span className="text-sm font-medium text-gray-700">Nuevo evento</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <FiUsers className="h-6 w-6 text-accent mb-2" />
                <span className="text-sm font-medium text-gray-700">Ver solicitudes</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <FiEye className="h-6 w-6 text-green-600 mb-2" />
                <span className="text-sm font-medium text-gray-700">Estadísticas</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
