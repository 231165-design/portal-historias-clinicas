// ============================================================
// SERVICIO: Gestión de Pacientes
// ============================================================

import db from '../models/index.js';
import logger from '../config/logger.js';
import { MESSAGES } from '../config/constants.js';

const { Paciente, Posta, Usuario, Consulta } = db;
const { Op } = db.Sequelize;

// ============================================================
// GENERAR CÓDIGO DE HISTORIA CLÍNICA
// Formato: YYYY-NNNNN (ej: 2026-00001)
// ============================================================
const generarHistoriaClinica = async () => {
  const year = new Date().getFullYear();
  const prefix = `${year}-`;

  const ultimoPaciente = await Paciente.findOne({
    where: {
      historia_clinica: { [Op.like]: `${prefix}%` },
    },
    order: [['historia_clinica', 'DESC']],
  });

  let siguienteNumero = 1;
  if (ultimoPaciente) {
    const ultimoNumero = parseInt(ultimoPaciente.historia_clinica.split('-')[1], 10);
    if (!isNaN(ultimoNumero)) {
      siguienteNumero = ultimoNumero + 1;
    }
  }

  return `${prefix}${String(siguienteNumero).padStart(5, '0')}`;
};

// ============================================================
// LISTAR PACIENTES CON FILTROS Y PAGINACIÓN
// ============================================================
export const listPacientes = async ({
  page = 1,
  limit = 10,
  search,
  posta_id,
  activo = true,
  sexo,
  tipo_seguro,
  rango_edad,
} = {}) => {
  const where = {};

  // Búsqueda general
  if (search) {
    where[Op.or] = [
      { nombres: { [Op.like]: `%${search}%` } },
      { apellidos: { [Op.like]: `%${search}%` } },
      { dni: { [Op.like]: `%${search}%` } },
      { historia_clinica: { [Op.like]: `%${search}%` } },
    ];
  }

  // Filtros
  if (posta_id) where.posta_id = posta_id;
  if (activo !== undefined) where.activo = activo;
  if (sexo) where.sexo = sexo;
  if (tipo_seguro) where.tipo_seguro = tipo_seguro;

  // Filtro por rango de edad
  if (rango_edad) {
    const hoy = new Date();
    let edadMin = 0;
    let edadMax = 200;

    switch (rango_edad) {
      case '0-5':
        edadMin = 0;
        edadMax = 5;
        break;
      case '6-17':
        edadMin = 6;
        edadMax = 17;
        break;
      case '18-29':
        edadMin = 18;
        edadMax = 29;
        break;
      case '30-59':
        edadMin = 30;
        edadMax = 59;
        break;
      case '60+':
        edadMin = 60;
        edadMax = 200;
        break;
      default:
        break;
    }

    const fechaMaxNacimiento = new Date(hoy.getFullYear() - edadMin, hoy.getMonth(), hoy.getDate());
    const fechaMinNacimiento = new Date(hoy.getFullYear() - edadMax - 1, hoy.getMonth(), hoy.getDate());

    where.fecha_nacimiento = {
      [Op.between]: [fechaMinNacimiento, fechaMaxNacimiento],
    };
  }

  const offset = (page - 1) * limit;

  const { rows, count } = await Paciente.findAndCountAll({
    where,
    include: [
      { model: Posta, as: 'posta', attributes: ['id', 'nombre', 'codigo'] },
    ],
    order: [['created_at', 'DESC']],
    limit,
    offset,
  });

  return {
    data: rows,
    pagination: {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    },
  };
};

// ============================================================
// OBTENER PACIENTE POR ID
// ============================================================
export const getPacienteById = async (id) => {
  const paciente = await Paciente.findByPk(id, {
    include: [
      { model: Posta, as: 'posta', attributes: ['id', 'nombre'] },
      { model: Usuario, as: 'creador', attributes: ['id', 'nombres', 'apellidos'] },
    ],
  });

  if (!paciente) {
    throw { statusCode: 404, message: MESSAGES.NOT_FOUND };
  }

  return paciente;
};

// ============================================================
// BUSCAR POR DNI O HISTORIA CLÍNICA
// ============================================================
export const buscarPaciente = async (termino) => {
  const paciente = await Paciente.findOne({
    where: {
      [Op.or]: [
        { dni: termino },
        { historia_clinica: termino },
      ],
    },
    include: [{ model: Posta, as: 'posta', attributes: ['nombre'] }],
  });

  return paciente;
};

// ============================================================
// CREAR PACIENTE
// ============================================================
export const createPaciente = async (data, createdBy) => {
  // Verificar DNI único
  if (data.dni) {
    const existeDNI = await Paciente.findOne({ where: { dni: data.dni } });
    if (existeDNI) {
      throw { statusCode: 409, message: 'El DNI ya está registrado' };
    }
  }

  // Generar historia clínica
  const historia_clinica = await generarHistoriaClinica();

  const paciente = await Paciente.create({
    ...data,
    historia_clinica,
    posta_id: data.posta_id || 1,
    created_by: createdBy,
    activo: true,
  });

  logger.info(`✅ Paciente creado: ${paciente.historia_clinica} - ${paciente.nombres} ${paciente.apellidos}`);

  return paciente;
};

// ============================================================
// ACTUALIZAR PACIENTE
// ============================================================
export const updatePaciente = async (id, data) => {
  const paciente = await Paciente.findByPk(id);

  if (!paciente) {
    throw { statusCode: 404, message: MESSAGES.NOT_FOUND };
  }

  // Verificar DNI único si cambia
  if (data.dni && data.dni !== paciente.dni) {
    const existeDNI = await Paciente.findOne({
      where: { dni: data.dni, id: { [Op.ne]: id } },
    });
    if (existeDNI) {
      throw { statusCode: 409, message: 'El DNI ya está registrado' };
    }
  }

  await paciente.update(data);

  logger.info(`✏️ Paciente actualizado: ${paciente.historia_clinica}`);

  return paciente;
};

// ============================================================
// ELIMINAR PACIENTE (soft delete)
// ============================================================
export const deletePaciente = async (id) => {
  const paciente = await Paciente.findByPk(id);

  if (!paciente) {
    throw { statusCode: 404, message: MESSAGES.NOT_FOUND };
  }

  await paciente.update({ activo: false });

  logger.info(`🗑️ Paciente desactivado: ${paciente.historia_clinica}`);

  return { success: true, message: MESSAGES.DELETED_SUCCESS };
};

// ============================================================
// ESTADÍSTICAS DE PACIENTES
// ============================================================
export const getEstadisticasPacientes = async () => {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

  // Total pacientes activos
  const total = await Paciente.count({ where: { activo: true } });

  // Pacientes nuevos este mes
  const nuevosEsteMes = await Paciente.count({
    where: {
      activo: true,
      created_at: { [Op.gte]: inicioMes },
    },
  });

  // Distribución por sexo
  const porSexo = await Paciente.findAll({
    attributes: [
      'sexo',
      [db.sequelize.fn('COUNT', db.sequelize.col('sexo')), 'total'],
    ],
    where: { activo: true },
    group: ['sexo'],
    raw: true,
  });

  const masculino = Number(porSexo.find((s) => s.sexo === 'M')?.total || 0);
  const femenino = Number(porSexo.find((s) => s.sexo === 'F')?.total || 0);

  // Consultas del mes
  const consultasMes = await Consulta.count({
    where: { fecha_hora: { [Op.gte]: inicioMes } },
  }).catch(() => 0);

  // Citas pendientes (próximas 7 días)
  const citasPendientes = await Consulta.count({
    where: {
      proxima_cita: {
        [Op.gte]: hoy,
        [Op.lte]: new Date(hoy.getTime() + 7 * 24 * 60 * 60 * 1000),
      },
      estado: { [Op.ne]: 'Anulada' },
    },
  }).catch(() => 0);

  // Vacunas al día (query directa a tabla vacunas)
  const vacunasAlDia = await db.sequelize
    .query(
      `SELECT COUNT(DISTINCT paciente_id) as total FROM vacunas 
       WHERE YEAR(fecha_aplicacion) = YEAR(CURDATE())`,
      { type: db.Sequelize.QueryTypes.SELECT }
    )
    .then((r) => Number(r[0]?.total || 0))
    .catch(() => 0);

  return {
    total,
    nuevosEsteMes,
    masculino,
    femenino,
    consultasMes,
    citasPendientes,
    vacunasAlDia,
    porSexo,
  };
};

// ============================================================
// OBTENER HISTORIA CLÍNICA COMPLETA
// ============================================================
export const getHistoriaClinica = async (id) => {
  const paciente = await Paciente.findByPk(id, {
    include: [
      { model: Posta, as: 'posta', attributes: ['id', 'nombre'] },
      {
        model: Consulta,
        as: 'consultas',
        separate: true,
        order: [['fecha_hora', 'DESC']],
        limit: 20,
        include: [
          { model: Usuario, as: 'medico', attributes: ['nombres', 'apellidos'] },
        ],
      },
    ],
  });

  if (!paciente) {
    throw { statusCode: 404, message: MESSAGES.NOT_FOUND };
  }

  return paciente;
};

// ============================================================
// OBTENER ANTECEDENTES DEL PACIENTE
// ============================================================
export const getAntecedentes = async (id) => {
  const antecedentes = await db.sequelize
    .query(
      `SELECT * FROM antecedentes WHERE paciente_id = ? AND activo = TRUE ORDER BY fecha DESC`,
      {
        replacements: [id],
        type: db.Sequelize.QueryTypes.SELECT,
      }
    )
    .catch(() => []);

  return antecedentes;
};

// ============================================================
// OBTENER CONSULTAS DEL PACIENTE
// ============================================================
export const getConsultas = async (id) => {
  const consultas = await Consulta.findAll({
    where: { paciente_id: id },
    order: [['fecha_hora', 'DESC']],
    include: [
      { model: Usuario, as: 'medico', attributes: ['nombres', 'apellidos'] },
    ],
  }).catch(() => []);

  return consultas;
};

// ============================================================
// OBTENER VACUNAS DEL PACIENTE
// ============================================================
export const getVacunas = async (id) => {
  const vacunas = await db.sequelize
    .query(
      `SELECT * FROM vacunas WHERE paciente_id = ? ORDER BY fecha_aplicacion DESC`,
      {
        replacements: [id],
        type: db.Sequelize.QueryTypes.SELECT,
      }
    )
    .catch(() => []);

  return vacunas;
};

export default {
  listPacientes,
  getPacienteById,
  buscarPaciente,
  createPaciente,
  updatePaciente,
  deletePaciente,
  getEstadisticasPacientes,
  getHistoriaClinica,
  getAntecedentes,
  getConsultas,
  getVacunas,
  generarHistoriaClinica,
};