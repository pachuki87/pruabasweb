/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string
  readonly VITE_SUPABASE_SERVICE_KEY?: string
  readonly VITE_APP_URL?: string
  readonly NODE_ENV?: string
  // Más variables de entorno...
  [key: string]: string | undefined
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
