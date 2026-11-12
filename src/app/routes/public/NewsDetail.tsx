import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/Card';
import { Loader } from '@/components/ui/Loader';
import { ErrorState } from '@/components/ui/ErrorState';
import { getNewsById, News } from '@/services/firebase/news';
import { FiCalendar, FiArrowLeft } from 'react-icons/fi';

export function NewsDetail() {
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadNews = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getNewsById(id);
        if (data && data.status === 'published') setNews(data);
        else setError('Esta noticia no existe o no está publicada.');
      } catch (err) {
        setError('Error al cargar la noticia.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadNews();
  }, [id]);

  if (loading) return <Loader variant="fullscreen" text="Cargando noticia..." />;
  if (error || !news) return <ErrorState title="Noticia no encontrada" description={error || 'La noticia que buscas no existe.'} />;

  const formattedDate = news.date instanceof Date 
    ? news.date.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Fecha no disponible';

  return (
    <div className="bg-slate-50 min-h-screen">
      <section className="relative overflow-hidden bg-slate-900 py-16">
        <div className="absolute inset-0 bg-party-gradient opacity-85" />
        <div className="container-app relative z-10">
          <Link to="/noticias" className="inline-flex items-center text-sm font-bold text-white/90 hover:text-white mb-6 transition-colors bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
            <FiArrowLeft className="mr-2 h-4 w-4" /> Volver a noticias
          </Link>
        </div>
      </section>

      <div className="container-app -mt-12 relative z-10 pb-16">
        <motion.article initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-4xl mx-auto">
          <Card className="overflow-hidden shadow-2xl border-0">
            {news.imageUrl && (
              <div className="aspect-video w-full bg-slate-100 relative">
                <img src={news.imageUrl} alt={news.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            )}
            <CardContent className="p-8 md:p-12">
              <div className="flex items-center gap-2 text-sm font-bold text-red-600 bg-red-50 w-fit px-4 py-1.5 rounded-full mb-6">
                <FiCalendar className="h-4 w-4" />
                <span>{formattedDate}</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 leading-tight tracking-tight">
                {news.title}
              </h1>
              
              <div className="prose prose-lg max-w-none">
                <p className="text-xl text-slate-700 font-medium mb-8 leading-relaxed border-l-4 border-red-500 pl-6 bg-red-50/50 py-4 pr-4 rounded-r-lg">
                  {news.summary}
                </p>
                <div className="whitespace-pre-wrap leading-relaxed text-slate-700 text-lg">
                  {news.content}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.article>
      </div>
    </div>
  );
}
