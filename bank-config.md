# 🏦 CONFIGURACIÓN BANCARIA - INSTITUTO LIDERA

## ✅ Datos Bancarios Confirmados

### ✅ Información de la Cuenta
- **IBAN**: ES0231590078582714496227
- **Titular**: Kompartia Coworking SL
- **Entidad**: Caixa Popular
- **País**: España

### 📞 Datos de Contacto (Instituto Lidera)
- **Teléfono**: +34 622 43 39 52
- **Email**: liderainstituto@gmail.com
- **Sitio Web**: https://institutolidera.com/
- **Razón Social**: Instituto Lidera

### 📋 Datos Adicionales Necesarios para TPV Virtual

Para completar la integración de pagos con Redsys (sistema español), necesitamos:

#### 🔑 Credenciales del TPV Virtual
1. **Código de Comercio (FUC)**
   - Proporcionado por Caixa Popular
   - Formato: Número de 9 dígitos
   - Ejemplo: 123456789

2. **Número de Terminal**
   - Proporcionado por Caixa Popular
   - Formato: Número de 3 dígitos
   - Ejemplo: 001

3. **Clave Secreta de Encriptación**
   - Proporcionada por Caixa Popular
   - Usada para firmar las transacciones
   - ⚠️ **CONFIDENCIAL** - No compartir

4. **URL de Notificaciones**
   - URL donde Redsys enviará confirmaciones
   - Ejemplo: `https://tudominio.com/api/payment/notification`

#### 🌐 URLs del Sistema Redsys
- **Entorno de Pruebas**: `https://sis-t.redsys.es:25443/sis/realizarPago`
- **Entorno de Producción**: `https://sis.redsys.es/sis/realizarPago`

## 📞 Próximos Pasos

### 1. Contactar con Caixa Popular
Solicitar:
- Código de Comercio (FUC)
- Número de Terminal
- Clave Secreta
- Documentación técnica del TPV virtual

### 2. Configuración Técnica
Una vez recibidos los datos:
- Actualizar variables de entorno
- Configurar endpoints de pago
- Implementar firma de transacciones
- Configurar webhooks de notificación

### 3. Testing
- Realizar pruebas en entorno de desarrollo
- Verificar transacciones de €1.00
- Confirmar recepción de notificaciones

## 🔒 Seguridad

- ✅ Todos los datos sensibles en variables de entorno
- ✅ Conexiones HTTPS obligatorias
- ✅ Validación de firmas en notificaciones
- ✅ Logs de transacciones para auditoría

---

**Estado Actual**: ✅ Datos bancarios recibidos
**Siguiente Paso**: 📞 Contactar Caixa Popular para credenciales TPV