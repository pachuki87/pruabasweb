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
      courses: {
        Row: {
          id: string
          titulo: string
          description: string | null
          image_url: string | null
          teacher_id: string
          created_at: string
          technologies: string | null
        }
        Insert: {
          id?: string
          titulo: string
          description?: string | null
          image_url?: string | null
          teacher_id: string
          created_at?: string
          technologies?: string | null
        }
        Update: {
          id?: string
          titulo?: string
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
          titulo: string
          description: string | null
          curso_id: string
          video_url: string | null
          remarks: string | null
          created_at: string
        }
        Insert: {
          id?: string
          titulo: string
          description?: string | null
          curso_id: string
          video_url?: string | null
          remarks?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          titulo?: string
          description?: string | null
          curso_id?: string
          video_url?: string | null
          remarks?: string | null
          created_at?: string
        }
      }
      quizzes: {
        Row: {
          id: string
          titulo: string
          curso_id: string
          created_at: string
          chapter_id: string | null
        }
        Insert: {
          id?: string
          titulo: string
          curso_id: string
          created_at?: string
          chapter_id?: string | null
        }
        Update: {
          id?: string
          titulo?: string
          curso_id?: string
          created_at?: string
          chapter_id?: string | null
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
      study_materials: {
        Row: {
          id: string
          titulo: string
          curso_id: string
          file_url: string
          created_at: string
          chapter_id: string | null
          material_type: string | null
          description: string | null
          file_size: number | null
        }
        Insert: {
          id?: string
          titulo: string
          curso_id: string
          file_url: string
          created_at?: string
          chapter_id?: string | null
          material_type?: string | null
          description?: string | null
          file_size?: number | null
        }
        Update: {
          id?: string
          titulo?: string
          curso_id?: string
          file_url?: string
          created_at?: string
          chapter_id?: string | null
          material_type?: string | null
          description?: string | null
          file_size?: number | null
        }
      }
      user_course_progress: {
        Row: {
          id: string
          user_id: string
          curso_id: string
          leccion_id: string | null
          chapter_id: string | null
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
          chapter_id?: string | null
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
          chapter_id?: string | null
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
          quiz_id: string
          curso_id: string
          score: number
          total_questions: number
          correct_answers: number
          incorrect_answers: number
          time_taken_minutes: number | null
          passed: boolean
          attempt_number: number
          answers_data: Json | null
          started_at: string | null
          fecha_completado: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          quiz_id: string
          curso_id: string
          score: number
          total_questions: number
          correct_answers: number
          incorrect_answers: number
          time_taken_minutes?: number | null
          passed?: boolean
          attempt_number?: number
          answers_data?: Json | null
          started_at?: string | null
          fecha_completado?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          quiz_id?: string
          curso_id?: string
          score?: number
          total_questions?: number
          correct_answers?: number
          incorrect_answers?: number
          time_taken_minutes?: number | null
          passed?: boolean
          attempt_number?: number
          answers_data?: Json | null
          started_at?: string | null
          fecha_completado?: string | null
          created_at?: string
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