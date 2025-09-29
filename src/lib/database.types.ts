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
<<<<<<< HEAD
      usuarios: {
        Row: {
          id: string
          email: string
          nombre: string | null
          name: string | null
          rol: 'estudiante' | 'profesor'
          creado_en: string
=======
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'student' | 'teacher'
          created_at: string
          mobile: string | null
          skills: string | null
          qualification: string | null
>>>>>>> 23ecef7f2d77187b165bee91051cef88a79a0940
        }
        Insert: {
          id?: string
          email: string
<<<<<<< HEAD
          nombre?: string | null
          name?: string | null
          rol: 'estudiante' | 'profesor'
          creado_en?: string
=======
          name: string
          role: 'student' | 'teacher'
          created_at?: string
          mobile?: string | null
          skills?: string | null
          qualification?: string | null
>>>>>>> 23ecef7f2d77187b165bee91051cef88a79a0940
        }
        Update: {
          id?: string
          email?: string
<<<<<<< HEAD
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
=======
          name?: string
          role?: 'student' | 'teacher'
          created_at?: string
          mobile?: string | null
          skills?: string | null
          qualification?: string | null
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          description: string | null
          image_url: string | null
          teacher_id: string
          created_at: string
          technologies: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          image_url?: string | null
          teacher_id: string
          created_at?: string
          technologies?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          image_url?: string | null
          teacher_id?: string
          created_at?: string
          technologies?: string | null
        }
      }
      chapters: {
        Row: {
          id: string
          title: string
          description: string | null
          course_id: string
          video_url: string | null
          remarks: string | null
>>>>>>> 23ecef7f2d77187b165bee91051cef88a79a0940
          created_at: string
        }
        Insert: {
          id?: string
<<<<<<< HEAD
          user_id: string
          curso_id: string
=======
          title: string
          description?: string | null
          course_id: string
          video_url?: string | null
          remarks?: string | null
>>>>>>> 23ecef7f2d77187b165bee91051cef88a79a0940
          created_at?: string
        }
        Update: {
          id?: string
<<<<<<< HEAD
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
          completed_at: string | null
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
          completed_at?: string | null
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
          completed_at?: string | null
          creado_en?: string
          actualizado_en?: string
        }
      }
      intentos_cuestionario: {
        Row: {
          id: string
          user_id: string
          cuestionario_id: string
          curso_id: string
          leccion_id: string | null
          numero_intento: number
          puntuacion: number | null
          puntuacion_maxima: number | null
          porcentaje: number | null
          tiempo_completado: number | null
          respuestas_detalle: Json | null
          completado: boolean
          fecha_inicio: string
          fecha_completado: string | null
          started_at: string | null
          creado_en: string
          actualizado_en: string
        }
        Insert: {
          id?: string
          user_id: string
          cuestionario_id: string
          curso_id: string
          leccion_id?: string | null
          numero_intento?: number
          puntuacion?: number | null
          puntuacion_maxima?: number | null
          porcentaje?: number | null
          tiempo_completado?: number | null
          respuestas_detalle?: Json | null
          completado?: boolean
          fecha_inicio?: string
          fecha_completado?: string | null
          started_at?: string | null
          creado_en?: string
          actualizado_en?: string
        }
        Update: {
          id?: string
          user_id?: string
          cuestionario_id?: string
          curso_id?: string
          leccion_id?: string | null
          numero_intento?: number
          puntuacion?: number | null
          puntuacion_maxima?: number | null
          porcentaje?: number | null
          tiempo_completado?: number | null
          respuestas_detalle?: Json | null
          completado?: boolean
          fecha_inicio?: string
          fecha_completado?: string | null
          started_at?: string | null
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
=======
          title?: string
          description?: string | null
          course_id?: string
          video_url?: string | null
          remarks?: string | null
          created_at?: string
        }
      }
      quizzes: {
        Row: {
          id: string
          title: string
          course_id: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          course_id: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          course_id?: string
          created_at?: string
        }
      }
      quiz_questions: {
        Row: {
          id: string
          quiz_id: string
          question: string
          options: string[]
          correct_option: number
          created_at: string
        }
        Insert: {
          id?: string
          quiz_id: string
          question: string
          options: string[]
          correct_option: number
          created_at?: string
        }
        Update: {
          id?: string
          quiz_id?: string
          question?: string
          options?: string[]
          correct_option?: number
          created_at?: string
        }
      }
      quiz_attempts: {
        Row: {
          id: string
          student_id: string
          quiz_id: string
          score: number
          total_questions: number
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          quiz_id: string
          score: number
          total_questions: number
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          quiz_id?: string
          score?: number
          total_questions?: number
          created_at?: string
        }
      }
      enrollments: {
        Row: {
          id: string
          student_id: string
          course_id: string
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          course_id: string
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          course_id?: string
          created_at?: string
        }
      }
      study_materials: {
        Row: {
          id: string
          title: string
          course_id: string
          file_url: string
          remarks: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          course_id: string
          file_url: string
          remarks?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          course_id?: string
          file_url?: string
          remarks?: string | null
          created_at?: string
>>>>>>> 23ecef7f2d77187b165bee91051cef88a79a0940
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