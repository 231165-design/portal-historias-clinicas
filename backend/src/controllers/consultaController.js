// ============================================================
// CONTROLADOR: Consultas
// ============================================================

import db from '../models/index.js';
import { HTTP_STATUS, MESSAGES } from '../config/constants.js';
import { asyncHandler } from '../middlewares/errorMiddleware.js';
import logger from '../config/logger.js';

const { Consulta, Paciente, Usuario, Posta } = db;
const { Op, fn, col, literal } = db.Sequelize;

// ============================================================
// GET /api/consultas
// Lista consultas con filtros y paginación
// ============================================================
export const listConsultas = asyncHandler(async (req, res) => {
  const {
    page,
    limit,
    search,
    estado,
    medico_id,
    paciente_id,
    tipo_atencion,
    fecha_desde,
    fecha_hasta,
  } = req.query;

  const where = {};

  // Búsqueda por paciente o diagnóstico
  if (search) {
    where[Op.or] = [
      { motivo_consulta: { [Op.like]: `%${search}%` } },
      { diagnostico_principal: { [Op.like]: `%${search}%` } },
      { '$paciente.nombres$': { [Op.like]: `%${search}%` } },
      { '$paciente.apellidos$': { [Op.like]: `%${search}%` } },
      { '$paciente.historia_clinica$': { [Op.like]: `%${search}%` } },
    ];
  }

  // Filtros
  if (estado) where.estado = estado;
  if (medico_id) where.medico_id = medico_id;
  if (paciente_id) where.paciente_id = paciente_id;
  if (tipo_atencion) where.tipo_atencion = tipo_atencion;

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

  const { rows, count } = await Consulta.findAndCountAll({
    where,
    include: [
      {
        model: Paciente,
        as: 'paciente',
        attributes: ['id', 'nombres', 'apellidos', 'historia_clinica', 'dni', 'sexo', 'fecha_nacimiento'],
      },
      {
        model: Usuario,
        as: 'medico',
        attributes: ['id', 'nombres', 'apellidos', 'colegiatura'],
      },
    ],
    order: [['fecha_hora', 'DESC']],
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
// GET /api/consultas/:id
// Obtiene una consulta por ID con todos sus detalles
// ============================================================
export const getConsulta = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const consulta = await Consulta.findByPk(id, {
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

  if (!consulta) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Consulta no encontrada',
    });
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: consulta,
  });
});

// ============================================================
// POST /api/consultas
// Crea una nueva consulta
// ============================================================
export const createConsulta = asyncHandler(async (req, res) => {
  const data = req.body;

  // Verificar que el paciente existe
  const paciente = await Paciente.findByPk(data.paciente_id);
  if (!paciente) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Paciente no encontrado',
    });
  }

  // Generar número de consulta
  const year = new Date().getFullYear();
  const ultimaConsulta = await Consulta.findOne({
    where: {
      numero_consulta: { [Op.ne]: null },
      created_at: { [Op.gte]: `${year}-01-01` },
    },
    order: [['numero_consulta', 'DESC']],
  });

  const numero_consulta = (ultimaConsulta?.numero_consulta || 0) + 1;

  // Crear consulta
  const consulta = await Consulta.create({
    ...data,
    medico_id: req.userId,
    posta_id: data.posta_id || 1,
    numero_consulta,
    estado: data.estado || 'Completada',
  });

  logger.info(`Consulta creada: ${consulta.id} - Paciente: ${paciente.nombres} ${paciente.apellidos}`);

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: 'Consulta registrada correctamente',
    data: consulta,
  });
});

// ============================================================
// PUT /api/consultas/:id
// Actualiza una consulta existente
// ============================================================
export const updateConsulta = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const consulta = await Consulta.findByPk(id);

  if (!consulta) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Consulta no encontrada',
    });
  }

  await consulta.update(data);

  logger.info(`Consulta actualizada: ${id}`);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Consulta actualizada correctamente',
    data: consulta,
  });
});

// ============================================================
// DELETE /api/consultas/:id
// Anula una consulta (soft delete)
// ============================================================
export const deleteConsulta = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const consulta = await Consulta.findByPk(id);

  if (!consulta) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Consulta no encontrada',
    });
  }

  await consulta.update({ estado: 'Anulada' });

  logger.info(`Consulta anulada: ${id}`);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Consulta anulada correctamente',
  });
});

// ============================================================
// GET /api/consultas/stats
// Estadísticas generales de consultas
// ============================================================
export const getEstadisticas = asyncHandler(async (req, res) => {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  const inicioMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
  const finMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth(), 0, 23, 59, 59);

  const [
    total,
    hoyCount,
    completadas,
    enCurso,
    anuladas,
    mesActual,
    mesAnterior,
    seguimiento,
  ] = await Promise.all([
    Consulta.count(),
    Consulta.count({ where: { fecha_hora: { [Op.gte]: hoy } } }),
    Consulta.count({ where: { estado: 'Completada' } }),
    Consulta.count({ where: { estado: 'En curso' } }),
    Consulta.count({ where: { estado: 'Anulada' } }),
    Consulta.count({ where: { fecha_hora: { [Op.gte]: inicioMes } } }),
    Consulta.count({
      where: { fecha_hora: { [Op.between]: [inicioMesAnterior, finMesAnterior] } },
    }),
    Consulta.count({ where: { tipo_atencion: 'Seguimiento' } }),
  ]);

  // Variación porcentual mes actual vs anterior
  const variacion = mesAnterior > 0
    ? Number((((mesActual - mesAnterior) / mesAnterior) * 100).toFixed(1))
    : mesActual > 0 ? 100 : 0;

  // Consultas por día (últimos 7 días)
  const hace7Dias = new Date(hoy.getTime() - 6 * 24 * 60 * 60 * 1000);
  const porDiaRaw = await Consulta.findAll({
    attributes: [
      [fn('DATE', col('fecha_hora')), 'dia'],
      [fn('COUNT', col('id')), 'cantidad'],
    ],
    where: { fecha_hora: { [Op.gte]: hace7Dias } },
    group: [literal('DATE(fecha_hora)')],
    order: [[literal('DATE(fecha_hora)'), 'ASC']],
    raw: true,
  }).catch(() => []);

  const diasNombres = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const porDia = [];
  for (let i = 6; i >= 0; i--) {
    const fecha = new Date(hoy.getTime() - i * 24 * 60 * 60 * 1000);
    const diaKey = fecha.toISOString().split('T')[0];
    const found = porDiaRaw.find((r) => r.dia === diaKey);
    porDia.push({
      dia: diasNombres[fecha.getDay()],
      cantidad: found ? Number(found.cantidad) : 0,
    });
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: {
      total,
      hoy: hoyCount,
      completadas,
      enCurso,
      anuladas,
      mesActual,
      mesAnterior,
      variacion,
      seguimiento,
      porDia,
    },
  });
});

// ============================================================
// GET /api/consultas/paciente/:pacienteId
// Obtiene el historial de consultas de un paciente
// ============================================================
export const getConsultasByPaciente = asyncHandler(async (req, res) => {
  const { pacienteId } = req.params;

  const consultas = await Consulta.findAll({
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
    data: consultas,
  });
});

// ============================================================
// GET /api/consultas/medico/:medicoId
// Obtiene las consultas de un médico
// ============================================================
export const getConsultasByMedico = asyncHandler(async (req, res) => {
  const { medicoId } = req.params;

  const consultas = await Consulta.findAll({
    where: { medico_id: medicoId },
    include: [
      {
        model: Paciente,
        as: 'paciente',
        attributes: ['id', 'nombres', 'apellidos', 'historia_clinica'],
      },
    ],
    order: [['fecha_hora', 'DESC']],
    limit: 50,
  });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: consultas,
  });
});

// ============================================================
// GET /api/consultas/:id/signos-vitales
// Obtiene los signos vitales de una consulta
// ============================================================
export const getSignosVitales = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const signos = await db.sequelize
    .query(
      `SELECT * FROM signos_vitales WHERE consulta_id = ?`,
      {
        replacements: [id],
        type: db.Sequelize.QueryTypes.SELECT,
      }
    )
    .catch(() => []);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: signos[0] || null,
  });
});

// ============================================================
// POST /api/consultas/:id/signos-vitales
// Registra los signos vitales de una consulta
// ============================================================
export const registrarSignosVitales = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    temperatura,
    presion_sistolica,
    presion_diastolica,
    frecuencia_cardiaca,
    frecuencia_respiratoria,
    saturacion_oxigeno,
    peso,
    talla,
    perimetro_abdominal,
    glucosa,
    observaciones,
  } = req.body;

  // Calcular IMC
  let imc = null;
  if (peso && talla) {
    const tallaM = talla / 100;
    imc = Number((peso / (tallaM * tallaM)).toFixed(2));
  }

  // Verificar si ya existe
  const existente = await db.sequelize
    .query(
      `SELECT id FROM signos_vitales WHERE consulta_id = ?`,
      {
        replacements: [id],
        type: db.Sequelize.QueryTypes.SELECT,
      }
    )
    .catch(() => []);

  if (existente.length > 0) {
    // Actualizar
    await db.sequelize.query(
      `UPDATE signos_vitales SET
        temperatura = ?,
        presion_sistolica = ?,
        presion_diastolica = ?,
        frecuencia_cardiaca = ?,
        frecuencia_respiratoria = ?,
        saturacion_oxigeno = ?,
        peso = ?,
        talla = ?,
        imc = ?,
        perimetro_abdominal = ?,
        glucosa = ?,
        observaciones = ?
      WHERE consulta_id = ?`,
      {
        replacements: [
          temperatura,
          presion_sistolica,
          presion_diastolica,
          frecuencia_cardiaca,
          frecuencia_respiratoria,
          saturacion_oxigeno,
          peso,
          talla,
          imc,
          perimetro_abdominal,
          glucosa,
          observaciones,
          id,
        ],
        type: db.Sequelize.QueryTypes.UPDATE,
      }
    );
  } else {
    // Crear
    await db.sequelize.query(
      `INSERT INTO signos_vitales (
        consulta_id, temperatura, presion_sistolica, presion_diastolica,
        frecuencia_cardiaca, frecuencia_respiratoria, saturacion_oxigeno,
        peso, talla, imc, perimetro_abdominal, glucosa, observaciones
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      {
        replacements: [
          id,
          temperatura,
          presion_sistolica,
          presion_diastolica,
          frecuencia_cardiaca,
          frecuencia_respiratoria,
          saturacion_oxigeno,
          peso,
          talla,
          imc,
          perimetro_abdominal,
          glucosa,
          observaciones,
        ],
        type: db.Sequelize.QueryTypes.INSERT,
      }
    );
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Signos vitales registrados correctamente',
    data: { imc },
  });
});

export default {
  listConsultas,
  getConsulta,
  createConsulta,
  updateConsulta,
  deleteConsulta,
  getEstadisticas,
  getConsultasByPaciente,
  getConsultasByMedico,
  getSignosVitales,
  registrarSignosVitales,
};