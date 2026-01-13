// Staff entity from database
export interface Staff {
  id: string;
  gender: string;
  full_name_eng: string;
  full_name_th: string;
  nickname: string | null;
  national_id: string;
  phone: string;
  role: string;
  age: number | null;
  profile_image_url: string | null;
  hire_date: Date;
  termination_date: Date | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

// Staff response without deleted_at
export type StaffResponse = Omit<Staff, "deleted_at">;

// Staff create/update request body
export interface StaffBody {
  full_name_eng: string;
  full_name_th: string;
  nickname?: string;
  national_id: string;
  phone: string;
  gender: string;
  role: string;
  age?: number;
  profile_image_url?: string;
  hire_date: string;
  termination_date?: string;
}

// Staff params
export interface StaffParams {
  id: string;
}

// Staff query params for filtering and pagination
export interface StaffQuery {
  page?: string;
  limit?: string;
  search?: string; // search by full_name_eng or full_name_th
  gender?: string; // filter by gender
  role?: string; // filter by role
  sortBy?: string; // sort field
  sortOrder?: "asc" | "desc";
}

// Staff filter options for repository
export interface StaffFilter {
  search?: string;
  gender?: string;
  role?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
