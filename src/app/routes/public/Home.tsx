import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { getPublishedNews, News } from '@/services/firebase/news';
import { getPublishedAgenda, AgendaEvent } from '@/services/firebase/agenda';
import { getPublishedGallery, GalleryItem } from '@/services/firebase/gallery';
import { getPublishedSliders, Slider } from '@/services/firebase/sliders';
import { FiArrowRight, FiMapPin, FiCalendar, FiFileText, FiImage, FiBriefcase, FiShield, FiHeart, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export function Home() {
  const [latestNews, setLatestNews] = useState<News[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<AgendaEvent[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [newsData, eventsData, galleryData, slidersData] = await Promise.all([
          getPublishedNews(),
          getPublishedAgenda(),
          getPublishedGallery(),
          getPublishedSliders()
        ]);
        setLatestNews(newsData.slice(0, 3));
        const sortedEvents = eventsData
          .sort((a, b) => {
            const dateA = a.startDate instanceof Date ? a.startDate : a.startDate.toDate();
            const dateB = b.startDate instanceof Date ? b.startDate : b.startDate.toDate();
            return dateA.getTime() - dateB.getTime();
          })
          .slice(0, 3);
        setUpcomingEvents(sortedEvents);
        setGalleryItems(galleryData.slice(0, 4));
        setSliders(slidersData);
      } catch (error) {
        console.error('Error al cargar datos para el home:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (sliders.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliders.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [sliders.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % sliders.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + sliders.length) % sliders.length);

  const formatDate = (dateField: any) => {
    if (!dateField) return 'Fecha no disponible';
    const d = dateField instanceof Date ? dateField : dateField.toDate();
    return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const getObjectPosition = (position: string) => {
    const positions: Record<string, string> = {
      'center': 'center center', 'top': 'center top', 'bottom': 'center bottom',
      'left': 'left center', 'right': 'right center', 'top-left': 'left top',
      'top-right': 'right top', 'bottom-left': 'left bottom', 'bottom-right': 'right bottom',
    };
    return positions[position] || 'center center';
  };

  return (
    <div className="bg-white">
      {/* Carrusel Dinámico de Sliders (ANTI-PIXELADO) */}
      <section className="relative overflow-hidden bg-gray-100">
        {loading || sliders.length === 0 ? (
          <div className="relative min-h-[400px] md:min-h-[500px] bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 flex items-center">
            <div className="container-app relative z-10 max-w-4xl py-12">
              <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-primary-900 uppercase bg-accent rounded-full">
                Diputado de la Asamblea de Caldas • Partido de la U
              </div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white">
                Fredy Arenas: <span className="text-accent">Compromiso con Caldas</span>
              </h1>
              <p className="mt-6 text-lg text-primary-100 leading-relaxed max-w-2xl">
                Abogado y Administrador de Negocios Internacionales. Impulsando el emprendimiento, la seguridad, el deporte y la cultura.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/agenda"><Button size="lg" variant="secondary">Conoce mi gestión <FiArrowRight className="ml-2 h-5 w-5" /></Button></Link>
                <Link to="/contacto"><Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">Envía tu PQRSD</Button></Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative min-h-[400px] md:min-h-[500px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 w-full h-full"
              >
                {sliders[currentSlide].imageUrl && (
                  <img 
                    src={sliders[currentSlide].imageUrl} 
                    alt={sliders[currentSlide].title} 
                    className="w-full h-full object-contain"
                    style={{ 
                      objectPosition: getObjectPosition(sliders[currentSlide].focusPosition || 'center')
                    }}
                  />
                )}
                {/* Degradado suave en la parte inferior para que el texto sea legible */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
                  <div className="container-app max-w-4xl text-white">
                    <h1 className="text-3xl md:text-5xl font-bold leading-tight drop-shadow-lg">
                      {sliders[currentSlide].title}
                    </h1>
                    <p className="mt-4 text-lg text-gray-100 leading-relaxed drop-shadow">
                      {sliders[currentSlide].subtitle}
                    </p>
                    {sliders[currentSlide].linkText && sliders[currentSlide].linkUrl && (
                      <div className="mt-6">
                        <Link to={sliders[currentSlide].linkUrl!}>
                          <Button size="lg" variant="secondary">
                            {sliders[currentSlide].linkText} <FiArrowRight className="ml-2 h-5 w-5" />
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {sliders.length > 1 && (
              <>
                <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm flex items-center justify-center text-white transition-colors">
                  <FiChevronLeft className="h-5 w-5" />
                </button>
                <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm flex items-center justify-center text-white transition-colors">
                  <FiChevronRight className="h-5 w-5" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                  {sliders.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`h-2 rounded-full transition-all ${index === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/70'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </section>

      {/* El resto del Home (Ejes de Gestión, Eventos, Galería, Noticias) se mantiene igual */}
      <section className="container-app py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Ejes de Gestión</h2>
          <p className="mt-4 text-gray-600">Trabajo legislativo y comunitario con resultados tangibles.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow border-t-4 border-t-primary">
            <CardContent className="p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 text-primary-700 mb-4"><FiBriefcase className="h-6 w-6" /></div>
              <h3 className="text-lg font-semibold text-gray-900">Emprendimiento y Empleo</h3>
              <p className="mt-2 text-sm text-gray-600">Apoyo a la creación de empresas y generación de oportunidades laborales en Caldas y otras regiones del país.</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow border-t-4 border-t-secondary">
            <CardContent className="p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary-100 text-secondary-700 mb-4"><FiShield className="h-6 w-6" /></div>
              <h3 className="text-lg font-semibold text-gray-900">Seguridad y Medio Ambiente</h3>
              <p className="mt-2 text-sm text-gray-600">Gestión para la protección de nuestra biodiversidad y el fortalecimiento de la seguridad en los municipios.</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow border-t-4 border-t-accent">
            <CardContent className="p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent-100 text-accent-700 mb-4"><FiHeart className="h-6 w-6" /></div>
              <h3 className="text-lg font-semibold text-gray-900">Cultura y Deporte</h3>
              <p className="mt-2 text-sm text-gray-600">Defensa de los artistas y músicos locales, impulsando la inclusión en eventos públicos y festivales del departamento.</p>
            </CardContent>
          </Card>
        </div>
      </section>

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

      <section className="py-16">
        <div className="container-app">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Galería</h2>
            <Link to="/galeria" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center">Ver toda la galería <FiArrowRight className="ml-1 h-4 w-4" /></Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{[1, 2, 3, 4].map((i) => <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse" />)}</div>
          ) : galleryItems.length === 0 ? (
            <Card><CardContent className="p-12 text-center text-gray-500">Pronto compartiremos nuevas imágenes.</CardContent></Card>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {galleryItems.map((item, index) => (
                <motion.div key={item.id} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                  <Link to="/galeria" className="block group">
                    <div className="aspect-square w-full bg-gray-100 rounded-lg overflow-hidden relative">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300"><FiImage className="h-12 w-12" /></div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <div>
                          <p className="text-white font-semibold text-sm">{item.title}</p>
                          <p className="text-white/80 text-xs">{item.category}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-gray-50 py-16">
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
