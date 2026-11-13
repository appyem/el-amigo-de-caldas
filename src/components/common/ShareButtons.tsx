import { useState } from 'react';
import { FiCopy, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface ShareButtonsProps {
  title: string;
  description: string;
  imageUrl?: string;
}

export function ShareButtons({ title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success(`Enlace de "${title}" copiado al portapapeles`);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      toast.success('Enlace copiado');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={
        copied
          ? 'px-6 py-3 bg-green-600 text-white font-bold rounded-xl flex items-center gap-2 text-sm md:text-base transition-all'
          : 'btn-glow px-6 py-3 bg-white text-red-600 font-bold rounded-xl flex items-center gap-2 text-sm md:text-base'
      }
    >
      {copied ? (
        <>
          <FiCheck className="h-5 w-5" />
          ¡Enlace copiado!
        </>
      ) : (
        <>
          <FiCopy className="h-5 w-5" />
          Copiar enlace
        </>
      )}
    </button>
  );
}
