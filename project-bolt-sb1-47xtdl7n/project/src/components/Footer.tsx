import React from 'react';
import { Facebook, Twitter, Linkedin, Youtube, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    { icon: <Facebook className="h-5 w-5" />, href: "#" },
    { icon: <Twitter className="h-5 w-5" />, href: "#" },
    { icon: <Linkedin className="h-5 w-5" />, href: "#" },
    { icon: <Youtube className="h-5 w-5" />, href: "#" },
    { icon: <Instagram className="h-5 w-5" />, href: "#" }
  ];

  const footerSections = [
    {
      title: "Programas",
      links: ["MBA", "Executive MBA", "Global Executive MBA", "Master in Management", "Formación Ejecutiva"]
    },
    {
      title: "Investigación",
      links: ["Facultad", "Centros de Investigación", "Publicaciones", "Working Papers", "Casos de Estudio"]
    },
    {
      title: "Alumni",
      links: ["Red de Alumni", "Servicios", "Eventos", "Directorio", "Oportunidades"]
    },
    {
      title: "Campus",
      links: ["Barcelona", "Madrid", "Munich", "Nueva York", "São Paulo"]
    }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Logo and Contact */}
          <div className="lg:col-span-2">
            <div className="text-3xl font-bold text-red-500 mb-6">IESE</div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Business School de la Universidad de Navarra. Formando líderes empresariales 
              que impacten positivamente en las personas, las empresas y la sociedad.
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-gray-300">
                <Phone className="h-4 w-4 mr-3" />
                <span>+34 93 253 42 00</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Mail className="h-4 w-4 mr-3" />
                <span>info@iese.edu</span>
              </div>
              <div className="flex items-center text-gray-300">
                <MapPin className="h-4 w-4 mr-3" />
                <span>Av. Pearson, 21, 08034 Barcelona</span>
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
              © 2024 IESE Business School. Todos los derechos reservados.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;