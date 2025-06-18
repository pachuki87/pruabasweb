import { Twitter, Youtube, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import visaLogo from '../../assets/Visa Inc._idDUM8TcN7_1.png';
import bizumLogo from '../../assets/Bizum_idSDhC8lZu_1.png';

// Payment Method Icons using real logos
const VisaIcon = () => (
  <img 
    src={visaLogo} 
    alt="Visa" 
    className="h-6 w-auto object-contain bg-white rounded px-2 py-1"
  />
);

const MastercardIcon = () => (
  <div className="h-6 w-12 bg-white rounded px-2 py-1 flex items-center justify-center">
    <svg width="32" height="20" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="10" r="6" fill="#EB001B"/>
      <circle cx="20" cy="10" r="6" fill="#F79E1B"/>
      <path d="M16 6c1.2 1.1 2 2.8 2 4s-.8 2.9-2 4c-1.2-1.1-2-2.8-2-4s.8-2.9 2-4z" fill="#FF5F00"/>
    </svg>
  </div>
);

const BizumIcon = () => (
  <img 
    src={bizumLogo} 
    alt="Bizum" 
    className="h-6 w-auto object-contain bg-white rounded px-2 py-1"
  />
);

const Footer = () => {
  const socialLinks = [
    { icon: <Twitter className="h-5 w-5" />, href: "#" },
    { icon: <Youtube className="h-5 w-5" />, href: "#" },
    { icon: <Instagram className="h-5 w-5" />, href: "#" }
  ];

  const footerSections = [
    {
      title: "Programas",
      links: ["Master en Adicciones e Intervención", "Master en Adicciones", "Experto en Conductas Adictivas"]
    },
    {
      title: "Cursos",
      links: ["Master en Adicciones e Intervención", "Master en Adicciones", "Experto en Conductas Adictivas"]
    },
    {
      title: "Alumni",
      links: ["Red de Alumni", "Servicios", "Eventos", "Directorio", "Oportunidades"]
    },
    {
      title: "Campus",
      links: ["Valencia", "Online"]
    }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Logo and Contact */}
          <div className="lg:col-span-2">
            <div className="text-3xl font-bold text-red-500 mb-6">Instituto Lidera</div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Instituto especializado en formación en adicciones e intervención psicosocial. 
              Formando profesionales expertos que impacten positivamente en el tratamiento y prevención de conductas adictivas.
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-gray-300">
                <Phone className="h-4 w-4 mr-3" />
                <span>+34 622 43 39 52</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Mail className="h-4 w-4 mr-3" />
                <span>liderainstituto@gmail.com</span>
              </div>
              <div className="flex items-center text-gray-300">
                <MapPin className="h-4 w-4 mr-3" />
                <span>Poeta Mas y Ros, 41 Valencia</span>
              </div>
            </div>
            
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="bg-gray-800 hover:bg-red-600 p-3 rounded-lg transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
          
          {/* Footer Sections */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="font-bold text-lg mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-wrap gap-6 mb-4 md:mb-0">
              <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                Política de Privacidad
              </a>
              <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                Términos de Uso
              </a>
              <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                Cookies
              </a>
              <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                Accesibilidad
              </a>
            </div>
            <div className="text-gray-400 text-sm">
              © 2024 Instituto Lidera. Todos los derechos reservados.
            </div>
          </div>
          
          {/* Payment Methods */}
          <div className="flex flex-col items-center mt-8 pt-6 border-t border-gray-800">
            <p className="text-gray-400 text-sm mb-4">Métodos de pago aceptados</p>
            <div className="flex items-center space-x-8">
              <div className="flex flex-col items-center space-y-2">
                <VisaIcon />
                <span className="text-xs text-gray-400">Visa</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <MastercardIcon />
                <span className="text-xs text-gray-400">Mastercard</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <BizumIcon />
                <span className="text-xs text-gray-400">Bizum</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
