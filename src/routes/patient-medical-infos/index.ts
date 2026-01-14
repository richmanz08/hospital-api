import { FastifyPluginAsync } from "fastify";
import {
  PatientMedicalInfo,
  PatientMedicalInfoCreateBody,
  PatientMedicalInfoUpdateBody,
  PatientMedicalInfoQuerystring,
} from "../../types/patient-medical-info";
import { PaginatedResponse } from "../../types/common";

const patientMedicalInfoRoutes: FastifyPluginAsync = async (fastify) => {
  const { patientMedicalInfoService } = fastify;

  // GET /patient-medical-infos - Get all patient medical infos
  fastify.get<{
    Querystring: PatientMedicalInfoQuerystring;
    Reply: PaginatedResponse<PatientMedicalInfo>;
  }>("/", async (request, reply) => {
    const infos = await patientMedicalInfoService.getAllPatientMedicalInfos(
      request.query
    );
    return reply.send(infos);
  });

  // GET /patient-medical-infos/:id - Get patient medical info by ID
  fastify.get<{
    Params: { id: string };
    Reply: PatientMedicalInfo;
  }>("/:id", async (request, reply) => {
    const info = await patientMedicalInfoService.getPatientMedicalInfoById(
      request.params.id
    );
    return reply.send(info);
  });

  // GET /patient-medical-infos/patient/:patientId - Get by patient ID
  fastify.get<{
    Params: { patientId: string };
    Reply: PatientMedicalInfo;
  }>("/patient/:patientId", async (request, reply) => {
    const info =
      await patientMedicalInfoService.getPatientMedicalInfoByPatientId(
        request.params.patientId
      );
    return reply.send(info);
  });

  // POST /patient-medical-infos - Create new patient medical info
  fastify.post<{
    Body: PatientMedicalInfoCreateBody;
    Reply: PatientMedicalInfo;
  }>("/", async (request, reply) => {
    const info = await patientMedicalInfoService.createPatientMedicalInfo(
      request.body
    );
    return reply.code(201).send(info);
  });

  // PUT /patient-medical-infos/:id - Update patient medical info
  fastify.put<{
    Params: { id: string };
    Body: PatientMedicalInfoUpdateBody;
    Reply: PatientMedicalInfo;
  }>("/:id", async (request, reply) => {
    const info = await patientMedicalInfoService.updatePatientMedicalInfo(
      request.params.id,
      request.body
    );
    return reply.send(info);
  });

  // DELETE /patient-medical-infos/:id - Soft delete patient medical info
  fastify.delete<{
    Params: { id: string };
  }>("/:id", async (request, reply) => {
    await patientMedicalInfoService.deletePatientMedicalInfo(request.params.id);
    return reply.code(204).send();
  });
};

export default patientMedicalInfoRoutes;
