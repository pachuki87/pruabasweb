import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Cargar Stripe con la clave pública
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setMessage('Stripe no está cargado correctamente');
      return;
    }

    setIsLoading(true);
    setMessage('Procesando...');

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setMessage('Error: No se encontró el elemento de tarjeta');
      setIsLoading(false);
      return;
    }

    // Crear un método de pago
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      setMessage(`❌ Error: ${error.message}`);
    } else {
      setMessage(`✅ ¡Éxito! Método de pago creado: ${paymentMethod.id}`);
      console.log('Payment Method:', paymentMethod);
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border-2 border-gray-200 rounded-lg bg-white">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Información de la Tarjeta
        </label>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                fontFamily: 'system-ui, sans-serif',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>
      <button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Procesando...' : 'Probar Integración Stripe'}
      </button>
      {message && (
        <div className={`p-4 rounded-lg font-medium ${
          message.includes('✅') 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message}
        </div>
      )}
    </form>
  );
};

const StripeTest = () => {
  const [stripeConfig, setStripeConfig] = useState({
    publicKey: '',
    isValidKey: false,
    isLoaded: false,
    isTestKey: false
  });

  useEffect(() => {
    const publicKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';
    setStripeConfig({
      publicKey,
      isValidKey: publicKey.startsWith('pk_'),
      isLoaded: !!publicKey,
      isTestKey: publicKey.startsWith('pk_test_')
    });
  }, []);

  const getKeyStatus = () => {
    if (!stripeConfig.isLoaded) return { color: 'red', text: 'No configurada' };
    if (!stripeConfig.isValidKey) return { color: 'red', text: 'Formato inválido' };
    if (stripeConfig.publicKey.includes('placeholder')) return { color: 'yellow', text: 'Placeholder - Necesita clave real' };
    if (stripeConfig.isTestKey) return { color: 'green', text: 'Clave de prueba válida' };
    return { color: 'blue', text: 'Clave de producción' };
  };

  const keyStatus = getKeyStatus();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Prueba de Integración Stripe</h1>
          <p className="text-gray-600 mb-8">Verifica que tu configuración de Stripe funciona correctamente</p>
          
          {/* Estado de configuración */}
          <div className="mb-8 p-6 bg-gray-50 rounded-xl">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">📊 Estado de Configuración</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className={`w-4 h-4 rounded-full mr-3 ${
                    stripeConfig.isLoaded ? 'bg-green-500' : 'bg-red-500'
                  }`}></span>
                  <span className="font-medium">Clave pública: {stripeConfig.isLoaded ? '✅ Cargada' : '❌ No encontrada'}</span>
                </div>
                <div className="flex items-center">
                  <span className={`w-4 h-4 rounded-full mr-3 ${
                    stripeConfig.isValidKey ? 'bg-green-500' : 'bg-red-500'
                  }`}></span>
                  <span className="font-medium">Formato: {stripeConfig.isValidKey ? '✅ Válido' : '❌ Inválido'}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium text-gray-700">Estado: </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    keyStatus.color === 'green' ? 'bg-green-100 text-green-800' :
                    keyStatus.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                    keyStatus.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {keyStatus.text}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Clave: </span>
                  {stripeConfig.publicKey ? `${stripeConfig.publicKey.substring(0, 25)}...` : 'No configurada'}
                </div>
              </div>
            </div>
          </div>

          {/* Formulario de prueba o mensaje de configuración */}
          {stripeConfig.isValidKey && !stripeConfig.publicKey.includes('placeholder') ? (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">🧪 Formulario de Prueba</h2>
              <div className="bg-gray-50 p-6 rounded-xl">
                <Elements stripe={stripePromise}>
                  <CheckoutForm />
                </Elements>
              </div>
            </div>
          ) : (
            <div className="mb-8 p-6 bg-amber-50 border-2 border-amber-200 rounded-xl">
              <h2 className="text-2xl font-semibold mb-3 text-amber-800">⚠️ Configuración Requerida</h2>
              <p className="text-amber-700 mb-4">
                Para probar Stripe completamente, necesitas configurar una clave pública real en tu archivo .env:
              </p>
              <div className="bg-gray-800 text-green-400 p-4 rounded-lg font-mono text-sm">
                VITE_STRIPE_PUBLISHABLE_KEY=pk_test_tu_clave_real_aqui
              </div>
              <p className="text-sm text-amber-600 mt-3">
                💡 Obtén tus claves de prueba desde tu dashboard de Stripe
              </p>
            </div>
          )}

          {/* Información y tarjetas de prueba */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-blue-50 rounded-xl">
              <h3 className="font-semibold mb-3 text-blue-800">💳 Tarjetas de Prueba</h3>
              <div className="space-y-2 text-sm text-blue-700">
                <div><strong>Visa:</strong> 4242 4242 4242 4242</div>
                <div><strong>Mastercard:</strong> 5555 5555 5555 4444</div>
                <div><strong>Amex:</strong> 3782 822463 10005</div>
                <div><strong>Fecha:</strong> Cualquier fecha futura</div>
                <div><strong>CVC:</strong> Cualquier 3-4 dígitos</div>
              </div>
            </div>
            
            <div className="p-6 bg-green-50 rounded-xl">
              <h3 className="font-semibold mb-3 text-green-800">ℹ️ Información</h3>
              <ul className="text-sm space-y-1 text-green-700">
                <li>• Esta prueba solo crea métodos de pago</li>
                <li>• No se procesan pagos reales</li>
                <li>• Usa el modo de prueba de Stripe</li>
                <li>• Revisa la consola para más detalles</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StripeTest;