// Configuración de precios para testing y producción

export interface PriceConfig {
  original: number;
  testing: number;
}

export const COURSE_PRICES: Record<string, PriceConfig> = {
  'master-adicciones': {
    original: 199000, // €1990 en centavos
    testing: 100      // €1 en centavos
  },
  'curso-regular': {
    original: 2500,   // €25 en centavos
    testing: 100      // €1 en centavos
  },
  'taller': {
    original: 3000,   // €30 en centavos
    testing: 100      // €1 en centavos
  },
  'certificacion': {
    original: 5000,   // €50 en centavos
    testing: 100      // €1 en centavos
  }
};

// Función para obtener el precio según el modo (testing o producción)
export const getPrice = (courseType: string): number => {
  const isTestingMode = import.meta.env.VITE_TESTING_MODE === 'true';
  const priceConfig = COURSE_PRICES[courseType] || COURSE_PRICES['curso-regular'];
  
  return isTestingMode ? priceConfig.testing : priceConfig.original;
};

// Función para formatear precio en euros
export const formatPrice = (priceInCents: number): string => {
  return (priceInCents / 100).toFixed(2);
};

// Función para obtener precio del Master en Adicciones para mostrar
export const getMasterPrice = (): string => {
  const price = getPrice('master-adicciones');
  return formatPrice(price);
};

// Función para obtener precio del Master en Adicciones en centavos
export const getMasterPriceCents = (): number => {
  return getPrice('master-adicciones');
};