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

export interface CPDActivity {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  points: number;
  date_completed: string;
  evidence_url?: string;
  created_at: string;
}
