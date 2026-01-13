import { StaffRepository } from "../repositories/staff.repository";
import { Staff, StaffBody, StaffResponse, StaffFilter } from "../types";
import { PaginatedResponse } from "../types/common";
import {
  ValidationError,
  NotFoundError,
  DuplicateError,
} from "../utils/errors";

export class StaffService {
  constructor(private staffRepository: StaffRepository) {}

  async getAllStaff(
    filter?: StaffFilter,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<StaffResponse>> {
    // Validate pagination
    const validPage = Math.max(1, page);
    const validLimit = Math.min(Math.max(1, limit), 100); // Max 100 per page

    const { data, total } = await this.staffRepository.findAll(
      filter,
      validPage,
      validLimit
    );

    return {
      data: data.map((staff) => this.toResponse(staff)),
      pagination: {
        page: validPage,
        limit: validLimit,
        total,
        totalPages: Math.ceil(total / validLimit),
      },
    };
  }

  async getStaffById(id: string): Promise<StaffResponse> {
    const staff = await this.staffRepository.findById(id);
    if (!staff) {
      throw new NotFoundError("Staff not found");
    }
    return this.toResponse(staff);
  }

  async createStaff(data: StaffBody): Promise<StaffResponse> {
    // Validate national_id
    this.validateNationalId(data.national_id);

    // Validate gender
    this.validateGender(data.gender);

    // Check duplicate national_id
    const existingByNationalId = await this.staffRepository.findByNationalId(
      data.national_id
    );
    if (existingByNationalId) {
      throw new DuplicateError("National ID already exists");
    }

    // Check duplicate phone
    const existingByPhone = await this.staffRepository.findByPhone(data.phone);
    if (existingByPhone) {
      throw new DuplicateError("Phone number already exists");
    }

    const staff = await this.staffRepository.create(data);
    return this.toResponse(staff);
  }

  async updateStaff(id: string, data: StaffBody): Promise<StaffResponse> {
    // Validate national_id
    this.validateNationalId(data.national_id);

    // Validate gender
    this.validateGender(data.gender);

    // Check if staff exists
    const existingStaff = await this.staffRepository.findById(id);
    if (!existingStaff) {
      throw new NotFoundError("Staff not found");
    }

    // Check duplicate national_id (exclude current staff)
    const existingByNationalId = await this.staffRepository.findByNationalId(
      data.national_id
    );
    if (existingByNationalId && existingByNationalId.id !== id) {
      throw new DuplicateError("National ID already exists");
    }

    // Check duplicate phone (exclude current staff)
    const existingByPhone = await this.staffRepository.findByPhone(data.phone);
    if (existingByPhone && existingByPhone.id !== id) {
      throw new DuplicateError("Phone number already exists");
    }

    const staff = await this.staffRepository.update(id, data);
    if (!staff) {
      throw new NotFoundError("Staff not found");
    }
    return this.toResponse(staff);
  }

  async deleteStaff(id: string): Promise<void> {
    const staff = await this.staffRepository.softDelete(id);
    if (!staff) {
      throw new NotFoundError("Staff not found");
    }
  }

  // Private validation methods
  private validateNationalId(nationalId: string): void {
    if (!/^\d{13}$/.test(nationalId)) {
      throw new ValidationError("National ID must be exactly 13 digits");
    }
  }

  private validateGender(gender: string): void {
    const validGenders = ["male", "female", "other"];
    if (!validGenders.includes(gender)) {
      throw new ValidationError("Gender must be male, female, or other");
    }
  }

  // Transform Staff to StaffResponse (remove deleted_at)
  private toResponse(staff: Staff): StaffResponse {
    const { deleted_at, ...response } = staff;
    return response;
  }
}
