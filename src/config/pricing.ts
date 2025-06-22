// Configuración de precios - Precio fijo de €1.00 para todos los cursos

export const COURSE_PRICES: Record<string, number> = {
  'master-adicciones': 100, // €1.00 en centavos
  'curso-regular': 100,     // €1.00 en centavos
  'taller': 100,            // €1.00 en centavos
  'certificacion': 100      // €1.00 en centavos
};

// Función para obtener el precio de cualquier curso
export const getPrice = (courseType: string): number => {
  return COURSE_PRICES[courseType] || COURSE_PRICES['curso-regular'];
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