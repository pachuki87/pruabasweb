# 🧪 Sistema de Precios de Testing Implementado

## ✅ Cambios Realizados

### 1. Configuración de Precios Dinámicos
- **Archivo creado**: `src/config/pricing.ts`
- **Funcionalidad**: Sistema centralizado para manejar precios de testing vs producción
- **Precios de testing**: Todos los cursos a €1.00

### 2. Variables de Entorno
- **Archivo actualizado**: `.env`
- **Nueva variable**: `VITE_TESTING_MODE=true`
- **Efecto**: Cuando está en `true`, todos los precios se muestran a €1.00

### 3. Componentes Actualizados

#### MasterAdiccionesContent.tsx
- ✅ Ahora usa `getMasterPrice()` para mostrar el precio dinámico
- ✅ Precio cambia automáticamente según el modo (€1.00 en testing, €1990 en producción)

#### PaymentPage.tsx
- ✅ Usa `getMasterPriceCents()` para el precio en centavos
- ✅ Integrado con el sistema de precios dinámicos

#### CourseCard.tsx
- ✅ Usa `getMasterPriceCents()` para agregar al carrito
- ✅ Precio del carrito refleja el modo de testing

## 🎯 Cómo Funciona

### Modo Testing (Actual)
```env
VITE_TESTING_MODE=true
```
- Todos los cursos: **€1.00**
- Ideal para simulacros de compra
- Perfecto para pruebas de integración de pagos

### Modo Producción
```env
VITE_TESTING_MODE=false
```
- Master en Adicciones: **€1990.00**
- Cursos regulares: **€25.00**
- Talleres: **€30.00**
- Certificaciones: **€50.00**

## 🔧 Configuración de Precios

El archivo `src/config/pricing.ts` contiene:

```typescript
export const COURSE_PRICES: Record<string, PriceConfig> = {
  'master-adicciones': {
    original: 199000, // €1990 en centavos
    testing: 100      // €1 en centavos
  },
  // ... más cursos
};
```

## 🚀 Próximos Pasos

### Para Activar Pagos Reales:
1. **Obtener datos bancarios completos**
2. **Configurar Stripe/Redsys**
3. **Implementar webhooks de pago**
4. **Crear backend para procesar transacciones**

### Para Cambiar a Producción:
1. Cambiar `VITE_TESTING_MODE=false` en `.env`
2. Configurar claves de pago reales
3. Activar SSL en producción

## 💡 Beneficios del Sistema

- ✅ **Fácil testing**: Compras a €1 para pruebas
- ✅ **Centralizado**: Un solo lugar para manejar precios
- ✅ **Flexible**: Cambio rápido entre testing y producción
- ✅ **Escalable**: Fácil agregar nuevos cursos y precios
- ✅ **Seguro**: No hay precios hardcodeados en componentes

## 🎮 Cómo Probar

1. **Navegar al Master en Adicciones**
2. **Verificar que el precio muestra €1.00**
3. **Agregar al carrito**
4. **Proceder al checkout**
5. **Verificar que el total es €1.00**
6. **Realizar simulacro de pago**

---

**Estado**: ✅ **IMPLEMENTADO Y FUNCIONANDO**
**Modo Actual**: 🧪 **TESTING (€1.00)**
**Listo para**: 💳 **SIMULACROS DE COMPRA**