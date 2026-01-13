// Patient entity from database
export interface Patient {
  id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string | null;
  phone: string | null;
  email: string | null;
  created_at: Date;
  updated_at: Date;
}

// Patient create/update request body
export interface PatientBody {
  first_name: string;
  last_name: string;
  date_of_birth?: string;
  phone?: string;
  email?: string;
}

// Patient params
export interface PatientParams {
  id: string;
}
