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
          curso_id: string
          video_url: string | null
          remarks: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          curso_id: string
          video_url?: string | null
          remarks?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
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
          title: string
          curso_id: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          curso_id: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          curso_id?: string
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
          title: string
          curso_id: string
          file_url: string
          remarks: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          curso_id: string
          file_url: string
          remarks?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          curso_id?: string
          file_url?: string
          remarks?: string | null
          created_at?: string
        }
      }
      user_course_progress: {
        Row: {
          id: string
          user_id: string
          curso_id: string
          chapter_id: string | null
          progress_percentage: number
          completed_at: string | null
          last_accessed_at: string
          time_spent_minutes: number
          is_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          curso_id: string
          chapter_id?: string | null
          progress_percentage?: number
          completed_at?: string | null
          last_accessed_at?: string
          time_spent_minutes?: number
          is_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          curso_id?: string
          chapter_id?: string | null
          progress_percentage?: number
          completed_at?: string | null
          last_accessed_at?: string
          time_spent_minutes?: number
          is_completed?: boolean
          created_at?: string
          updated_at?: string
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
          completed_at: string | null
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
          completed_at?: string | null
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
          completed_at?: string | null
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