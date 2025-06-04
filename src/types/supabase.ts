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
      profiles: {
        Row: {
          id: string
          created_at: string
          email: string
          full_name: string
          profession: string
          license_number: string
          avatar_url: string | null
          total_cpd_points: number
          required_annual_points: number
        }
        Insert: {
          id: string
          created_at?: string
          email: string
          full_name: string
          profession?: string
          license_number?: string
          avatar_url?: string | null
          total_cpd_points?: number
          required_annual_points?: number
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          full_name?: string
          profession?: string
          license_number?: string
          avatar_url?: string | null
          total_cpd_points?: number
          required_annual_points?: number
        }
      }
      webinars: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string
          presenter: string
          date: string
          duration_minutes: number
          cpd_points: number
          accreditation_body: string
          category: string
          image_url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description: string
          presenter: string
          date: string
          duration_minutes: number
          cpd_points: number
          accreditation_body: string
          category: string
          image_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string
          presenter?: string
          date?: string
          duration_minutes?: number
          cpd_points?: number
          accreditation_body?: string
          category?: string
          image_url?: string | null
        }
      }
      user_webinars: {
        Row: {
          id: string
          user_id: string
          webinar_id: string
          completed_at: string | null
          certificate_url: string | null
          feedback: string | null
          status: 'registered' | 'in_progress' | 'completed'
        }
        Insert: {
          id?: string
          user_id: string
          webinar_id: string
          completed_at?: string | null
          certificate_url?: string | null
          feedback?: string | null
          status?: 'registered' | 'in_progress' | 'completed'
        }
        Update: {
          id?: string
          user_id?: string
          webinar_id?: string
          completed_at?: string | null
          certificate_url?: string | null
          feedback?: string | null
          status?: 'registered' | 'in_progress' | 'completed'
        }
      }
      accreditation_bodies: {
        Row: {
          id: string
          name: string
          website_url: string
          logo_url: string | null
          submission_url: string
          description: string
        }
        Insert: {
          id?: string
          name: string
          website_url: string
          logo_url?: string | null
          submission_url: string
          description: string
        }
        Update: {
          id?: string
          name?: string
          website_url?: string
          logo_url?: string | null
          submission_url?: string
          description?: string
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
  }
}
