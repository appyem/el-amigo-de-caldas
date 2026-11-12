import { cn } from '@/utils/cn';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-app py-12">
        <h1 className={cn('text-4xl font-bold text-primary')}>
          El Amigo de Caldas
        </h1>
        <p className="mt-4 text-gray-600">
          Plataforma digital en construcción
        </p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-secondary">Vite + React</h3>
            <p className="text-sm text-gray-500 mt-1">Configuración base</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-secondary">Tailwind CSS</h3>
            <p className="text-sm text-gray-500 mt-1">Sistema de diseño</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-secondary">TypeScript</h3>
            <p className="text-sm text-gray-500 mt-1">Tipado estático</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
