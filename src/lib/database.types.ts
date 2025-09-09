export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      usuarios: {
        Row: {
          id: string
          email: string
          nombre: string | null
          name: string | null
          rol: 'estudiante' | 'profesor'
          creado_en: string
        }
        Insert: {
          id?: string
          email: string
          nombre?: string | null
          name?: string | null
          rol: 'estudiante' | 'profesor'
          creado_en?: string
        }
        Update: {
          id?: string
          email?: string
          nombre?: string | null
          name?: string | null
          rol?: 'estudiante' | 'profesor'
          creado_en?: string
        }
      }
      cursos: {
        Row: {
          id: string
          titulo: string
          descripcion: string | null
          imagen_url: string | null
          teacher_id: string
          creado_en: string
        }
        Insert: {
          id?: string
          titulo: string
          descripcion?: string | null
          imagen_url?: string | null
          teacher_id: string
          creado_en?: string
        }
        Update: {
          id?: string
          titulo?: string
          descripcion?: string | null
          imagen_url?: string | null
          teacher_id?: string
          creado_en?: string
        }
      }
      lecciones: {
        Row: {
          id: string
          curso_id: string
          titulo: string
          descripcion: string | null
          orden: number
          duracion_estimada: number | null
          imagen_url: string | null
          video_url: string | null
          tiene_cuestionario: boolean
          creado_en: string
          actualizado_en: string
          leccion_anterior_id: string | null
          leccion_siguiente_id: string | null
          archivo_url: string | null
        }
        Insert: {
          id?: string
          curso_id: string
          titulo: string
          descripcion?: string | null
          orden: number
          duracion_estimada?: number | null
          imagen_url?: string | null
          video_url?: string | null
          tiene_cuestionario?: boolean
          creado_en?: string
          actualizado_en?: string
          leccion_anterior_id?: string | null
          leccion_siguiente_id?: string | null
          archivo_url?: string | null
        }
        Update: {
          id?: string
          curso_id?: string
          titulo?: string
          descripcion?: string | null
          orden?: number
          duracion_estimada?: number | null
          imagen_url?: string | null
          video_url?: string | null
          tiene_cuestionario?: boolean
          creado_en?: string
          actualizado_en?: string
          leccion_anterior_id?: string | null
          leccion_siguiente_id?: string | null
          archivo_url?: string | null
        }
      }
      cuestionarios: {
        Row: {
          id: string
          titulo: string
          curso_id: string
          creado_en: string
          leccion_id: string | null
        }
        Insert: {
          id?: string
          titulo: string
          curso_id: string
          creado_en?: string
          leccion_id?: string | null
        }
        Update: {
          id?: string
          titulo?: string
          curso_id?: string
          creado_en?: string
          leccion_id?: string | null
        }
      }

      inscripciones: {
        Row: {
          id: string
          user_id: string
          curso_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          curso_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          curso_id?: string
          created_at?: string
        }
      }
      materiales: {
        Row: {
          id: string
          titulo: string
          curso_id: string
          url_archivo: string
          creado_en: string
          leccion_id: string | null
          tipo_material: string | null
          descripcion: string | null
          tamaño_archivo: number | null
        }
        Insert: {
          id?: string
          titulo: string
          curso_id: string
          url_archivo: string
          creado_en?: string
          leccion_id?: string | null
          tipo_material?: string | null
          descripcion?: string | null
          tamaño_archivo?: number | null
        }
        Update: {
          id?: string
          titulo?: string
          curso_id?: string
          url_archivo?: string
          creado_en?: string
          leccion_id?: string | null
          tipo_material?: string | null
          descripcion?: string | null
          tamaño_archivo?: number | null
        }
      }
      preguntas: {
        Row: {
          id: string
          cuestionario_id: string
          pregunta: string
          tipo: string
          orden: number
          explicacion: string | null
          creado_en: string
        }
        Insert: {
          id?: string
          cuestionario_id: string
          pregunta: string
          tipo: string
          orden: number
          explicacion?: string | null
          creado_en?: string
        }
        Update: {
          id?: string
          cuestionario_id?: string
          pregunta?: string
          tipo?: string
          orden?: number
          explicacion?: string | null
          creado_en?: string
        }
      }
      user_course_progress: {
        Row: {
          id: string
          user_id: string
          curso_id: string
          leccion_id: string | null
          estado: string
          progreso_porcentaje: number | null
          tiempo_estudiado: number | null
          fecha_inicio: string | null
          fecha_completado: string | null
          ultima_actividad: string | null
          notas_usuario: string | null
          marcadores: Json | null
          creado_en: string | null
          actualizado_en: string | null
        }
        Insert: {
          id?: string
          user_id: string
          curso_id: string
          leccion_id?: string | null
          estado: string
          progreso_porcentaje?: number | null
          tiempo_estudiado?: number | null
          fecha_inicio?: string | null
          fecha_completado?: string | null
          ultima_actividad?: string | null
          notas_usuario?: string | null
          marcadores?: Json | null
          creado_en?: string | null
          actualizado_en?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          curso_id?: string
          leccion_id?: string | null
          estado?: string
          progreso_porcentaje?: number | null
          tiempo_estudiado?: number | null
          fecha_inicio?: string | null
          fecha_completado?: string | null
          ultima_actividad?: string | null
          notas_usuario?: string | null
          marcadores?: Json | null
          creado_en?: string | null
          actualizado_en?: string | null
        }
      }
      user_test_results: {
        Row: {
          id: string
          user_id: string
          cuestionario_id: string
          curso_id: string
          leccion_id: string | null
          puntuacion: number
          puntuacion_maxima: number
          porcentaje: number
          tiempo_completado: number | null
          respuestas_detalle: Json | null
          aprobado: boolean
          fecha_completado: string
          creado_en: string
          actualizado_en: string
        }
        Insert: {
          id?: string
          user_id: string
          cuestionario_id: string
          curso_id: string
          leccion_id?: string | null
          puntuacion: number
          puntuacion_maxima: number
          porcentaje?: number
          tiempo_completado?: number | null
          respuestas_detalle?: Json | null
          aprobado?: boolean
          fecha_completado?: string
          creado_en?: string
          actualizado_en?: string
        }
        Update: {
          id?: string
          user_id?: string
          cuestionario_id?: string
          curso_id?: string
          leccion_id?: string | null
          puntuacion?: number
          puntuacion_maxima?: number
          porcentaje?: number
          tiempo_completado?: number | null
          respuestas_detalle?: Json | null
          aprobado?: boolean
          fecha_completado?: string
          creado_en?: string
          actualizado_en?: string
        }
      }
      user_course_summary: {
        Row: {
          lecciones_completadas: number | null
          curso_id: string
          creado_en: string | null
          id: string
          ultimo_acceso_en: string | null
          porcentaje_progreso: number | null
          iniciado_en: string | null
          total_lecciones: number | null
          tiempo_total_gastado: number | null
          actualizado_en: string | null
          user_id: string
        }
        Insert: {
          lecciones_completadas?: number | null
          curso_id: string
          creado_en?: string | null
          id?: string
          ultimo_acceso_en?: string | null
          porcentaje_progreso?: number | null
          iniciado_en?: string | null
          total_lecciones?: number | null
          tiempo_total_gastado?: number | null
          actualizado_en?: string | null
          user_id: string
        }
        Update: {
          lecciones_completadas?: number | null
          curso_id?: string
          creado_en?: string | null
          id?: string
          ultimo_acceso_en?: string | null
          porcentaje_progreso?: number | null
          iniciado_en?: string | null
          total_lecciones?: number | null
          tiempo_total_gastado?: number | null
          actualizado_en?: string | null
          user_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}