import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

type FAQ = {
  id: string;
  question: string;
  answer: string;
};

type FaqsPageProps = {
  currentRole: string;
  onRoleChange: (role: string) => void;
};

const FaqsPage: React.FC<FaqsPageProps> = ({ currentRole, onRoleChange }) => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      // In a real implementation, we would fetch from Supabase
      // For demo purposes, we'll use mock data
      setTimeout(() => {
        const mockFaqs: FAQ[] = [
          {
            id: '1',
            question: '¿Cómo puedo registrarme como profesor?',
            answer: 'Puede registrarse como profesor insertando su información de enseñanza y luego verificando su nueva cuenta mediante el mensaje de correo electrónico.',
          },
          {
            id: '2',
            question: '¿Cómo me inscribo en un curso?',
            answer: 'Para inscribirse en un curso, simplemente navegue por el catálogo de cursos, seleccione el curso que le interese, y haga clic en el botón "Inscribirse". Deberá iniciar sesión para completar la inscripción.',
          },
          {
            id: '3',
            question: '¿Son gratuitos los cursos?',
            answer: 'Ofrecemos cursos gratuitos y premium. Los cursos gratuitos están claramente marcados, mientras que los cursos premium muestran su precio antes de la inscripción.',
          },
        ];
        
        setFaqs(mockFaqs);
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      setIsLoading(false);
    }
  };

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar currentRole={currentRole} onRoleChange={onRoleChange} />
      
      <main className="flex-grow bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-bold text-center mb-16 leading-tight">
              Preguntas <span className="text-red-400">Frecuentes</span>
            </h1>
            
            {isLoading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-12 bg-gray-700 rounded-lg mb-2"></div>
                    <div className="h-20 bg-gray-800 rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {faqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden"
                  >
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-750 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <span className="font-semibold text-white text-lg">
                        {faq.question}
                      </span>
                      {openFaq === faq.id ? (
                        <ChevronUp className="w-6 h-6 text-red-400" />
                      ) : (
                        <ChevronDown className="w-6 h-6 text-red-400" />
                      )}
                    </button>
                    
                    {openFaq === faq.id && (
                      <div className="px-6 pb-6 border-t border-gray-700">
                        <p className="text-gray-300">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FaqsPage;
