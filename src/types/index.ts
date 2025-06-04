export interface User {
  id: string;
  created_at: string;
  email: string;
  full_name: string;
  profession?: string;
  license_number?: string;
  avatar_url?: string;
  total_cpd_points: number;
  required_annual_points: number;
}

export interface Webinar {
  id: string;
  created_at: string;
  title: string;
  description: string;
  presenter: string;
  date: string;
  duration_minutes: number;
  cpd_points: number;
  accreditation_body: string;
  category: string;
  image_url?: string;
}

export interface UserWebinar {
  id: string;
  user_id: string;
  webinar_id: string;
  completed_at?: string;
  certificate_url?: string;
  feedback?: string;
  status: 'registered' | 'in_progress' | 'completed';
  webinar?: Webinar;
}

export interface AccreditationBody {
  id: string;
  name: string;
  website_url: string;
  logo_url?: string;
  submission_url: string;
  description: string;
}
