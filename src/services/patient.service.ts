import { PatientRepository } from "../repositories/patient.repository";
import { Patient, PatientCreateBody, PatientUpdateBody } from "../types";
import { NotFoundError } from "../utils/errors";

export class PatientService {
  constructor(private patientRepository: PatientRepository) {}

  async getAllPatients(): Promise<Patient[]> {
    return this.patientRepository.findAll();
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
