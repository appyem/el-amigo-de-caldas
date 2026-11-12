import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiTwitter, FiYoutube, FiMail, FiPhone } from 'react-icons/fi';

const quickLinks = [
  { name: 'Inicio', href: '/' },
  { name: 'Noticias', href: '/noticias' },
  { name: 'Agenda', href: '/agenda' },
  { name: 'Mapa', href: '/mapa' },
  { name: 'Contacto', href: '/contacto' },
];

const socialLinks = [
  { name: 'Facebook', href: '#', icon: FiFacebook },
  { name: 'Instagram', href: '#', icon: FiInstagram },
  { name: 'Twitter', href: '#', icon: FiTwitter },
  { name: 'YouTube', href: '#', icon: FiYoutube },
];

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-app py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white font-bold text-lg">
                AC
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">El Amigo de Caldas</h3>
                <p className="text-sm text-gray-400">Fredy Arenas - Diputado</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Comprometidos con el desarrollo y bienestar de todos los municipios de Caldas.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Enlaces rápidos
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Contacto
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <FiMail className="h-4 w-4" />
                <span>contacto@elamigodecaldas.com</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <FiPhone className="h-4 w-4" />
                <span>+57 300 123 4567</span>
              </li>
            </ul>
            <div className="flex gap-3 mt-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-800 text-gray-400 hover:bg-primary hover:text-white transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} El Amigo de Caldas. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
