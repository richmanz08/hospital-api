import { PatientRepository } from "../repositories/patient.repository";
import {
  Patient,
  PatientCreateBody,
  PatientQuerystring,
  PatientUpdateBody,
} from "../types";
import { PaginatedResponse } from "../types/common";
import { NotFoundError } from "../utils/errors";

export class PatientService {
  constructor(private patientRepository: PatientRepository) {}

  async getAllPatients(
    query: PatientQuerystring
  ): Promise<PaginatedResponse<Patient>> {
    const { limit = 10, page = 1, search, gender } = query;

    const validPage = Math.max(1, Number(page));
    const validLimit = Math.min(Math.max(1, Number(limit)), 100); // Max 100 per page

    const filter = { search, gender };

    const { data, total } = await this.patientRepository.findAll(
      filter,
      validPage,
      validLimit
    );

    return {
      data,
      pagination: {
        page: validPage,
        limit: validLimit,
        total,
        totalPages: Math.ceil(total / validLimit),
      },
    };
  }

  async getPatientById(id: string): Promise<Patient> {
    const patient = await this.patientRepository.findById(id);
    if (!patient) {
      throw new NotFoundError("Patient not found");
    }
    return patient;
  }

  async createPatient(data: PatientCreateBody): Promise<Patient> {
    return this.patientRepository.create(data);
  }

  async updatePatient(id: string, data: PatientUpdateBody): Promise<Patient> {
    const patient = await this.patientRepository.update(id, data);
    if (!patient) {
      throw new NotFoundError("Patient not found");
    }
    return patient;
  }

  async softDeletePatient(id: string): Promise<void> {
    const patient = await this.patientRepository.softDelete(id);
    if (!patient) {
      throw new NotFoundError("Patient not found");
    }
  }

  async hardDeletePatient(id: string): Promise<void> {
    const patient = await this.patientRepository.hardDelete(id);
    if (!patient) {
      throw new NotFoundError("Patient not found");
    }
  }
}
