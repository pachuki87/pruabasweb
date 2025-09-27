# ENTREGA PROYECTO - INSTITUTO LIDERA

## Resumen del Proyecto
Este es un paquete completo para la plataforma de e-learning del Instituto Lidera, una aplicación web completa construida con React, TypeScript y Supabase que ofrece cursos especializados en adicciones e intervención psicosocial.

## Estructura del Proyecto

### Directorios Principales
- **src/** - Código fuente completo de la aplicación React/TypeScript
- **public/** - Todos los activos estáticos y contenido del curso
- **database/** - Esquemas y migraciones de la base de datos
- **docs/** - Documentación adicional
- **netlify/** - Configuración de despliegue

## Componentes Incluidos

### Sistema de Autenticación
- AuthContext.tsx - Gestión de autenticación
- Páginas de login y registro
- Integración con Supabase Auth

### Dashboard y Navegación
- DashboardLayout.tsx - Layout principal
- StudentDashboard.tsx - Panel de estudiante
- LessonNavigation.tsx - Navegación entre lecciones

### Sistema de Lecciones
- LessonViewer.tsx - Visor de contenido de lecciones
- QuizForm.tsx - Sistema de cuestionarios
- LessonPage.tsx - Páginas de lecciones individuales

### Procesamiento de Pagos
- PaymentForm.tsx - Formulario de pago integrado

## Cursos Incluidos

### 1. Experto en Conductas Adictivas
- 10 módulos completos
- Material didáctico en PDF
- Cuestionarios evaluativos
- Videos complementarios

### 2. MÁSTER EN ADICCIONES E INTERVENCIÓN PSICOSOCIAL
- 11 módulos completos
- Contenido teórico y práctico
- Evaluaciones por módulo
- Material complementario

## Contenido del Curso

### Archivos de Contenido
- **44 archivos HTML** con contenido de lecciones
- **50 archivos PDF** con material didáctico
- **5 videos** formativos y de testimonios
- Imágenes y multimedia

### Estructura de Lecciones
- Contenido teórico detallado
- Material complementario
- Cuestionarios de evaluación
- Ejercicios prácticos

## Configuración y Despliegue

### Archivos de Configuración
- **package.json** - Dependencias del proyecto
- **vite.config.ts** - Configuración de Vite
- **tailwind.config.js** - Configuración de Tailwind CSS
- **tsconfig.json** - Configuración de TypeScript
- **.env.example** - Variables de entorno de ejemplo

### Despliegue
- **netlify/functions/** - Funciones serverless
- **_redirects** - Configuración de rutas
- Configuración para Netlify y Vercel

### Base de Datos
- **supabase/migrations/** - Migraciones completas
- Esquemas de tablas (cursos, lecciones, usuarios, etc.)
- Políticas de seguridad (RLS)
- Funciones y triggers

## Funcionalidades Principales

### 1. Sistema de Usuarios
- Registro y autenticación
- Perfiles de usuario
- Seguimiento de progreso

### 2. Gestión de Cursos
- Inscripción a cursos
- Navegación por módulos
- Seguimiento de avance

### 3. Sistema de Evaluación
- Cuestionarios interactivos
- Calificación automática
- Historial de resultados

### 4. Plataforma de Pago
- Integración de pasarela de pago
- Gestión de suscripciones
- Confirmación de pagos

## Tecnologías Utilizadas

### Frontend
- **React 18** con TypeScript
- **Vite** como bundler
- **Tailwind CSS** para estilos
- **React Router** para navegación

### Backend
- **Supabase** como base de datos y backend
- **Netlify Functions** para funciones serverless
- **Netlify** para despliegue y hosting

### Desarrollo
- **ESLint** para calidad de código
- **TypeScript** para tipado estático
- **Prettier** para formato de código

## Instrucciones de Instalación

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Configurar Variables de Entorno
Copiar `.env.example` a `.env` y configurar:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- VITE_STRIPE_PUBLIC_KEY

### 3. Configurar Base de Datos
- Crear proyecto en Supabase
- Ejecutar migraciones desde `database/supabase/migrations/`
- Configurar políticas de seguridad

### 4. Ejecutar en Desarrollo
```bash
npm run dev
```

### 5. Construir para Producción
```bash
npm run build
```

## Estadísticas del Proyecto

### Archivos
- **348 archivos** TypeScript/JavaScript
- **44 archivos** HTML
- **50 archivos** PDF
- **44 archivos** de configuración JSON

### Tamaño
- **~241 MB** de contenido estático
- Incluye todo el material didáctico

### Funcionalidades
- 2 cursos completos
- 21 módulos en total
- Sistema de evaluación completo
- Plataforma de pago integrada

## Verificación de Funcionalidad

El paquete incluye:
✅ Código fuente completo y funcional
✅ Todos los componentes React/TypeScript
✅ Todo el contenido de los cursos (HTML, PDF, videos)
✅ Configuración de despliegue
✅ Esquemas de base de datos
✅ Documentación completa

## Notas para la Evaluación

1. **Base de Datos**: Se requiere configurar un proyecto en Supabase y ejecutar las migraciones
2. **Variables de Entorno**: Configurar las variables necesarias en el archivo .env
3. **Pagos**: Configurar claves de Stripe para la funcionalidad de pago
4. **Despliegue**: El proyecto está configurado para despliegue en Netlify o Vercel

## Contacto

Para cualquier consulta sobre el proyecto o configuración, contactar al equipo de desarrollo.

---

**Fecha de Entrega**: 26 de septiembre de 2025
**Versión**: 1.0.0
**Estado**: Completo y funcional