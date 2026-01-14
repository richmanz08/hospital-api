import { PaginationQuery } from "./common";

export interface PatientMedicalInfo {
  id: string;
  patient_id: string;
  blood_group?: string;
  height?: number;
  weight?: number;
  drug_allergy?: string;
  food_allergy?: string;
  chronic_disease?: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
}

export interface PatientMedicalInfoCreateBody {
  patient_id: string;
  blood_group?: string;
  height?: number;
  weight?: number;
  drug_allergy?: string;
  food_allergy?: string;
  chronic_disease?: string;
}

export interface PatientMedicalInfoUpdateBody {
  blood_group?: string;
  height?: number;
  weight?: number;
  drug_allergy?: string;
  food_allergy?: string;
  chronic_disease?: string;
}

export interface PatientMedicalInfoFilter {
  patient_id?: string;
  blood_group?: string;
}

export interface PatientMedicalInfoQuerystring
  extends PatientMedicalInfoFilter,
    PaginationQuery {}
