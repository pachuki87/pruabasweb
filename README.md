# Instituto lidera Learning Platform

Esta es una plataforma de aprendizaje construida con React y Vite, utilizando Supabase para la base de datos y TailwindCSS para los estilos.

## Instalación

Para instalar las dependencias del proyecto, ejecuta el siguiente comando en la raíz del proyecto:

```bash
npm install
```

## Ejecución

Para iniciar el servidor de desarrollo y ejecutar la aplicación, usa el siguiente comando:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173/` en tu navegador.

## Estructura del Proyecto

El proyecto sigue una estructura modular, con componentes organizados por funcionalidad (autenticación, chat, cursos, etc.) y páginas para las diferentes vistas de la aplicación.

```
.
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── auth/
│   │   ├── chat/
│   │   ├── courses/
│   │   ├── dashboard/
│   │   ├── layout/
│   │   ├── materials/
│   │   ├── quiz/
│   │   ├── students/
│   │   └── video/
│   ├── lib/
│   │   ├── database.types.ts
│   │   └── supabase.ts
│   ├── pages/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   └── ...
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── .eslintrc.cjs
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.ts
