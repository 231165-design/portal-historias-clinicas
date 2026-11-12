// ============================================================
// CONTROLADOR: Dashboard (estadísticas generales)
// ============================================================

import db from '../models/index.js';
import { HTTP_STATUS } from '../config/constants.js';
import { asyncHandler } from '../middlewares/errorMiddleware.js';

const { Paciente, Usuario, Consulta, Posta } = db;
const { Op, fn, col, literal } = db.Sequelize;

// ============================================================
// HELPER: Calcular variación porcentual
// ============================================================
const calcVariacion = (actual, anterior) => {
  if (anterior === 0) return actual > 0 ? 100 : 0;
  return Number((((actual - anterior) / anterior) * 100).toFixed(1));
};

// ============================================================
// GET /api/dashboard/stats
// Retorna las 4 tarjetas principales del dashboard
// ============================================================
export const getStats = asyncHandler(async (req, res) => {
  // ===== FECHAS =====
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const ayer = new Date(hoy);
  ayer.setDate(ayer.getDate() - 1);

  const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  const inicioMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
  const finMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth(), 0, 23, 59, 59);

  // ===== QUERIES EN PARALELO =====
  const [
    totalPacientes,
    pacientesNuevosMes,
    pacientesNuevosMesAnterior,
    totalUsuarios,
    consultasHoy,
    consultasAyer,
    consultasMes,
    consultasMesAnterior,
    citasPendientes,
    stockBajo,
  ] = await Promise.all([
    // Total pacientes activos
    Paciente.count({ where: { activo: true } }),

    // Pacientes nuevos este mes
    Paciente.count({
      where: {
        activo: true,
        created_at: { [Op.gte]: inicioMes },
      },
    }),

    // Pacientes nuevos mes anterior (para variación)
    Paciente.count({
      where: {
        activo: true,
        created_at: { [Op.between]: [inicioMesAnterior, finMesAnterior] },
      },
    }),

    // Total usuarios activos
    Usuario.count({ where: { activo: true } }),

    // Consultas hoy
    Consulta.count({
      where: { fecha_hora: { [Op.gte]: hoy } },
    }).catch(() => 0),

    // Consultas ayer (para variación)
    Consulta.count({
      where: {
        fecha_hora: {
          [Op.between]: [ayer, new Date(ayer.getTime() + 24 * 60 * 60 * 1000)],
        },
      },
    }).catch(() => 0),

    // Consultas este mes
    Consulta.count({
      where: { fecha_hora: { [Op.gte]: inicioMes } },
    }).catch(() => 0),

    // Consultas mes anterior
    Consulta.count({
      where: {
        fecha_hora: { [Op.between]: [inicioMesAnterior, finMesAnterior] },
      },
    }).catch(() => 0),

    // Citas pendientes (próximas 7 días)
    Consulta.count({
      where: {
        proxima_cita: {
          [Op.gte]: hoy,
          [Op.lte]: new Date(hoy.getTime() + 7 * 24 * 60 * 60 * 1000),
        },
        estado: { [Op.ne]: 'Anulada' },
      },
    }).catch(() => 0),

    // Stock bajo (query real a medicamentos)
    db.sequelize
      .query(
        `SELECT COUNT(*) as total FROM medicamentos WHERE stock_actual <= stock_minimo AND activo = TRUE`,
        { type: db.Sequelize.QueryTypes.SELECT }
      )
      .then((r) => Number(r[0]?.total || 0))
      .catch(() => 0),
  ]);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: {
      totalPacientes,
      pacientesNuevosMes,
      pacientesVariacion: calcVariacion(pacientesNuevosMes, pacientesNuevosMesAnterior),
      totalUsuarios,
      consultasHoy,
      consultasAyer,
      consultasVariacion: calcVariacion(consultasHoy, consultasAyer),
      consultasMes,
      consultasMesVariacion: calcVariacion(consultasMes, consultasMesAnterior),
      citasPendientes,
      stockBajo,
      estado: 'Activo',
    },
  });
});

// ============================================================
// GET /api/dashboard/charts
// Retorna datos para los gráficos
// ============================================================
export const getCharts = asyncHandler(async (req, res) => {
  // ===== CONSULTAS POR MES (últimos 6 meses) =====
  const hoy = new Date();
  const hace6Meses = new Date(hoy.getFullYear(), hoy.getMonth() - 5, 1);

  const consultasPorMesRaw = await Consulta.findAll({
    attributes: [
      [fn('DATE_FORMAT', col('fecha_hora'), '%Y-%m'), 'mes'],
      [fn('COUNT', col('id')), 'cantidad'],
    ],
    where: {
      fecha_hora: { [Op.gte]: hace6Meses },
    },
    group: [literal("DATE_FORMAT(fecha_hora, '%Y-%m')")],
    order: [[literal("DATE_FORMAT(fecha_hora, '%Y-%m')"), 'ASC']],
    raw: true,
  }).catch(() => []);

  const mesesNombres = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  // Generar los 6 meses completos (rellenando con 0 si falta alguno)
  const consultasPorMes = [];
  for (let i = 5; i >= 0; i--) {
    const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
    const mesKey = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
    const mesNombre = mesesNombres[fecha.getMonth()];

    const found = consultasPorMesRaw.find((r) => r.mes === mesKey);
    consultasPorMes.push({
      mes: mesNombre,
      cantidad: found ? Number(found.cantidad) : 0,
    });
  }

  // ===== DISTRIBUCIÓN POR DIAGNÓSTICO (Top 5) =====
  const distribucionDiagnosticosRaw = await Consulta.findAll({
    attributes: [
      ['diagnostico_principal', 'diagnostico'],
      [fn('COUNT', col('id')), 'cantidad'],
    ],
    where: {
      diagnostico_principal: { [Op.ne]: null },
      estado: 'Completada',
    },
    group: ['diagnostico_principal'],
    order: [[fn('COUNT', col('id')), 'DESC']],
    limit: 5,
    raw: true,
  }).catch(() => []);

  const colores = ['#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#3b82f6'];

  const distribucionDiagnosticos = distribucionDiagnosticosRaw.map((d, i) => ({
    nombre: d.diagnostico,
    cantidad: Number(d.cantidad),
    color: colores[i % colores.length],
  }));

  // ===== CONSULTAS POR DÍA (últimos 7 días) =====
  const consultasPorDiaRaw = await Consulta.findAll({
    attributes: [
      [fn('DATE', col('fecha_hora')), 'dia'],
      [fn('COUNT', col('id')), 'cantidad'],
    ],
    where: {
      fecha_hora: {
        [Op.gte]: new Date(hoy.getTime() - 6 * 24 * 60 * 60 * 1000),
      },
    },
    group: [literal('DATE(fecha_hora)')],
    order: [[literal('DATE(fecha_hora)'), 'ASC']],
    raw: true,
  }).catch(() => []);

  const diasNombres = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const consultasPorDia = [];

  for (let i = 6; i >= 0; i--) {
    const fecha = new Date(hoy.getTime() - i * 24 * 60 * 60 * 1000);
    const diaKey = fecha.toISOString().split('T')[0];
    const diaNombre = diasNombres[fecha.getDay()];
    const found = consultasPorDiaRaw.find((r) => r.dia === diaKey);
    consultasPorDia.push({
      dia: diaNombre,
      cantidad: found ? Number(found.cantidad) : 0,
    });
  }

  // ===== DISTRIBUCIÓN POR SEXO =====
  const distribucionSexoRaw = await Paciente.findAll({
    attributes: [
      ['sexo', 'sexo'],
      [fn('COUNT', col('id')), 'cantidad'],
    ],
    where: { activo: true },
    group: ['sexo'],
    raw: true,
  }).catch(() => []);

  const distribucionSexo = distribucionSexoRaw.map((s) => ({
    nombre: s.sexo === 'M' ? 'Masculino' : 'Femenino',
    cantidad: Number(s.cantidad),
    color: s.sexo === 'M' ? '#3b82f6' : '#ec4899',
  }));

  // ===== DISTRIBUCIÓN POR EDAD =====
  const distribucionEdad = await db.sequelize
    .query(
      `
      SELECT 
        CASE
          WHEN TIMESTAMPDIFF(YEAR, fecha_nacimiento, CURDATE()) < 5 THEN '0-4'
          WHEN TIMESTAMPDIFF(YEAR, fecha_nacimiento, CURDATE()) < 18 THEN '5-17'
          WHEN TIMESTAMPDIFF(YEAR, fecha_nacimiento, CURDATE()) < 30 THEN '18-29'
          WHEN TIMESTAMPDIFF(YEAR, fecha_nacimiento, CURDATE()) < 60 THEN '30-59'
          ELSE '60+'
        END AS rango,
        COUNT(*) as cantidad
      FROM pacientes
      WHERE activo = TRUE
      GROUP BY rango
      ORDER BY FIELD(rango, '0-4', '5-17', '18-29', '30-59', '60+')
      `,
      { type: db.Sequelize.QueryTypes.SELECT }
    )
    .then((rows) =>
      rows.map((r) => ({
        rango: r.rango,
        cantidad: Number(r.cantidad),
      }))
    )
    .catch(() => []);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: {
      consultasPorMes,
      consultasPorDia,
      distribucionDiagnosticos,
      distribucionSexo,
      distribucionEdad,
    },
  });
});

// ============================================================
// GET /api/dashboard/actividad
// Retorna las últimas acciones y consultas
// ============================================================
export const getActividad = asyncHandler(async (req, res) => {
  const hoy = new Date();
  const hace7Dias = new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000);

  // ===== ÚLTIMAS CONSULTAS =====
  const ultimasConsultas = await Consulta.findAll({
    limit: 5,
    order: [['fecha_hora', 'DESC']],
    attributes: [
      'id',
      'fecha_hora',
      'diagnostico_principal',
      'cie10_principal',
      'motivo_consulta',
      'estado',
    ],
    include: [
      {
        model: Paciente,
        as: 'paciente',
        attributes: ['id', 'nombres', 'apellidos', 'historia_clinica'],
      },
      {
        model: Usuario,
        as: 'medico',
        attributes: ['id', 'nombres', 'apellidos'],
      },
    ],
  }).catch(() => []);

  // ===== ÚLTIMOS PACIENTES =====
  const ultimosPacientes = await Paciente.findAll({
    limit: 5,
    order: [['created_at', 'DESC']],
    attributes: ['id', 'nombres', 'apellidos', 'historia_clinica', 'created_at', 'sexo'],
  }).catch(() => []);

  // ===== ÚLTIMOS USUARIOS =====
  const ultimosUsuarios = await Usuario.findAll({
    limit: 5,
    order: [['created_at', 'DESC']],
    attributes: ['id', 'nombres', 'apellidos', 'email', 'created_at'],
  }).catch(() => []);

  // ===== ACTIVIDAD RECIENTE (últimos 7 días) =====
  const actividad = [];

  // Agregar consultas recientes
  ultimasConsultas.forEach((c) => {
    actividad.push({
      id: `consulta-${c.id}`,
      tipo: 'consulta',
      titulo: `Nueva consulta registrada`,
      descripcion: `${c.paciente?.nombres} ${c.paciente?.apellidos} - ${c.diagnostico_principal || 'Sin diagnóstico'}`,
      fecha: c.fecha_hora,
      color: 'blue',
      icono: '🩺',
    });
  });

  // Agregar pacientes recientes
  ultimosPacientes.slice(0, 3).forEach((p) => {
    actividad.push({
      id: `paciente-${p.id}`,
      tipo: 'paciente',
      titulo: 'Nuevo paciente registrado',
      descripcion: `${p.nombres} ${p.apellidos} - HC: ${p.historia_clinica}`,
      fecha: p.created_at,
      color: 'green',
      icono: '👤',
    });
  });

  // Ordenar por fecha descendente y limitar a 5
  actividad.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  const actividadReciente = actividad.slice(0, 5);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: {
      ultimasConsultas,
      ultimosPacientes,
      ultimosUsuarios,
      actividadReciente,
    },
  });
});

// ============================================================
// GET /api/dashboard/resumen
// Retorna un resumen completo para el Dashboard principal
// ============================================================
export const getResumen = asyncHandler(async (req, res) => {
  // Queries en paralelo
  const [
    statsResult,
    chartsResult,
    actividadResult,
  ] = await Promise.allSettled([
    getStats({ query: {} }, {
      status: (code) => ({
        json: (data) => data,
      }),
    }),
    getCharts({ query: {} }, {
      status: (code) => ({
        json: (data) => data,
      }),
    }),
    getActividad({ query: {} }, {
      status: (code) => ({
        json: (data) => data,
      }),
    }),
  ]);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: {
      stats: statsResult.status === 'fulfilled' ? statsResult.value.data : null,
      charts: chartsResult.status === 'fulfilled' ? chartsResult.value.data : null,
      actividad: actividadResult.status === 'fulfilled' ? actividadResult.value.data : null,
    },
  });
});

export default {
  getStats,
  getCharts,
  getActividad,
  getResumen,
};