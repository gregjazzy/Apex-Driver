export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      apexdriver_profiles: {
        Row: {
          id: string
          role: 'coach' | 'student'
          full_name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role: 'coach' | 'student'
          full_name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: 'coach' | 'student'
          full_name?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      apexdriver_tasks: {
        Row: {
          id: string
          student_id: string
          title: string
          description: string | null
          status: boolean
          priority: 1 | 2 | 3
          due_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          title: string
          description?: string | null
          status?: boolean
          priority: 1 | 2 | 3
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          title?: string
          description?: string | null
          status?: boolean
          priority?: 1 | 2 | 3
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "apexdriver_tasks_student_id_fkey"
            columns: ["student_id"]
            referencedRelation: "apexdriver_profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      apexdriver_pomodoro_sessions: {
        Row: {
          id: string
          student_id: string
          duration: number
          status: 'completed' | 'abandoned'
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          duration: number
          status: 'completed' | 'abandoned'
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          duration?: number
          status?: 'completed' | 'abandoned'
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "apexdriver_pomodoro_sessions_student_id_fkey"
            columns: ["student_id"]
            referencedRelation: "apexdriver_profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
    CompositeTypes: {}
  }
}
