# CONFIGURACIÓN DE PAGOS - INSTITUTO LIDERA

## 📋 DATOS BANCARIOS PARA CONFIGURACIÓN

### Información Pendiente de Recibir:
- **Nombre del Banco**: [PENDIENTE]
- **Número de Cuenta (IBAN)**: [PENDIENTE]
- **Código SWIFT/BIC**: [PENDIENTE]
- **Titular de la Cuenta**: [PENDIENTE]
- **Dirección del Banco**: [PENDIENTE]

### Datos Adicionales Necesarios:
- **Código de Comercio**: [PENDIENTE]
- **Terminal Virtual**: [PENDIENTE]
- **Clave Secreta**: [PENDIENTE]
- **URL de Notificaciones**: [PENDIENTE]

---

## 💰 CONFIGURACIÓN DE PRECIOS PARA TESTING

### Precios Actuales vs Precios de Prueba:

| Curso | Precio Original | Precio Testing |
|-------|----------------|----------------|
| Master en Adicciones | €2,500 | €1.00 |
| Cursos Regulares | €500-1,500 | €1.00 |
| Talleres | €200-400 | €1.00 |
| Certificaciones | €300-800 | €1.00 |

---

## 🔧 ARCHIVOS A MODIFICAR PARA PRECIOS DE TESTING

### 1. Variables de Entorno (.env)
```env
# Modo de testing
VITE_TESTING_MODE=true
VITE_TEST_PRICE=1.00

# Datos bancarios (cuando se reciban)
VITE_BANK_ACCOUNT_IBAN=ES00_0000_0000_0000_0000_0000
VITE_BANK_SWIFT=BANKESXX
VITE_MERCHANT_CODE=999008881
VITE_TERMINAL=001
```

### 2. Componentes a Actualizar:
- `src/components/PaymentForm.tsx`
- `src/pages/PaymentPage.tsx`
- `src/components/courses/MasterAdiccionesContent.tsx`
- `src/components/Programs.tsx`
- `src/components/Cart.tsx`

### 3. Lógica de Precios Condicional:
```javascript
// Función para obtener precio según modo
const getPrice = (originalPrice) => {
  return process.env.VITE_TESTING_MODE === 'true' 
    ? parseFloat(process.env.VITE_TEST_PRICE) 
    : originalPrice;
};
```

---

## 📝 CHECKLIST DE IMPLEMENTACIÓN

### Fase 1: Configuración Básica
- [ ] Recibir datos bancarios completos
- [ ] Crear archivo .env con configuración
- [x] Implementar lógica de precios condicional
- [x] Actualizar componentes con precios de testing
- [x] Crear archivo de configuración de precios (src/config/pricing.ts)
- [x] Actualizar variables de entorno (.env)

### Fase 2: Integración de Pagos
- [ ] Configurar Stripe con datos bancarios
- [ ] Configurar Bizum/Redsys
- [ ] Crear endpoints de backend
- [ ] Implementar webhooks

### Fase 3: Testing
- [ ] Realizar compras de prueba a 1€
- [ ] Verificar flujo completo de pago
- [ ] Probar notificaciones y confirmaciones
- [ ] Validar almacenamiento de transacciones

### Fase 4: Producción
- [ ] Cambiar a precios reales
- [ ] Configurar entorno de producción
- [ ] Activar modo live en proveedores
- [ ] Monitoreo y logs

---

## 🚨 NOTAS IMPORTANTES

1. **Seguridad**: Los datos bancarios NUNCA deben estar en el código fuente
2. **Testing**: Usar siempre entorno sandbox/test antes de producción
3. **Compliance**: Verificar cumplimiento PCI DSS para manejo de tarjetas
4. **Backup**: Mantener respaldo de todas las transacciones
5. **Logs**: Implementar logging detallado para auditorías

---

## 📞 PRÓXIMOS PASOS

1. **Enviar datos bancarios** para completar configuración
2. **Confirmar proveedores** de pago preferidos (Stripe, Redsys, etc.)
3. **Definir flujo** de confirmación de pagos
4. **Establecer política** de reembolsos
5. **Configurar notificaciones** por email/SMS

---

*Documento creado: [FECHA ACTUAL]*
*Última actualización: Pendiente de datos bancarios*