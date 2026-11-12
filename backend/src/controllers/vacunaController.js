// ============================================================
// CONTROLADOR: Vacunas
// ============================================================

import db from '../models/index.js';
import { HTTP_STATUS, MESSAGES } from '../config/constants.js';
import { asyncHandler } from '../middlewares/errorMiddleware.js';
import logger from '../config/logger.js';

const { Vacuna, Paciente, Usuario } = db;
const { Op, fn, col } = db.Sequelize;

// ============================================================
// GET /api/vacunas
// Lista vacunas con filtros y paginación
// ============================================================
export const listVacunas = asyncHandler(async (req, res) => {
  const {
    page,
    limit,
    search,
    tipo_vacuna,
    paciente_id,
    fecha_desde,
    fecha_hasta,
  } = req.query;

  const where = {};

  // Búsqueda por paciente o tipo de vacuna
  if (search) {
    where[Op.or] = [
      { tipo_vacuna: { [Op.like]: `%${search}%` } },
      { lote: { [Op.like]: `%${search}%` } },
      { '$paciente.nombres$': { [Op.like]: `%${search}%` } },
      { '$paciente.apellidos$': { [Op.like]: `%${search}%` } },
      { '$paciente.historia_clinica$': { [Op.like]: `%${search}%` } },
    ];
  }

  // Filtros
  if (tipo_vacuna) where.tipo_vacuna = tipo_vacuna;
  if (paciente_id) where.paciente_id = paciente_id;

  // Filtro por rango de fechas
  if (fecha_desde || fecha_hasta) {
    where.fecha_aplicacion = {};
    if (fecha_desde) where.fecha_aplicacion[Op.gte] = fecha_desde;
    if (fecha_hasta) where.fecha_aplicacion[Op.lte] = fecha_hasta;
  }

  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  const offset = (pageNum - 1) * limitNum;

  const { rows, count } = await Vacuna.findAndCountAll({
    where,
    include: [
      {
        model: Paciente,
        as: 'paciente',
        attributes: ['id', 'nombres', 'apellidos', 'historia_clinica', 'dni', 'sexo', 'fecha_nacimiento', 'telefono'],
      },
      {
        model: Usuario,
        as: 'aplicador',
        attributes: ['id', 'nombres', 'apellidos'],
      },
    ],
    order: [['fecha_aplicacion', 'DESC']],
    limit: limitNum,
    offset,
    distinct: true,
  });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: rows,
    pagination: {
      total: count,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(count / limitNum),
    },
  });
});

// ============================================================
// GET /api/vacunas/:id
// Obtiene una vacuna por ID
// ============================================================
export const getVacuna = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const vacuna = await Vacuna.findByPk(id, {
    include: [
      {
        model: Paciente,
        as: 'paciente',
        attributes: ['id', 'nombres', 'apellidos', 'historia_clinica', 'dni', 'sexo', 'fecha_nacimiento'],
      },
      {
        model: Usuario,
        as: 'aplicador',
        attributes: ['id', 'nombres', 'apellidos'],
      },
    ],
  });

  if (!vacuna) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Vacuna no encontrada',
    });
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: vacuna,
  });
});

// ============================================================
// POST /api/vacunas
// Crea una nueva vacuna
// ============================================================
export const createVacuna = asyncHandler(async (req, res) => {
  const data = req.body;

  // Verificar que el paciente existe
  const paciente = await Paciente.findByPk(data.paciente_id);
  if (!paciente) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Paciente no encontrado',
    });
  }

  // Crear vacuna
  const vacuna = await Vacuna.create({
    ...data,
    aplicado_por: req.userId,
    fecha_aplicacion: data.fecha_aplicacion || new Date().toISOString().split('T')[0],
  });

  logger.info(`Vacuna registrada: ${vacuna.tipo_vacuna} - Paciente: ${paciente.nombres} ${paciente.apellidos}`);

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: 'Vacuna registrada correctamente',
    data: vacuna,
  });
});

// ============================================================
// PUT /api/vacunas/:id
// Actualiza una vacuna
// ============================================================
export const updateVacuna = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const vacuna = await Vacuna.findByPk(id);

  if (!vacuna) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Vacuna no encontrada',
    });
  }

  await vacuna.update(data);

  logger.info(`Vacuna actualizada: ${id}`);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Vacuna actualizada correctamente',
    data: vacuna,
  });
});

// ============================================================
// DELETE /api/vacunas/:id
// Elimina una vacuna
// ============================================================
export const deleteVacuna = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const vacuna = await Vacuna.findByPk(id);

  if (!vacuna) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Vacuna no encontrada',
    });
  }

  await vacuna.destroy();

  logger.info(`Vacuna eliminada: ${id}`);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Vacuna eliminada correctamente',
  });
});

// ============================================================
// GET /api/vacunas/stats
// Estadísticas de vacunas
// ============================================================
export const getEstadisticas = asyncHandler(async (req, res) => {
  const hoy = new Date();
  const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

  const [
    total,
    esteMes,
    tiposVacuna,
  ] = await Promise.all([
    Vacuna.count(),
    Vacuna.count({
      where: { fecha_aplicacion: { [Op.gte]: inicioMes } },
    }),
    Vacuna.findAll({
      attributes: [
        'tipo_vacuna',
        [fn('COUNT', col('id')), 'cantidad'],
      ],
      group: ['tipo_vacuna'],
      order: [[fn('COUNT', col('id')), 'DESC']],
      limit: 5,
      raw: true,
    }),
  ]);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: {
      total,
      esteMes,
      topVacunas: tiposVacuna.map((t) => ({
        nombre: t.tipo_vacuna,
        cantidad: Number(t.cantidad),
      })),
    },
  });
});

// ============================================================
// GET /api/vacunas/paciente/:pacienteId
// Vacunas de un paciente (carnet)
// ============================================================
export const getVacunasByPaciente = asyncHandler(async (req, res) => {
  const { pacienteId } = req.params;

  const paciente = await Paciente.findByPk(pacienteId, {
    attributes: ['id', 'nombres', 'apellidos', 'historia_clinica', 'dni', 'fecha_nacimiento', 'sexo'],
  });

  if (!paciente) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Paciente no encontrado',
    });
  }

  const vacunas = await Vacuna.findAll({
    where: { paciente_id: pacienteId },
    include: [
      {
        model: Usuario,
        as: 'aplicador',
        attributes: ['id', 'nombres', 'apellidos'],
      },
    ],
    order: [['fecha_aplicacion', 'DESC']],
  });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: {
      paciente,
      vacunas,
    },
  });
});

export default {
  listVacunas,
  getVacuna,
  createVacuna,
  updateVacuna,
  deleteVacuna,
  getEstadisticas,
  getVacunasByPaciente,
};