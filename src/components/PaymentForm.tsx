import React, { useState } from 'react';
import { CreditCard, Smartphone, Lock, AlertCircle, Building2, Copy, CheckCircle } from 'lucide-react';
import { usePaymentInputs } from 'react-payment-inputs';

interface PaymentFormProps {
  onPaymentSuccess?: (paymentData: any) => void;
  amount: number;
  courseName: string;
}

type PaymentMethod = 'card' | 'bizum' | 'transfer';

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
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
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

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Error copying to clipboard:', err);
    }
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
    // No validation needed for transfer method
    
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
        } : paymentMethod === 'bizum' ? {
          phone: formData.bizumPhone
        } : {
          transferReference: `REF-${Date.now()}`,
          bankAccount: 'ES0231590078582714496227'
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
          <p className="text-lg font-bold text-gray-900">{(amount / 100).toFixed(2)} €</p>
        </div>
      </div>

      {/* Selector de método de pago */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Método de pago
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setPaymentMethod('card')}
            className={`p-3 border rounded-lg flex flex-col items-center justify-center space-y-1 transition-colors ${
              paymentMethod === 'card'
                ? 'border-red-500 bg-red-50 text-red-700'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <CreditCard size={20} />
            <span className="text-xs font-medium">Tarjeta</span>
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod('bizum')}
            className={`p-3 border rounded-lg flex flex-col items-center justify-center space-y-1 transition-colors ${
              paymentMethod === 'bizum'
                ? 'border-red-500 bg-red-50 text-red-700'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <Smartphone size={20} />
            <span className="text-xs font-medium">Bizum</span>
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod('transfer')}
            className={`p-3 border rounded-lg flex flex-col items-center justify-center space-y-1 transition-colors ${
              paymentMethod === 'transfer'
                ? 'border-red-500 bg-red-50 text-red-700'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <Building2 size={20} />
            <span className="text-xs font-medium">Transferencia</span>
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

        {paymentMethod === 'transfer' && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Building2 className="text-blue-600" size={20} />
                <h4 className="font-semibold text-blue-900">Datos para Transferencia Bancaria</h4>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-white rounded border">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">IBAN</p>
                    <p className="font-mono text-sm font-medium">ES02 3159 0078 5827 1449 6227</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard('ES0231590078582714496227', 'iban')}
                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {copiedField === 'iban' ? (
                      <CheckCircle size={16} className="text-green-500" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                </div>
                
                <div className="flex justify-between items-center p-2 bg-white rounded border">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Titular</p>
                    <p className="text-sm font-medium">Kompartia Coworking SL</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard('Kompartia Coworking SL', 'holder')}
                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {copiedField === 'holder' ? (
                      <CheckCircle size={16} className="text-green-500" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                </div>
                
                <div className="flex justify-between items-center p-2 bg-white rounded border">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Banco</p>
                    <p className="text-sm font-medium">Caixa Popular</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard('Caixa Popular', 'bank')}
                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {copiedField === 'bank' ? (
                      <CheckCircle size={16} className="text-green-500" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                </div>
                
                <div className="flex justify-between items-center p-2 bg-white rounded border">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Concepto</p>
                    <p className="text-sm font-medium font-mono">{courseName} - REF-{Date.now().toString().slice(-6)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(`${courseName} - REF-${Date.now().toString().slice(-6)}`, 'concept')}
                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {copiedField === 'concept' ? (
                      <CheckCircle size={16} className="text-green-500" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                </div>
                
                <div className="flex justify-between items-center p-2 bg-white rounded border">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Importe</p>
                    <p className="text-lg font-bold text-red-600">€{(amount / 100).toFixed(2)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard((amount / 100).toFixed(2), 'amount')}
                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {copiedField === 'amount' ? (
                      <CheckCircle size={16} className="text-green-500" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertCircle className="text-yellow-600 mt-0.5" size={16} />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">Instrucciones importantes:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Realiza la transferencia con los datos exactos mostrados arriba</li>
                    <li>Incluye el concepto completo para identificar tu pago</li>
                    <li>El acceso al curso se activará tras confirmar el pago (24-48h)</li>
                    <li>Guarda el comprobante de transferencia</li>
                  </ul>
                </div>
              </div>
            </div>
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
                <span>Pagar {(amount / 100).toFixed(2)} €</span>
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