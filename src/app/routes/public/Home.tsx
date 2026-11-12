import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { getPublishedNews, News } from '@/services/firebase/news';
import { getPublishedAgenda, AgendaEvent } from '@/services/firebase/agenda';
import { FiArrowRight, FiMapPin, FiCalendar, FiFileText } from 'react-icons/fi';

export function Home() {
  const [latestNews, setLatestNews] = useState<News[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<AgendaEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [newsData, eventsData] = await Promise.all([
          getPublishedNews(),
          getPublishedAgenda()
        ]);
        setLatestNews(newsData.slice(0, 3));
        // Ordenar eventos por fecha de inicio ascendente y tomar los 3 próximos
        const sortedEvents = eventsData
          .sort((a, b) => {
            const dateA = a.startDate instanceof Date ? a.startDate : a.startDate.toDate();
            const dateB = b.startDate instanceof Date ? b.startDate : b.startDate.toDate();
            return dateA.getTime() - dateB.getTime();
          })
          .slice(0, 3);
        setUpcomingEvents(sortedEvents);
      } catch (error) {
        console.error('Error al cargar datos para el home:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const formatDate = (dateField: any) => {
    if (!dateField) return 'Fecha no disponible';
    const d = dateField instanceof Date ? dateField : dateField.toDate();
    return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20" />
        <div className="container-app relative py-24 md:py-32">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Trabajando por un <span className="text-accent">mejor Caldas</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-primary-100 leading-relaxed">
              Comprometidos con el desarrollo, la transparencia y el bienestar de todos los municipios de nuestro departamento.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/agenda"><Button size="lg" variant="secondary">Conoce mi gestión <FiArrowRight className="ml-2 h-5 w-5" /></Button></Link>
              <Link to="/contacto"><Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">Contáctame</Button></Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Accesos Rápidos */}
      <section className="container-app py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 text-primary-700 mb-4"><FiFileText className="h-6 w-6" /></div>
              <h3 className="text-lg font-semibold text-gray-900">Noticias</h3>
              <p className="mt-2 text-sm text-gray-600">Mantente informado sobre las últimas acciones y proyectos en Caldas.</p>
              <Link to="/noticias" className="mt-4 inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700">Ver noticias <FiArrowRight className="ml-1 h-4 w-4" /></Link>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary-100 text-secondary-700 mb-4"><FiCalendar className="h-6 w-6" /></div>
              <h3 className="text-lg font-semibold text-gray-900">Agenda</h3>
              <p className="mt-2 text-sm text-gray-600">Conoce los eventos y actividades próximas en tu municipio.</p>
              <Link to="/agenda" className="mt-4 inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700">Ver agenda <FiArrowRight className="ml-1 h-4 w-4" /></Link>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent-100 text-accent-700 mb-4"><FiMapPin className="h-6 w-6" /></div>
              <h3 className="text-lg font-semibold text-gray-900">Mapa</h3>
              <p className="mt-2 text-sm text-gray-600">Explora los proyectos y obras en los 27 municipios de Caldas.</p>
              <Link to="/mapa" className="mt-4 inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700">Ver mapa <FiArrowRight className="ml-1 h-4 w-4" /></Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Próximos Eventos */}
      <section className="bg-gray-50 py-16">
        <div className="container-app">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Próximos Eventos</h2>
            <Link to="/agenda" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center">Ver todos <FiArrowRight className="ml-1 h-4 w-4" /></Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{[1, 2, 3].map((i) => <Card key={i} className="animate-pulse"><div className="aspect-video bg-gray-200" /><CardContent className="p-6 space-y-3"><div className="h-4 bg-gray-200 rounded w-1/4" /><div className="h-6 bg-gray-200 rounded w-3/4" /></CardContent></Card>)}</div>
          ) : upcomingEvents.length === 0 ? (
            <Card><CardContent className="p-12 text-center text-gray-500">No hay eventos programados próximamente.</CardContent></Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingEvents.map((item, index) => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                  <Link to={`/agenda/${item.id}`} className="block h-full">
                    <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden group border-l-4 border-l-primary">
                      <CardContent className="p-6 flex flex-col h-full">
                        <div className="flex items-center gap-2 text-xs font-semibold text-primary-700 bg-primary-50 w-fit px-2 py-1 rounded mb-3">
                          <FiCalendar className="h-3 w-3" />
                          <span>{formatDate(item.startDate)}</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">{item.title}</h3>
                        <div className="flex items-start gap-2 text-sm text-gray-600 mb-4 flex-1">
                          <FiMapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-2">{item.location}</span>
                        </div>
                        <div className="flex items-center text-sm font-semibold text-primary group-hover:translate-x-1 transition-transform mt-auto">Ver detalles <FiArrowRight className="ml-1 h-4 w-4" /></div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Últimas Noticias */}
      <section className="py-16">
        <div className="container-app">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Últimas Noticias</h2>
            <Link to="/noticias" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center">Ver todas <FiArrowRight className="ml-1 h-4 w-4" /></Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{[1, 2, 3].map((i) => <Card key={i} className="animate-pulse"><div className="aspect-video bg-gray-200" /><CardContent className="p-6 space-y-3"><div className="h-4 bg-gray-200 rounded w-1/4" /><div className="h-6 bg-gray-200 rounded w-3/4" /><div className="h-4 bg-gray-200 rounded w-full" /></CardContent></Card>)}</div>
          ) : latestNews.length === 0 ? (
            <Card><CardContent className="p-12 text-center text-gray-500">No hay noticias publicadas recientemente.</CardContent></Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestNews.map((item, index) => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                  <Link to={`/noticias/${item.id}`} className="block h-full">
                    <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
                      <div className="aspect-video w-full bg-gray-100 overflow-hidden">
                        {item.imageUrl ? <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /> : <div className="w-full h-full flex items-center justify-center text-gray-300"><FiFileText className="h-12 w-12" /></div>}
                      </div>
                      <CardContent className="p-6 flex flex-col h-[calc(100%-12rem)]">
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3"><FiCalendar className="h-3 w-3" /><span>{item.date instanceof Date ? item.date.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Fecha no disponible'}</span></div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">{item.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-1">{item.summary}</p>
                        <div className="flex items-center text-sm font-semibold text-primary group-hover:translate-x-1 transition-transform">Leer más <FiArrowRight className="ml-1 h-4 w-4" /></div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
