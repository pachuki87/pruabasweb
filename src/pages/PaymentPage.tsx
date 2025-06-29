import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CheckCircle, CreditCard } from 'lucide-react';
import { useCart } from 'react-use-cart';
import PaymentForm from '../components/PaymentForm';

interface CourseData {
  id: string;
  name: string;
  price: number;
  duration: string;
  description: string;
}

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { emptyCart } = useCart();
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);

  // Datos del curso (normalmente vendrían de la navegación o API)
  const courseData: CourseData = location.state?.courseData || {
    id: 'master-adicciones',
    name: 'Máster en Adicciones e Intervención Familiar',
    price: 2500,
    duration: '12 meses',
    description: 'Formación especializada en tratamiento y prevención de adicciones'
  };

  const handlePaymentSuccess = (data: any) => {
    setPaymentData(data);
    setPaymentCompleted(true);
    
    // Si es un carrito, vaciarlo después del pago exitoso
    if (isCartCheckout) {
      emptyCart();
    }
    
    // Aquí podrías enviar los datos a tu backend
    console.log('Pago completado:', data);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleBackToCourses = () => {
    navigate('/courses');
  };

  if (paymentCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-6">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              ¡Pago Completado!
            </h1>
            
            <p className="text-lg text-gray-600 mb-6">
              {isCartCheckout 
                ? 'Tu compra ha sido procesada exitosamente.' 
                : 'Tu inscripción al curso ha sido procesada exitosamente.'}
            </p>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">{isCartCheckout ? 'Detalles de la Compra' : 'Detalles de la compra'}:</h3>
              <div className="text-left space-y-2">
                {isCartCheckout ? (
                  <>
                    <div className="space-y-3">
                      {cartData.items.map((item, index) => (
                        <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                          </div>
                          <p className="font-medium">€{(item.price / 100).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                    <div className="pt-3 border-t border-gray-300">
                      <div className="flex justify-between items-center">
                        <p className="text-lg font-semibold">Total:</p>
                        <p className="text-lg font-bold text-blue-600">€{(cartData.total / 100).toFixed(2)}</p>
                      </div>
                      <p className="text-sm text-gray-600">{cartData.itemCount} curso(s)</p>
                    </div>
                  </>
                ) : (
                  <>
                    <p><span className="font-medium">Curso:</span> {displayData.name}</p>
                    <p><span className="font-medium">Importe:</span> €{(displayData.price / 100).toFixed(2)}</p>
                  </>
                )}
                <p><span className="font-medium">Método de pago:</span> {paymentData?.paymentMethod === 'card' ? 'Tarjeta de crédito' : 'Bizum'}</p>
                 <p><span className="font-medium">Fecha:</span> {new Date().toLocaleDateString('es-ES')}</p>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 text-sm">
                <strong>Próximos pasos:</strong><br />
                Recibirás un email de confirmación con los detalles de acceso al curso y la información para comenzar tu formación.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleBackToHome}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Volver al Inicio
              </button>
              <button
                onClick={handleBackToCourses}
                className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Ver Más Cursos
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="mr-2" size={20} />
            Volver
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Finalizar Inscripción
          </h1>
          <p className="text-gray-600">
            Completa tu pago para acceder al curso
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Información del curso o carrito */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {isCartCheckout ? 'Resumen de la compra' : 'Resumen del curso'}
            </h2>
            
            <div className="space-y-4">
              {isCartCheckout ? (
                <>
                  <div className="space-y-3">
                    {cartData.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                        </div>
                        <p className="font-medium text-gray-900">€{(item.price / 100).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Total de cursos:</span>
                      <span className="font-medium">{cartData.itemCount}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Modalidad:</span>
                      <span className="font-medium">Online</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Certificación:</span>
                      <span className="font-medium">Incluida</span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg">
                      <span className="font-semibold">Total:</span>
                      <span className="font-bold text-blue-600">€{(cartData.total / 100).toFixed(2)}</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h3 className="font-medium text-gray-900">{displayData.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{displayData.description}</p>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Duración:</span>
                      <span className="font-medium">{displayData.duration}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Modalidad:</span>
                      <span className="font-medium">Online</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Certificación:</span>
                      <span className="font-medium">Incluida</span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg">
                      <span className="font-semibold">Total:</span>
                      <span className="font-bold text-blue-600">€{(displayData.price / 100).toFixed(2)}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            {/* Características incluidas */}
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-3">Incluye:</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  Acceso completo al contenido
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  Material descargable
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  Tutorías personalizadas
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  Certificado oficial
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  Soporte técnico 24/7
                </li>
              </ul>
            </div>
          </div>

          {/* Formulario de pago */}
          <div>
            <PaymentForm
               amount={totalAmount}
               onPaymentSuccess={handlePaymentSuccess}
             />
            
            {/* Información de seguridad */}
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <CreditCard className="mr-2 h-5 w-5 text-gray-600" />
                <span className="font-medium text-gray-900">Pago Seguro</span>
              </div>
              <p className="text-sm text-gray-600">
                Tus datos están protegidos con encriptación SSL de 256 bits. 
                Aceptamos Visa, Mastercard y Bizum.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;