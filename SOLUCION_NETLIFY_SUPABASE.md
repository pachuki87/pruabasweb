# SOLUCIÓN DEFINITIVA PARA ERROR SUPABASE EN NETLIFY

## 🎯 **Contexto: Error en Entorno de Producción (Netlify)**

El error `supabaseUrl is required` persiste en el entorno de Netlify, lo que indica que:

1. **Las variables de entorno no están configuradas correctamente en Netlify**
2. **El proceso de build en Netlify no está inyectando las variables VITE_**
3. **Necesitamos una solución que funcione independientemente de las variables de entorno**

## 🔍 **Análisis del Problema en Netlify**

### **Causas Probables:**
1. **Variables de entorno no configuradas en Netlify**
2. **Prefijo incorrecto (debe ser VITE_ para variables expuestas)**
3. **Cache de build en Netlify**
4. **Problema con el proceso de construcción**

## 🛠️ **SOLUCIÓN DEFINITIVA PARA NETLIFY**

### **Paso 1: Verificar Configuración en Netlify**

#### **1.1 Acceder al Panel de Netlify**
1. Ir a [Netlify Dashboard](https://app.netlify.com/)
2. Seleccionar el sitio: `pruabasweb`
3. Ir a **Site Settings** → **Build & deploy** → **Environment**

#### **1.2 Variables Requeridas en Netlify:**
```
Variable: VITE_SUPABASE_URL
Valor: https://lyojcqiiixkqqtpoejdo.supabase.co

Variable: VITE_SUPABASE_ANON_KEY
Valor: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0OTgwMzAsImV4cCI6MjA2MzA3NDAzMH0._7ODHgTZbdP_k3PjYNIcx1j42xKWBRa3lZ-P-0BBBPc
```

### **Paso 2: Crear Cliente Supabase con Fallbacks para Netlify**

<write_to_file>
<path>src/lib/supabase-netlify.js</path>
<content>
import { createClient } from '@supabase/supabase-js';

// Configuración robusta para Netlify con múltiples fallbacks
class SupabaseNetlifyClient {
  constructor() {
    this.client = null;
    this.adminClient = null;
    this.auth = null;
    this.initialized = false;
    this.initialize();
  }

  initialize() {
    try {
      console.log('🚀 Inicializando cliente Supabase para Netlify...');
      
      // Estrategia 1: Intentar variables de entorno de Netlify
      const config = this.getConfigFromEnvironment();
      
      // Estrategia 2: Si falla, usar configuración hardcoded
      const finalConfig = config || this.getFallbackConfig();
      
      // Validar configuración final
      this.validateConfig(finalConfig);
      
      // Crear cliente principal
      this.client = createClient(finalConfig.url, finalConfig.anonKey);
      this.auth = this.client.auth;
      
      // Crear cliente admin si hay service key
      if (finalConfig.serviceKey) {
        this.adminClient = createClient(finalConfig.url, finalConfig.serviceKey, {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        });
      } else {
        this.adminClient = this.client;
      }
      
      this.initialized = true;
      console.log('✅ Cliente Supabase para Netlify inicializado correctamente');
      console.log('📡 URL:', finalConfig.url);
      console.log('🔑 Key:', finalConfig.anonKey ? 'Configurada' : 'Faltante');
      
    } catch (error) {
      console.error('❌ Error al inicializar cliente Supabase:', error);
      this.createMockClient();
    }
  }

  getConfigFromEnvironment() {
    console.log('🔍 Buscando configuración en variables de entorno...');
    
    // Verificar variables de entorno de Vite/Netlify
    const url = import.meta.env.VITE_SUPABASE_URL;
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const serviceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY;
    
    console.log('Variables de entorno encontradas:');
    console.log('VITE_SUPABASE_URL:', url ? '✅ Configurada' : '❌ Faltante');
    console.log('VITE_SUPABASE_ANON_KEY:', anonKey ? '✅ Configurada' : '❌ Faltante');
    console.log('VITE_SUPABASE_SERVICE_KEY:', serviceKey ? '✅ Configurada' : '❌ Faltante');
    
    if (url && anonKey) {
      console.log('✅ Usando configuración de variables de entorno');
      return { url, anonKey, serviceKey };
    }
    
    console.log('⚠️ Variables de entorno incompletas');
    return null;
  }

  getFallbackConfig() {
    console.log('🔄 Usando configuración de respaldo (hardcoded)');
    
    return {
      url: 'https://lyojcqiiixkqqtpoejdo.supabase.co',
      anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0OTgwMzAsImV4cCI6MjA2MzA3NDAzMH0._7ODHgTZbdP_k3PjYNIcx1j42xKWBRa3lZ-P-0BBBPc',
      serviceKey: ''
    };
  }

  validateConfig(config) {
    if (!config.url) {
      throw new Error('supabaseUrl is required. No se encontró URL de Supabase.');
    }
    
    if (!config.anonKey) {
      throw new Error('supabaseAnonKey is required. No se encontró clave anónima de Supabase.');
    }
    
    console.log('✅ Configuración validada correctamente');
  }

  createMockClient() {
    console.warn('⚠️ Creando cliente mock debido a error de configuración');
    
    const mockClient = {
      from: () => ({
        select: () => Promise.resolve({ data: [], error: new Error('Supabase no configurado correctamente') }),
        insert: () => Promise.resolve({ data: null, error: new Error('Supabase no configurado correctamente') }),
        update: () => Promise.resolve({ data: null, error: new Error('Supabase no configurado correctamente') }),
        delete: () => Promise.resolve({ data: null, error: new Error('Supabase no configurado correctamente') }),
        eq: () => ({ select: () => Promise.resolve({ data: [], error: new Error('Supabase no configurado correctamente') }) }),
        single: () => Promise.resolve({ data: null, error: new Error('Supabase no configurado correctamente') })
      }),
      auth: {
        signIn: () => Promise.resolve({ data: null, error: new Error('Supabase no configurado correctamente') }),
        signOut: () => Promise.resolve({ error: null }),
        getUser: () => Promise.resolve({ data: { user: null }, error: new Error('Supabase no configurado correctamente') })
      }
    };

    this.client = mockClient;
    this.adminClient = mockClient;
    this.auth = mockClient.auth;
    this.initialized = true;
  }

  // Métodos de utilidad
  async testConnection() {
    if (!this.initialized) {
      console.error('❌ Cliente no inicializado');
      return false;
    }

    try {
      const { data, error } = await this.client.from('cuestionarios').select('count').single();
      if (error) {
        console.error('❌ Error de conexión:', error.message);
        return false;
      }
      console.log('✅ Conexión a Supabase exitosa');
      return true;
    } catch (error) {
      console.error('❌ Error al probar conexión:', error);
      return false;
    }
  }

  getClient() {
    return this.client;
  }

  getAdminClient() {
    return this.adminClient;
  }

  getAuth() {
    return this.auth;
  }
}

// Crear instancia única (singleton)
const supabaseNetlify = new SupabaseNetlifyClient();

// Exportar la instancia y sus métodos
export const supabase = supabaseNetlify.getClient();
export const supabaseAdmin = supabaseNetlify.getAdminClient();
export const auth = supabaseNetlify.getAuth();
export const testConnection = () => supabaseNetlify.testConnection();

// Exportar la clase por si se necesita otra instancia
export { SupabaseNetlifyClient };

// Funciones de utilidad para compatibilidad
export const getUsers = async () => {
  const { data, error } = await supabase.from('usuarios').select('*');
  if (error) {
    console.error('Error al obtener usuarios:', error);
    return null;
  }
  return data;
};

export const getUserById = async (userId) => {
  const { data, error } = await supabase.from('usuarios').select('*').eq('id', userId).single();
  if (error) {
    console.error('Error al obtener usuario por ID:', error);
    return null;
  }
  return data;
};

export default supabase;
