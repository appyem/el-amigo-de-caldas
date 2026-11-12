import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Loader } from '@/components/ui/Loader';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { getPublishedQuizQuestions, QuizQuestion } from '@/services/firebase/games';
import { FiCheckCircle, FiXCircle, FiRefreshCw, FiAward } from 'react-icons/fi';

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
        // Mezclar preguntas aleatoriamente
        const shuffled = data.sort(() => 0.5 - Math.random());
        setQuestions(shuffled.slice(0, 10)); // Máximo 10 preguntas por partida
      } catch (err) { setError('Error al cargar el juego'); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const handleOptionClick = (option: string) => {
    if (showResult) return;
    setSelectedOption(option);
    setShowResult(true);
    if (option === questions[currentIndex].correctOption) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setShowResult(false);
    setIsFinished(false);
    // Volver a mezclar
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    setQuestions(shuffled);
  };

  if (loading) return <Loader variant="fullscreen" text="Preparando la trivia..." />;
  if (error) return <ErrorState title="Error" description={error} onRetry={() => window.location.reload()} />;
  if (questions.length === 0) return <div className="container-app py-12"><EmptyState title="Juego no disponible" description="Pronto habrá nuevas preguntas para poner a prueba tu conocimiento sobre Caldas." /></div>;

  if (isFinished) {
    const percentage = (score / questions.length) * 100;
    let message = "¡Sigue aprendiendo!";
    if (percentage >= 80) message = "¡Eres un experto en Caldas!";
    else if (percentage >= 50) message = "¡Buen conocimiento!";

    return (
      <div className="container-app py-12 flex items-center justify-center min-h-[60vh]">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full text-center">
          <Card>
            <CardContent className="p-8 space-y-6">
              <div className="flex justify-center"><FiAward className="h-16 w-16 text-primary" /></div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{message}</h2>
                <p className="text-gray-600 mt-2">Obtuviste <span className="font-bold text-primary text-xl">{score}</span> de <span className="font-bold">{questions.length}</span> respuestas correctas.</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} className="h-full bg-primary" />
              </div>
              <Button onClick={handleRestart} className="w-full"><FiRefreshCw className="mr-2 h-4 w-4" /> Jugar de nuevo</Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="container-app py-12 max-w-3xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Trivia de Caldas</h1>
        <p className="mt-4 text-lg text-gray-600">Pon a prueba tus conocimientos sobre nuestro departamento.</p>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Pregunta {currentIndex + 1} de {questions.length}</span>
            <Badge variant="primary">{currentQuestion.category}</Badge>
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-snug">{currentQuestion.question}</h2>

          <div className="space-y-3">
            {['A', 'B', 'C', 'D'].map((opt) => {
              const optionText = currentQuestion[`option${opt}` as keyof QuizQuestion] as string;
              const isSelected = selectedOption === opt;
              const isCorrect = currentQuestion.correctOption === opt;
              const showCorrectness = showResult && (isSelected || isCorrect);

              let buttonClass = "w-full text-left justify-start px-4 py-3 h-auto border-2 ";
              if (showCorrectness) {
                buttonClass += isCorrect ? "border-green-500 bg-green-50 text-green-800" : "border-red-500 bg-red-50 text-red-800";
              } else {
                buttonClass += "border-gray-200 hover:border-primary hover:bg-primary-50";
              }

              return (
                <button key={opt} disabled={showResult} onClick={() => handleOptionClick(opt)} className={buttonClass + " rounded-lg transition-all flex items-center gap-3"}>
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-sm">{opt}</span>
                  <span className="flex-1">{optionText}</span>
                  {showCorrectness && (isCorrect ? <FiCheckCircle className="h-5 w-5 text-green-600" /> : <FiXCircle className="h-5 w-5 text-red-600" />)}
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {showResult && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="pt-4 border-t border-gray-200 flex justify-end">
                <Button onClick={handleNext}>{currentIndex < questions.length - 1 ? 'Siguiente pregunta' : 'Ver resultados'}</Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
