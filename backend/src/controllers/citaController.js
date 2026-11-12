// ============================================================
// CONTROLADOR: Citas
// ============================================================

import db from '../models/index.js';
import { HTTP_STATUS, MESSAGES } from '../config/constants.js';
import { asyncHandler } from '../middlewares/errorMiddleware.js';
import logger from '../config/logger.js';

const { Cita, Paciente, Usuario, Posta } = db;
const { Op, fn, col, literal } = db.Sequelize;

// ============================================================
// GET /api/citas
// Lista citas con filtros y paginación
// ============================================================
export const listCitas = asyncHandler(async (req, res) => {
  const {
    page,
    limit,
    search,
    estado,
    medico_id,
    paciente_id,
    tipo,
    fecha_desde,
    fecha_hasta,
  } = req.query;

  const where = {};

  // Búsqueda por paciente o motivo
  if (search) {
    where[Op.or] = [
      { motivo: { [Op.like]: `%${search}%` } },
      { '$paciente.nombres$': { [Op.like]: `%${search}%` } },
      { '$paciente.apellidos$': { [Op.like]: `%${search}%` } },
      { '$paciente.historia_clinica$': { [Op.like]: `%${search}%` } },
    ];
  }

  // Filtros
  if (estado) where.estado = estado;
  if (medico_id) where.medico_id = medico_id;
  if (paciente_id) where.paciente_id = paciente_id;
  if (tipo) where.tipo = tipo;

  // Filtro por rango de fechas
  if (fecha_desde || fecha_hasta) {
    where.fecha_hora = {};
    if (fecha_desde) where.fecha_hora[Op.gte] = new Date(fecha_desde);
    if (fecha_hasta) {
      const fin = new Date(fecha_hasta);
      fin.setHours(23, 59, 59);
      where.fecha_hora[Op.lte] = fin;
    }
  }

  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  const offset = (pageNum - 1) * limitNum;

  const { rows, count } = await Cita.findAndCountAll({
    where,
    include: [
      {
        model: Paciente,
        as: 'paciente',
        attributes: ['id', 'nombres', 'apellidos', 'historia_clinica', 'dni', 'sexo', 'fecha_nacimiento', 'telefono'],
      },
      {
        model: Usuario,
        as: 'medico',
        attributes: ['id', 'nombres', 'apellidos', 'colegiatura'],
      },
    ],
    order: [['fecha_hora', 'ASC']],
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
// GET /api/citas/:id
// Obtiene una cita por ID
// ============================================================
export const getCita = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const cita = await Cita.findByPk(id, {
    include: [
      {
        model: Paciente,
        as: 'paciente',
        attributes: ['id', 'nombres', 'apellidos', 'historia_clinica', 'dni', 'sexo', 'fecha_nacimiento', 'telefono', 'direccion'],
      },
      {
        model: Usuario,
        as: 'medico',
        attributes: ['id', 'nombres', 'apellidos', 'colegiatura'],
      },
      {
        model: Posta,
        as: 'posta',
        attributes: ['id', 'nombre', 'codigo'],
      },
    ],
  });

  if (!cita) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Cita no encontrada',
    });
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: cita,
  });
});

// ============================================================
// POST /api/citas
// Crea una nueva cita
// ============================================================
export const createCita = asyncHandler(async (req, res) => {
  const data = req.body;

  // Verificar que el paciente existe
  const paciente = await Paciente.findByPk(data.paciente_id);
  if (!paciente) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Paciente no encontrado',
    });
  }

  // Verificar que el médico existe
  const medico = await Usuario.findByPk(data.medico_id);
  if (!medico) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Médico no encontrado',
    });
  }

  // Verificar que la fecha no sea en el pasado (solo si es nueva)
  if (new Date(data.fecha_hora) < new Date()) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'La fecha de la cita no puede ser en el pasado',
    });
  }

  // Crear cita
  const cita = await Cita.create({
    ...data,
    posta_id: data.posta_id || 1,
    created_by: req.userId,
    estado: data.estado || 'Programada',
  });

  logger.info(`Cita creada: ${cita.id} - Paciente: ${paciente.nombres} ${paciente.apellidos}`);

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: 'Cita registrada correctamente',
    data: cita,
  });
});

// ============================================================
// PUT /api/citas/:id
// Actualiza una cita
// ============================================================
export const updateCita = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const cita = await Cita.findByPk(id);

  if (!cita) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Cita no encontrada',
    });
  }

  await cita.update(data);

  logger.info(`Cita actualizada: ${id}`);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Cita actualizada correctamente',
    data: cita,
  });
});

// ============================================================
// DELETE /api/citas/:id
// Elimina una cita (soft delete → cancelar)
// ============================================================
export const deleteCita = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const cita = await Cita.findByPk(id);

  if (!cita) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Cita no encontrada',
    });
  }

  await cita.update({ estado: 'Cancelada' });

  logger.info(`Cita cancelada: ${id}`);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Cita cancelada correctamente',
  });
});

// ============================================================
// GET /api/citas/stats
// Estadísticas de citas
// ============================================================
export const getEstadisticas = asyncHandler(async (req, res) => {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  const finSemana = new Date(hoy.getTime() + 7 * 24 * 60 * 60 * 1000);

  const [
    total,
    programadas,
    confirmadas,
    atendidas,
    canceladas,
    noAsistio,
    hoyCount,
    semana,
  ] = await Promise.all([
    Cita.count(),
    Cita.count({ where: { estado: 'Programada' } }),
    Cita.count({ where: { estado: 'Confirmada' } }),
    Cita.count({ where: { estado: 'Atendida' } }),
    Cita.count({ where: { estado: 'Cancelada' } }),
    Cita.count({ where: { estado: 'No asistió' } }),
    Cita.count({
      where: {
        fecha_hora: { [Op.gte]: hoy, [Op.lt]: new Date(hoy.getTime() + 24 * 60 * 60 * 1000) },
        estado: { [Op.in]: ['Programada', 'Confirmada'] },
      },
    }),
    Cita.count({
      where: {
        fecha_hora: { [Op.gte]: hoy, [Op.lte]: finSemana },
        estado: { [Op.in]: ['Programada', 'Confirmada'] },
      },
    }),
  ]);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: {
      total,
      programadas,
      confirmadas,
      atendidas,
      canceladas,
      noAsistio,
      hoy: hoyCount,
      semana,
    },
  });
});

// ============================================================
// GET /api/citas/paciente/:pacienteId
// Citas de un paciente
// ============================================================
export const getCitasByPaciente = asyncHandler(async (req, res) => {
  const { pacienteId } = req.params;

  const citas = await Cita.findAll({
    where: { paciente_id: pacienteId },
    include: [
      {
        model: Usuario,
        as: 'medico',
        attributes: ['id', 'nombres', 'apellidos', 'colegiatura'],
      },
    ],
    order: [['fecha_hora', 'DESC']],
  });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: citas,
  });
});

// ============================================================
// GET /api/citas/medico/:medicoId
// Citas de un médico
// ============================================================
export const getCitasByMedico = asyncHandler(async (req, res) => {
  const { medicoId } = req.params;

  const citas = await Cita.findAll({
    where: { medico_id: medicoId },
    include: [
      {
        model: Paciente,
        as: 'paciente',
        attributes: ['id', 'nombres', 'apellidos', 'historia_clinica'],
      },
    ],
    order: [['fecha_hora', 'ASC']],
    limit: 50,
  });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: citas,
  });
});

// ============================================================
// PATCH /api/citas/:id/estado
// Cambia el estado de una cita
// ============================================================
export const cambiarEstado = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  const estadosValidos = ['Programada', 'Confirmada', 'Atendida', 'Cancelada', 'No asistió'];

  if (!estadosValidos.includes(estado)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: `Estado inválido. Debe ser: ${estadosValidos.join(', ')}`,
    });
  }

  const cita = await Cita.findByPk(id);

  if (!cita) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Cita no encontrada',
    });
  }

  await cita.update({ estado });

  logger.info(`Cita ${id} cambiada a estado: ${estado}`);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Estado actualizado correctamente',
    data: cita,
  });
});

export default {
  listCitas,
  getCita,
  createCita,
  updateCita,
  deleteCita,
  getEstadisticas,
  getCitasByPaciente,
  getCitasByMedico,
  cambiarEstado,
};