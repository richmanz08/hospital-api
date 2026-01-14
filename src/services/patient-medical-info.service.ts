import { PatientMedicalInfoRepository } from "../repositories/patient-medical-info.repository";
import {
  PatientMedicalInfo,
  PatientMedicalInfoCreateBody,
  PatientMedicalInfoUpdateBody,
  PatientMedicalInfoQuerystring,
} from "../types/patient-medical-info";
import { PaginatedResponse } from "../types/common";
import { NotFoundError, ConflictError } from "../utils/errors";

export class PatientMedicalInfoService {
  constructor(
    private patientMedicalInfoRepository: PatientMedicalInfoRepository
  ) {}

  async getAllPatientMedicalInfos(
    query: PatientMedicalInfoQuerystring
  ): Promise<PaginatedResponse<PatientMedicalInfo>> {
    const { limit = 10, page = 1, ...filter } = query;

    const validPage = Math.max(1, Number(page));
    const validLimit = Math.min(Math.max(1, Number(limit)), 100);

    const { data, total } = await this.patientMedicalInfoRepository.findAll(
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

  async getPatientMedicalInfoById(id: string): Promise<PatientMedicalInfo> {
    const info = await this.patientMedicalInfoRepository.findById(id);
    if (!info) {
      throw new NotFoundError("Patient medical info not found");
    }
    return info;
  }

  async getPatientMedicalInfoByPatientId(
    patient_id: string
  ): Promise<PatientMedicalInfo> {
    const info = await this.patientMedicalInfoRepository.findByPatientId(
      patient_id
    );
    if (!info) {
      throw new NotFoundError("Patient medical info not found");
    }
    return info;
  }

  async createPatientMedicalInfo(
    data: PatientMedicalInfoCreateBody
  ): Promise<PatientMedicalInfo> {
    // Check if patient already has medical info
    const existing = await this.patientMedicalInfoRepository.findByPatientId(
      data.patient_id
    );
    if (existing) {
      throw new ConflictError("Patient medical info already exists");
    }

    return await this.patientMedicalInfoRepository.create(data);
  }

  async updatePatientMedicalInfo(
    id: string,
    data: PatientMedicalInfoUpdateBody
  ): Promise<PatientMedicalInfo> {
    const updated = await this.patientMedicalInfoRepository.update(id, data);
    if (!updated) {
      throw new NotFoundError("Patient medical info not found");
    }
    return updated;
  }

  async deletePatientMedicalInfo(id: string): Promise<void> {
    const deleted = await this.patientMedicalInfoRepository.delete(id);
    if (!deleted) {
      throw new NotFoundError("Patient medical info not found");
    }
  }
}
