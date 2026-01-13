import { PatientRepository } from "../repositories/patient.repository";
import { Patient, PatientBody } from "../types";
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

  async createPatient(data: PatientBody): Promise<Patient> {
    return this.patientRepository.create(data);
  }

  async updatePatient(id: string, data: PatientBody): Promise<Patient> {
    const patient = await this.patientRepository.update(id, data);
    if (!patient) {
      throw new NotFoundError("Patient not found");
    }
    return patient;
  }

  async deletePatient(id: string): Promise<void> {
    const patient = await this.patientRepository.delete(id);
    if (!patient) {
      throw new NotFoundError("Patient not found");
    }
  }
}
