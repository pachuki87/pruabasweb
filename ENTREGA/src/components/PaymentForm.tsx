import React, { useState } from 'react';
import { CreditCard, Smartphone, Lock, AlertCircle } from 'lucide-react';
import { usePaymentInputs } from 'react-payment-inputs';

interface PaymentFormProps {
  onPaymentSuccess?: (paymentData: any) => void;
  amount: number;
  courseName: string;
}

type PaymentMethod = 'card' | 'bizum';

const PaymentForm: React.FC<PaymentFormProps> = ({ 
  onPaymentSuccess, 
  amount, 
  courseName 
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    cardholderName: '',
    bizumPhone: ''
  });
  
  const {
    meta,
    getCardNumberProps,
    getExpiryDateProps,
    getCVCProps
  } = usePaymentInputs();
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validación de tarjeta de crédito
  const validateCardNumber = (cardNumber: string) => {
    const cleaned = cardNumber.replace(/\s/g, '');
    const cardRegex = /^[0-9]{13,19}$/;
    return cardRegex.test(cleaned);
  };

  const validateExpiryDate = (expiryDate: string) => {
    const regex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!regex.test(expiryDate)) return false;
    
    const [month, year] = expiryDate.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    const expYear = parseInt(year);
    const expMonth = parseInt(month);
    
    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
      return false;
    }
    
    return true;
  };

  const validateCVC = (cvc: string) => {
    return /^[0-9]{3,4}$/.test(cvc);
  };

  const validateBizumPhone = (phone: string) => {
    const cleaned = phone.replace(/\s/g, '');
    return /^[6-7][0-9]{8}$/.test(cleaned);
  };

  // Funciones de formateo ahora manejadas por react-payment-inputs

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar errores cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (paymentMethod === 'card') {
      if (!formData.cardholderName.trim()) {
        newErrors.cardholderName = 'El nombre del titular es requerido';
      }
      
      if (!validateCardNumber(formData.cardNumber)) {
        newErrors.cardNumber = 'Número de tarjeta inválido';
      }
      
      if (!validateExpiryDate(formData.expiryDate)) {
        newErrors.expiryDate = 'Fecha de vencimiento inválida';
      }
      
      if (!validateCVC(formData.cvc)) {
        newErrors.cvc = 'CVC inválido';
      }
    } else if (paymentMethod === 'bizum') {
      if (!validateBizumPhone(formData.bizumPhone)) {
        newErrors.bizumPhone = 'Número de teléfono inválido';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Simular procesamiento de pago
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const paymentData = {
        method: paymentMethod,
        amount,
        courseName,
        timestamp: new Date().toISOString(),
        ...(paymentMethod === 'card' ? {
          last4: formData.cardNumber.slice(-4),
          cardholderName: formData.cardholderName
        } : {
          phone: formData.bizumPhone
        })
      };
      
      onPaymentSuccess?.(paymentData);
    } catch (error) {
      console.error('Error procesando el pago:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Finalizar Compra</h3>
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-600">{courseName}</p>
          <p className="text-lg font-bold text-gray-900">{amount.toFixed(2)} €</p>
        </div>
      </div>

      {/* Selector de método de pago */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Método de pago
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setPaymentMethod('card')}
            className={`p-3 border rounded-lg flex items-center justify-center space-x-2 transition-colors ${
              paymentMethod === 'card'
                ? 'border-red-500 bg-red-50 text-red-700'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <CreditCard size={20} />
            <span className="text-sm font-medium">Tarjeta</span>
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod('bizum')}
            className={`p-3 border rounded-lg flex items-center justify-center space-x-2 transition-colors ${
              paymentMethod === 'bizum'
                ? 'border-red-500 bg-red-50 text-red-700'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <Smartphone size={20} />
            <span className="text-sm font-medium">Bizum</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {paymentMethod === 'card' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del titular
              </label>
              <input
                type="text"
                value={formData.cardholderName}
                onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  errors.cardholderName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Juan Pérez"
              />
              {errors.cardholderName && (
                <p className="text-red-500 text-xs mt-1">{errors.cardholderName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de tarjeta
              </label>
              <input
                  {...getCardNumberProps({
                    onChange: (e) => handleInputChange('cardNumber', e.target.value)
                  })}
                  placeholder="1234 5678 9012 3456"
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              {errors.cardNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de vencimiento
                </label>
                <input
                  {...getExpiryDateProps({
                    onChange: (e) => handleInputChange('expiryDate', e.target.value)
                  })}
                  placeholder="MM/AA"
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.expiryDate && (
                  <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVC
                </label>
                <input
                  {...getCVCProps({
                    onChange: (e) => handleInputChange('cvc', e.target.value)
                  })}
                  placeholder="123"
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    errors.cvc ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.cvc && (
                  <p className="text-red-500 text-xs mt-1">{errors.cvc}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {paymentMethod === 'bizum' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número de teléfono
            </label>
            <input
              type="tel"
              value={formData.bizumPhone}
              onChange={(e) => handleInputChange('bizumPhone', e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                errors.bizumPhone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="612 345 678"
              maxLength={9}
            />
            {errors.bizumPhone && (
              <p className="text-red-500 text-xs mt-1">{errors.bizumPhone}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Recibirás una notificación en tu app de Bizum
            </p>
          </div>
        )}

        <div className="mt-6">
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Procesando...</span>
              </>
            ) : (
              <>
                <Lock size={20} />
                <span>Pagar {amount.toFixed(2)} €</span>
              </>
            )}
          </button>
        </div>

        <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-gray-500">
          <CheckCircle size={16} />
          <span>Pago seguro y encriptado</span>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;