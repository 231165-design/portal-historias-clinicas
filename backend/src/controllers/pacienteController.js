// ============================================================
// CONTROLADOR: Pacientes
// ============================================================

import pacienteService from '../services/pacienteService.js';
import { HTTP_STATUS, MESSAGES } from '../config/constants.js';
import { asyncHandler } from '../middlewares/errorMiddleware.js';
import logger from '../config/logger.js';

// ============================================================
// GET /api/pacientes
// Lista pacientes con filtros y paginación
// ============================================================
export const listPacientes = asyncHandler(async (req, res) => {
  const {
    page,
    limit,
    search,
    posta_id,
    activo,
    sexo,
    tipo_seguro,
    rango_edad,
  } = req.query;

  const result = await pacienteService.listPacientes({
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
    search,
    posta_id: posta_id ? parseInt(posta_id) : undefined,
    activo: activo !== undefined ? activo === 'true' : true,
    sexo,
    tipo_seguro,
    rango_edad,
  });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    ...result,
  });
});

// ============================================================
// GET /api/pacientes/:id
// Obtiene un paciente por ID
// ============================================================
export const getPaciente = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const paciente = await pacienteService.getPacienteById(parseInt(id));

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: paciente,
  });
});

// ============================================================
// GET /api/pacientes/buscar/:termino
// Busca un paciente por DNI o Historia Clínica
// ============================================================
export const buscarPaciente = asyncHandler(async (req, res) => {
  const { termino } = req.params;

  const paciente = await pacienteService.buscarPaciente(termino);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: paciente,
  });
});

// ============================================================
// POST /api/pacientes
// Crea un nuevo paciente
// ============================================================
export const createPaciente = asyncHandler(async (req, res) => {
  const data = req.body;

  const paciente = await pacienteService.createPaciente(data, req.userId);

  logger.info(`Paciente creado: ${paciente.id} - ${paciente.nombres} ${paciente.apellidos}`);

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: MESSAGES.CREATED_SUCCESS,
    data: paciente,
  });
});

// ============================================================
// PUT /api/pacientes/:id
// Actualiza un paciente existente
// ============================================================
export const updatePaciente = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const paciente = await pacienteService.updatePaciente(parseInt(id), data);

  logger.info(`Paciente actualizado: ${paciente.id}`);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: MESSAGES.UPDATED_SUCCESS,
    data: paciente,
  });
});

// ============================================================
// DELETE /api/pacientes/:id
// Elimina (soft delete) un paciente
// ============================================================
export const deletePaciente = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await pacienteService.deletePaciente(parseInt(id));

  logger.info(`Paciente eliminado: ${id}`);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: MESSAGES.DELETED_SUCCESS,
  });
});

// ============================================================
// GET /api/pacientes/stats
// Obtiene estadísticas generales de pacientes
// ============================================================
export const getEstadisticas = asyncHandler(async (req, res) => {
  const stats = await pacienteService.getEstadisticasPacientes();

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: stats,
  });
});

// ============================================================
// GET /api/pacientes/:id/historia
// Obtiene la historia clínica completa de un paciente
// ============================================================
export const getHistoriaClinica = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const historia = await pacienteService.getHistoriaClinica(parseInt(id));

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: historia,
  });
});

// ============================================================
// GET /api/pacientes/:id/antecedentes
// Obtiene los antecedentes de un paciente
// ============================================================
export const getAntecedentes = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const antecedentes = await pacienteService.getAntecedentes(parseInt(id));

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: antecedentes,
  });
});

// ============================================================
// GET /api/pacientes/:id/consultas
// Obtiene las consultas de un paciente
// ============================================================
export const getConsultas = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const consultas = await pacienteService.getConsultas(parseInt(id));

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: consultas,
  });
});

// ============================================================
// GET /api/pacientes/:id/vacunas
// Obtiene las vacunas de un paciente
// ============================================================
export const getVacunas = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const vacunas = await pacienteService.getVacunas(parseInt(id));

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: vacunas,
  });
});

export default {
  listPacientes,
  getPaciente,
  buscarPaciente,
  createPaciente,
  updatePaciente,
  deletePaciente,
  getEstadisticas,
  getHistoriaClinica,
  getAntecedentes,
  getConsultas,
  getVacunas,
};