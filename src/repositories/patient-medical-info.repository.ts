import { Pool } from "pg";
import {
  PatientMedicalInfo,
  PatientMedicalInfoCreateBody,
  PatientMedicalInfoUpdateBody,
  PatientMedicalInfoFilter,
} from "../types/patient-medical-info";

export class PatientMedicalInfoRepository {
  constructor(private db: Pool) {}

  async findAll(
    filter?: PatientMedicalInfoFilter,
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: PatientMedicalInfo[]; total: number }> {
    const conditions: string[] = ["deleted_at IS NULL"];
    const values: any[] = [];
    let paramCount = 1;

    // Filter by patient_id
    if (filter?.patient_id) {
      conditions.push(`patient_id = $${paramCount}`);
      values.push(filter.patient_id);
      paramCount++;
    }

    // Filter by blood_group
    if (filter?.blood_group) {
      conditions.push(`blood_group = $${paramCount}`);
      values.push(filter.blood_group);
      paramCount++;
    }

    const whereClause = conditions.join(" AND ");

    // Count query
    const countResult = await this.db.query<{ count: string }>(
      `SELECT COUNT(*) as count FROM patients_medical_info WHERE ${whereClause}`,
      values
    );
    const total = parseInt(countResult.rows[0].count);

    // Add pagination parameters
    const offset = (page - 1) * limit;
    values.push(limit, offset);

    // Data query
    const result = await this.db.query<PatientMedicalInfo>(
      `SELECT * FROM patients_medical_info 
       WHERE ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
      values
    );

    return {
      data: result.rows,
      total,
    };
  }

  async findById(id: string): Promise<PatientMedicalInfo | null> {
    const result = await this.db.query<PatientMedicalInfo>(
      "SELECT * FROM patients_medical_info WHERE id = $1 AND deleted_at IS NULL",
      [id]
    );
    return result.rows[0] || null;
  }

  async findByPatientId(
    patient_id: string
  ): Promise<PatientMedicalInfo | null> {
    const result = await this.db.query<PatientMedicalInfo>(
      "SELECT * FROM patients_medical_info WHERE patient_id = $1 AND deleted_at IS NULL",
      [patient_id]
    );
    return result.rows[0] || null;
  }

  async create(
    data: PatientMedicalInfoCreateBody
  ): Promise<PatientMedicalInfo> {
    const result = await this.db.query<PatientMedicalInfo>(
      `INSERT INTO patients_medical_info (patient_id, blood_group, height, weight, drug_allergy, food_allergy, chronic_disease)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        data.patient_id,
        data.blood_group || null,
        data.height || null,
        data.weight || null,
        data.drug_allergy || null,
        data.food_allergy || null,
        data.chronic_disease || null,
      ]
    );
    return result.rows[0];
  }

  async update(
    id: string,
    data: PatientMedicalInfoUpdateBody
  ): Promise<PatientMedicalInfo | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.blood_group !== undefined) {
      fields.push(`blood_group = $${paramCount}`);
      values.push(data.blood_group);
      paramCount++;
    }

    if (data.height !== undefined) {
      fields.push(`height = $${paramCount}`);
      values.push(data.height);
      paramCount++;
    }

    if (data.weight !== undefined) {
      fields.push(`weight = $${paramCount}`);
      values.push(data.weight);
      paramCount++;
    }

    if (data.drug_allergy !== undefined) {
      fields.push(`drug_allergy = $${paramCount}`);
      values.push(data.drug_allergy);
      paramCount++;
    }

    if (data.food_allergy !== undefined) {
      fields.push(`food_allergy = $${paramCount}`);
      values.push(data.food_allergy);
      paramCount++;
    }

    if (data.chronic_disease !== undefined) {
      fields.push(`chronic_disease = $${paramCount}`);
      values.push(data.chronic_disease);
      paramCount++;
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await this.db.query<PatientMedicalInfo>(
      `UPDATE patients_medical_info 
       SET ${fields.join(", ")}
       WHERE id = $${paramCount} AND deleted_at IS NULL
       RETURNING *`,
      values
    );

    return result.rows[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db.query(
      `UPDATE patients_medical_info 
       SET deleted_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND deleted_at IS NULL`,
      [id]
    );
    return result.rowCount !== null && result.rowCount > 0;
  }
}
