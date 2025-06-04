export interface User {
  id: string;
  email: string;
  full_name: string;
  profession: string;
  license_number: string;
  total_cpd_points: number;
  required_annual_points: number;
  created_at: string;
}

export interface CPDActivity {
  id: string;
  user_id: string;
  title: string;
  description: string;
  activity_type: string;
  provider: string;
  points: number;
  date_completed: string;
  certificate_url?: string;
  created_at: string;
}

export interface Webinar {
  id: string;
  title: string;
  description: string;
  provider: string;
  points: number;
  date: string;
  duration_minutes: number;
  registration_url: string;
  image_url?: string;
  is_accredited: boolean;
  accreditation_body?: string;
}

export interface AccreditationBody {
  id: string;
  name: string;
  description: string;
  website_url: string;
  logo_url?: string;
  country: string;
}

export interface Certificate {
  id: string;
  user_id: string;
  activity_id: string;
  title: string;
  issue_date: string;
  expiry_date?: string;
  certificate_number: string;
  file_url: string;
  created_at: string;
}
