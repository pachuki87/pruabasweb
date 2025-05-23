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
        }
        Insert: {
          id?: string
          email: string
          name: string
          role: 'student' | 'teacher'
          created_at?: string
          mobile?: string | null
          skills?: string | null
          qualification?: string | null
        }
        Update: {
          id?: string
          email?: string
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
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          course_id: string
          video_url?: string | null
          remarks?: string | null
          created_at?: string
        }
        Update: {
          id?: string
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