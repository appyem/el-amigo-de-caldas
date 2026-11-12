import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getPublishedNews, News } from '@/services/firebase/news';
import { getPublishedAgenda, AgendaEvent } from '@/services/firebase/agenda';
import { getPublishedGallery, GalleryItem } from '@/services/firebase/gallery';
import { getPublishedSliders, Slider } from '@/services/firebase/sliders';
import { FiArrowRight, FiMapPin, FiCalendar, FiFileText, FiImage, FiBriefcase, FiShield, FiHeart, FiChevronLeft, FiChevronRight, FiZap } from 'react-icons/fi';

// Slide estático por defecto (siempre va primero)
const DEFAULT_HERO_SLIDE = {
  id: 'default-hero',
  type: 'default' as const,
  title: 'Fredy Arenas: Compromiso con Caldas',
  subtitle: 'Abogado y Administrador de Negocios Internacionales. Impulsando el emprendimiento, la seguridad, el deporte y la cultura para generar empleo y bienestar en nuestros 27 municipios.',
  badge: 'Diputado Asamblea de Caldas • Partido de la U',
  linkText: 'Conoce mi gestión',
  linkUrl: '/agenda',
  secondaryLinkText: 'Envía tu PQRSD',
  secondaryLinkUrl: '/contacto',
};

// Tipo unificado para todos los slides
interface SlideItem {
  id?: string;
  type: 'default' | 'custom';
  title: string;
  subtitle: string;
  badge?: string;
  imageUrl?: string;
  focusPosition?: string;
  linkText?: string;
  linkUrl?: string;
  secondaryLinkText?: string;
  secondaryLinkUrl?: string;
}

export function Home() {
  const [latestNews, setLatestNews] = useState<News[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<AgendaEvent[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [adminSliders, setAdminSliders] = useState<Slider[]>([]);
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
        setAdminSliders(slidersData);
      } catch (error) {
        console.error('Error al cargar datos para el home:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Combinar: hero estático SIEMPRE primero + sliders del admin después
  const allSlides: SlideItem[] = [
    DEFAULT_HERO_SLIDE,
    ...adminSliders.map(s => ({
      ...s,
      type: 'custom' as const,
      badge: s.title.split(' ')[0] + ' • Partido de la U',
    })),
  ];

  // Rotación automática cada 5 segundos (solo si hay más de 1 slide)
  useEffect(() => {
    if (allSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % allSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [allSlides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % allSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + allSlides.length) % allSlides.length);

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

  const current = allSlides[currentSlide];

  return (
    <div className="bg-slate-50">
      {/* ==========================================
          CARRUSEL: Hero estático + Sliders del admin
      ========================================== */}
      <section className="relative overflow-hidden bg-slate-900 min-h-[600px] md:min-h-[700px] flex items-center">
        <div className="absolute inset-0 bg-party-gradient opacity-90" />
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-400/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-red-600/40 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />

        <div className="container-app relative z-10 py-20 w-full">
          {loading ? (
            // Estado de carga: muestra el hero estático
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-white uppercase bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                <FiZap className="text-yellow-300" /> {DEFAULT_HERO_SLIDE.badge}
              </div>
              <h1 className="text-5xl md:text-7xl font-black leading-[1.1] text-white tracking-tight">
                Fredy Arenas: <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-100 to-white">
                  Compromiso con Caldas
                </span>
              </h1>
              <p className="mt-8 text-xl md:text-2xl text-white/90 leading-relaxed max-w-2xl font-light">
                Abogado y Administrador. Impulsando el <span className="font-semibold text-yellow-300">emprendimiento</span>, la seguridad y la cultura para generar bienestar en nuestros 27 municipios.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link to="/agenda">
                  <button className="btn-glow px-8 py-4 bg-white text-red-600 font-bold rounded-xl flex items-center gap-2 text-lg">
                    Conoce mi gestión <FiArrowRight className="h-5 w-5" />
                  </button>
                </Link>
                <Link to="/contacto">
                  <button className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-semibold rounded-xl border border-white/30 hover:bg-white/20 transition-all flex items-center gap-2 text-lg">
                    Envía tu PQRSD
                  </button>
                </Link>
              </div>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.7 }}
                className="flex flex-col md:flex-row items-center gap-12"
              >
                <div className="flex-1 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-white uppercase bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                    <FiZap className="text-yellow-300" /> {current.badge}
                  </div>
                  <h1 className="text-5xl md:text-7xl font-black leading-[1.1] text-white tracking-tight drop-shadow-xl">
                    {current.type === 'default' ? (
                      <>
                        Fredy Arenas: <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-100 to-white">
                          {current.title.replace('Fredy Arenas: ', '')}
                        </span>
                      </>
                    ) : (
                      current.title
                    )}
                  </h1>
                  <p className="mt-6 text-xl md:text-2xl text-white/90 leading-relaxed font-light drop-shadow-md">
                    {current.subtitle}
                  </p>
                  <div className="mt-10 flex flex-wrap gap-4">
                    {current.linkText && current.linkUrl && (
                      <Link to={current.linkUrl}>
                        <button className="btn-glow px-8 py-4 bg-white text-red-600 font-bold rounded-xl flex items-center gap-2 text-lg">
                          {current.linkText} <FiArrowRight className="h-5 w-5" />
                        </button>
                      </Link>
                    )}
                    {current.type === 'default' && current.secondaryLinkText && current.secondaryLinkUrl && (
                      <Link to={current.secondaryLinkUrl}>
                        <button className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-semibold rounded-xl border border-white/30 hover:bg-white/20 transition-all flex items-center gap-2 text-lg">
                          {current.secondaryLinkText}
                        </button>
                      </Link>
                    )}
                  </div>
                </div>

                {/* Imagen solo para sliders del admin */}
                {current.type === 'custom' && current.imageUrl && (
                  <div className="flex-1 max-w-md hidden md:block">
                    <div className="relative">
                      <div className="absolute inset-0 bg-party-gradient rounded-3xl blur-2xl opacity-50 scale-105" />
                      <img
                        src={current.imageUrl}
                        alt={current.title}
                        className="relative w-full aspect-[4/3] object-cover rounded-3xl border-4 border-white/20 shadow-2xl"
                        style={{ objectPosition: getObjectPosition(current.focusPosition || 'center') }}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}

          {/* Controles del carrusel (solo si hay más de 1 slide) */}
          {!loading && allSlides.length > 1 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
              <button onClick={prevSlide} className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/30 flex items-center justify-center text-white transition-colors">
                <FiChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex gap-1.5">
                {allSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-1.5 rounded-full transition-all ${
                      index === currentSlide ? 'w-8 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'
                    }`}
                    aria-label={`Ir al slide ${index + 1}`}
                  />
                ))}
              </div>
              <button onClick={nextSlide} className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/30 flex items-center justify-center text-white transition-colors">
                <FiChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ==========================================
          EJES DE GESTIÓN
      ========================================== */}
      <section className="container-app py-24 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-party-gradient rounded-full" />
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Ejes de <span className="text-party-gradient">Gestión</span>
          </h2>
          <p className="mt-4 text-lg text-slate-600">Trabajo legislativo y comunitario con resultados tangibles para Caldas.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: FiBriefcase, title: 'Emprendimiento y Empleo', desc: 'Apoyo a la creación de empresas y generación de oportunidades laborales en Caldas y otras regiones del país.', color: 'from-red-500 to-orange-500', bg: 'bg-red-50', text: 'text-red-600' },
            { icon: FiShield, title: 'Seguridad y Medio Ambiente', desc: 'Gestión para la protección de nuestra biodiversidad y el fortalecimiento de la seguridad en los municipios.', color: 'from-yellow-400 to-amber-500', bg: 'bg-yellow-50', text: 'text-amber-600' },
            { icon: FiHeart, title: 'Cultura y Deporte', desc: 'Defensa de los artistas y músicos locales, impulsando la inclusión en eventos públicos y festivales del departamento.', color: 'from-green-500 to-emerald-600', bg: 'bg-green-50', text: 'text-green-600' }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-slate-100 overflow-hidden h-full">
                <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${item.color}`} />
                <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${item.bg} ${item.text} mb-6 group-hover:scale-110 transition-transform`}>
                  <item.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ==========================================
          PRÓXIMOS EVENTOS
      ========================================== */}
      <section className="bg-white py-24 border-y border-slate-100">
        <div className="container-app">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900">Próximos <span className="text-party-gradient">Eventos</span></h2>
              <p className="mt-2 text-slate-600">Encuentros y actividades en tu municipio.</p>
            </div>
            <Link to="/agenda" className="hidden md:flex items-center gap-2 text-sm font-bold text-red-600 hover:text-red-700 transition-colors">
              Ver agenda completa <FiArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{[1, 2, 3].map((i) => <div key={i} className="h-80 bg-slate-100 rounded-3xl animate-pulse" />)}</div>
          ) : upcomingEvents.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 rounded-3xl"><p className="text-slate-500">No hay eventos programados próximamente.</p></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingEvents.map((item, index) => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                  <Link to={`/agenda/${item.id}`} className="block h-full group">
                    <div className="relative bg-white rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-100 h-full flex flex-col overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-yellow-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
                      <div className="flex items-center gap-2 text-xs font-bold text-red-600 bg-red-50 w-fit px-3 py-1.5 rounded-full mb-4 relative z-10">
                        <FiCalendar className="h-3 w-3" />
                        <span>{formatDate(item.startDate)}</span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors relative z-10">{item.title}</h3>
                      <div className="flex items-start gap-2 text-sm text-slate-600 mb-6 flex-1 relative z-10">
                        <FiMapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-600" />
                        <span className="line-clamp-2">{item.location}</span>
                      </div>
                      <div className="flex items-center text-sm font-bold text-red-600 group-hover:translate-x-1 transition-transform mt-auto relative z-10">
                        Ver detalles <FiArrowRight className="ml-1 h-4 w-4" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ==========================================
          GALERÍA
      ========================================== */}
      <section className="container-app py-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">Galería <span className="text-party-gradient">Visual</span></h2>
            <p className="mt-2 text-slate-600">Un recorrido por nuestra gestión.</p>
          </div>
          <Link to="/galeria" className="hidden md:flex items-center gap-2 text-sm font-bold text-red-600 hover:text-red-700 transition-colors">
            Ver toda la galería <FiArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {galleryItems.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-3xl"><p className="text-slate-500">Pronto compartiremos nuevas imágenes.</p></div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryItems.map((item, index) => (
              <motion.div key={item.id} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }}>
                <Link to="/galeria" className="block group relative aspect-square rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400"><FiImage className="h-12 w-12" /></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity flex items-end p-5">
                    <div>
                      <p className="text-white font-bold text-sm leading-tight">{item.title}</p>
                      <p className="text-yellow-300 text-xs font-semibold mt-1">{item.category}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ==========================================
          ÚLTIMAS NOTICIAS
      ========================================== */}
      <section className="bg-slate-900 py-24 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-party-gradient opacity-5" />
        <div className="container-app relative z-10">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-black">Últimas <span className="text-yellow-400">Noticias</span></h2>
              <p className="mt-2 text-slate-400">Mantente informado de nuestra gestión.</p>
            </div>
            <Link to="/noticias" className="hidden md:flex items-center gap-2 text-sm font-bold text-yellow-400 hover:text-yellow-300 transition-colors">
              Ver todas <FiArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {latestNews.length === 0 ? (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10"><p className="text-slate-400">No hay noticias publicadas recientemente.</p></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestNews.map((item, index) => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                  <Link to={`/noticias/${item.id}`} className="block h-full group">
                    <div className="bg-slate-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-slate-700 h-full flex flex-col">
                      <div className="aspect-video w-full bg-slate-700 overflow-hidden">
                        {item.imageUrl ? <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="w-full h-full flex items-center justify-center text-slate-500"><FiFileText className="h-12 w-12" /></div>}
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-center gap-2 text-xs text-slate-400 mb-3"><FiCalendar className="h-3 w-3" /><span>{item.date instanceof Date ? item.date.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Fecha no disponible'}</span></div>
                        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-yellow-400 transition-colors">{item.title}</h3>
                        <p className="text-sm text-slate-400 line-clamp-3 mb-4 flex-1">{item.summary}</p>
                        <div className="flex items-center text-sm font-bold text-yellow-400 group-hover:translate-x-1 transition-transform">Leer más <FiArrowRight className="ml-1 h-4 w-4" /></div>
                      </div>
                    </div>
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
