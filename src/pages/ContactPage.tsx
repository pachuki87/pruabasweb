import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer'; // Assuming you have a Footer component

interface ContactPageProps {
  currentRole: string;
  onRoleChange: (role: string) => void;
}

const ContactPage: React.FC<ContactPageProps> = ({ currentRole, onRoleChange }) => {
  return (
    <>
      <Header currentRole={currentRole} onRoleChange={onRoleChange} />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Contáctanos</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Envíanos un mensaje</h2>
            <form>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Nombre Completo</label>
                <input type="text" id="name" name="name" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lidera-light-blue" required />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Correo Electrónico</label>
                <input type="email" id="email" name="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lidera-light-blue" required />
              </div>
              <div className="mb-4">
                <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">Asunto</label>
                <input type="text" id="subject" name="subject" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lidera-light-blue" required />
              </div>
              <div className="mb-4">
                <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Mensaje</label>
                <textarea id="message" name="message" rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lidera-light-blue" required></textarea>
              </div>
              <button 
                type="submit" 
                className="w-full bg-lidera-light-blue text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#6a96c0] transition-colors duration-300"
              >
                Enviar Mensaje
              </button>
            </form>
          </div>

          {/* Contact Information Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Información de Contacto</h2>
            <p className="text-gray-700 mb-2">
              Si prefieres, puedes contactarnos directamente a través de los siguientes medios:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>
                <strong>Dirección:</strong> Poeta Mas y Ros, 41 Valencia 
              </li>
              <li>
                <strong>Teléfono:</strong> +34 622 43 39 52 
              </li>
              <li>
                <strong>Email:</strong> liderainstituto@gmail.com 
              </li>
            </ul>
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">Horario de Atención</h3>
              <p className="text-gray-700">Lunes a Viernes: 9:00 AM - 6:00 PM</p>
            </div>
            {/* You can add a map here if needed */}
            {/* e.g., <div className="mt-6 h-64 bg-gray-300 rounded-lg">Google Maps Placeholder</div> */}
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default ContactPage;
