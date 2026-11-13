import { useEffect } from 'react';

interface MetaOptions {
  title: string;
  description: string;
  image?: string;
  url?: string;
}

export function useDynamicMeta({ title, description, image, url }: MetaOptions) {
  useEffect(() => {
    // Título de la pestaña
    const originalTitle = document.title;
    document.title = title;

    // Helper para crear/actualizar meta tags
    const setMeta = (property: string, content: string, isProperty: boolean = true) => {
      const selector = isProperty
        ? `meta[property="${property}"]`
        : `meta[name="${property}"]`;
      let tag = document.querySelector(selector) as HTMLMetaElement | null;
      if (!tag) {
        tag = document.createElement('meta');
        if (isProperty) tag.setAttribute('property', property);
        else tag.setAttribute('name', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    // Open Graph
    setMeta('og:title', title);
    setMeta('og:description', description);
    if (image) setMeta('og:image', image);
    if (url) setMeta('og:url', url);

    // Twitter
    setMeta('twitter:title', title, false);
    setMeta('twitter:description', description, false);
    if (image) setMeta('twitter:image', image, false);

    // Meta description estándar
    setMeta('description', description, false);

    return () => {
      document.title = originalTitle;
    };
  }, [title, description, image, url]);
}
