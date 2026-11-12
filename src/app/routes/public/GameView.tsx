import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Loader } from '@/components/ui/Loader';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { getPublishedQuizQuestions, QuizQuestion } from '@/services/firebase/games';
import { FiCheckCircle, FiXCircle, FiRefreshCw, FiAward, FiZap } from 'react-icons/fi';

export function GameView() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getPublishedQuizQuestions();
        const shuffled = data.sort(() => 0.5 - Math.random());
        setQuestions(shuffled.slice(0, 10));
      } catch (err) { setError('Error al cargar el juego'); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const handleOptionClick = (option: string) => {
    if (showResult) return;
    setSelectedOption(option);
    setShowResult(true);
    if (option === questions[currentIndex].correctOption) setScore(score + 1);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else setIsFinished(true);
  };

  const handleRestart = () => {
    setCurrentIndex(0); setScore(0); setSelectedOption(null); setShowResult(false); setIsFinished(false);
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    setQuestions(shuffled);
  };

  if (loading) return <Loader variant="fullscreen" text="Preparando la trivia..." />;
  if (error) return <ErrorState title="Error" description={error} onRetry={() => window.location.reload()} />;
  if (questions.length === 0) return <div className="container-app py-12"><EmptyState title="Juego no disponible" description="Pronto habrá nuevas preguntas." /></div>;

  if (isFinished) {
    const percentage = (score / questions.length) * 100;
    let message = "¡Sigue aprendiendo!";
    if (percentage >= 80) message = "¡Eres un experto en Caldas!";
    else if (percentage >= 50) message = "¡Buen conocimiento!";
    return (
      <div className="bg-slate-50 min-h-screen">
        <section className="relative overflow-hidden bg-slate-900 py-20">
          <div className="absolute inset-0 bg-party-gradient opacity-85" />
          <div className="container-app relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-white uppercase bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <FiAward className="text-yellow-300" /> Resultados
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight">
              Trivia de <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-white">Caldas</span>
            </h1>
          </div>
        </section>
        <div className="container-app -mt-12 relative z-10 pb-16 flex items-center justify-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full">
            <Card className="shadow-2xl border-0">
              <CardContent className="p-10 space-y-6 text-center">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-yellow-400 rounded-full blur-2xl opacity-50" />
                    <div className="relative h-24 w-24 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-xl">
                      <FiAward className="h-12 w-12 text-white" />
                    </div>
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900">{message}</h2>
                  <p className="text-slate-600 mt-3 text-lg">Obtuviste <span className="font-black text-red-600 text-2xl">{score}</span> de <span className="font-bold">{questions.length}</span> respuestas correctas.</p>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} className="h-full bg-gradient-to-r from-red-500 via-yellow-400 to-green-500" />
                </div>
                <Button onClick={handleRestart} className="w-full btn-glow"><FiRefreshCw className="mr-2 h-4 w-4" /> Jugar de nuevo</Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  return (
    <div className="bg-slate-50 min-h-screen">
      <section className="relative overflow-hidden bg-slate-900 py-16">
        <div className="absolute inset-0 bg-party-gradient opacity-85" />
        <div className="container-app relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-white uppercase bg-white/10 backdrop-blur-md rounded-full border border-white/20">
            <FiZap className="text-yellow-300" /> Pon a prueba tu conocimiento
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight">
            Trivia de <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-white">Caldas</span>
          </h1>
          <p className="mt-4 text-xl text-white/90 font-light">Demuestra cuánto sabes sobre nuestro departamento.</p>
        </div>
      </section>

      <div className="container-app -mt-10 relative z-10 pb-16 max-w-3xl">
        <Card className="shadow-2xl border-0 overflow-hidden">
          <CardContent className="p-8 md:p-10 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-black shadow-md">
                  {currentIndex + 1}
                </div>
                <span className="text-sm font-bold text-slate-500">de {questions.length}</span>
              </div>
              <Badge variant="primary" className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white border-0 font-bold">{currentQuestion.category}</Badge>
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-snug">{currentQuestion.question}</h2>

            <div className="space-y-3">
              {['A', 'B', 'C', 'D'].map((opt) => {
                const optionText = currentQuestion[`option${opt}` as keyof QuizQuestion] as string;
                const isSelected = selectedOption === opt;
                const isCorrect = currentQuestion.correctOption === opt;
                const showCorrectness = showResult && (isSelected || isCorrect);
                let buttonClass = "w-full text-left px-5 py-4 border-2 rounded-2xl transition-all flex items-center gap-4 font-medium ";
                if (showCorrectness) {
                  buttonClass += isCorrect ? "border-green-500 bg-green-50 text-green-800" : "border-red-500 bg-red-50 text-red-800";
                } else {
                  buttonClass += "border-slate-200 hover:border-red-500 hover:bg-red-50/50";
                }
                return (
                  <button key={opt} disabled={showResult} onClick={() => handleOptionClick(opt)} className={buttonClass}>
                    <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-sm">{opt}</span>
                    <span className="flex-1">{optionText}</span>
                    {showCorrectness && (isCorrect ? <FiCheckCircle className="h-6 w-6 text-green-600" /> : <FiXCircle className="h-6 w-6 text-red-600" />)}
                  </button>
                );
              })}
            </div>

            <AnimatePresence>
              {showResult && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="pt-6 border-t border-slate-200 flex justify-end">
                  <Button onClick={handleNext} className="btn-glow">{currentIndex < questions.length - 1 ? 'Siguiente pregunta' : 'Ver resultados'}</Button>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
