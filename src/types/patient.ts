import { PaginationQuery } from "./common";

// Patient entity from database
export interface Patient {
  id: string;
  gender: string;
  national_id: string;
  first_name: string;
  last_name: string;
  nickname: string | null;
  age: number | null;
  date_of_birth: string | null;
  phone: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

// Patient create request body
export interface PatientCreateBody {
  gender: string;
  national_id: string;
  first_name: string;
  last_name: string;
  nickname?: string;
  age?: number;
  date_of_birth?: string;
  phone: string;
}

// Patient update request body
export interface PatientUpdateBody {
  gender?: string;
  first_name?: string;
  last_name?: string;
  nickname?: string;
  age?: number;
  date_of_birth?: string;
  phone?: string;
}

// Patient params
export interface PatientParams {
  id: string;
}

export interface PatientQuerystring extends PatientFilter, PaginationQuery {
  page?: string;
  limit?: string;
}

export interface PatientFilter {
  search?: string; // search by first_name, last_name, nickname, phone, national_id
  gender?: string;
}
