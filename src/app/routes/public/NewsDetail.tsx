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
        if (data && data.status === 'published') {
          setNews(data);
        } else {
          setError('Esta noticia no existe o no está publicada.');
        }
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
    <div className="container-app py-12">
      <Link to="/noticias" className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-primary mb-8 transition-colors">
        <FiArrowLeft className="mr-2 h-4 w-4" /> Volver a noticias
      </Link>

      <motion.article 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <Card className="overflow-hidden">
          {news.imageUrl && (
            <div className="aspect-video w-full bg-gray-100">
              <img src={news.imageUrl} alt={news.title} className="w-full h-full object-cover" />
            </div>
          )}
          <CardContent className="p-8 md:p-12">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <FiCalendar className="h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {news.title}
            </h1>
            
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="text-xl text-gray-600 font-medium mb-8 leading-relaxed border-l-4 border-primary pl-4">
                {news.summary}
              </p>
              <div className="whitespace-pre-wrap leading-relaxed">
                {news.content}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.article>
    </div>
  );
}
