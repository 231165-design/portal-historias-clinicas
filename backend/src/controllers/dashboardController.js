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
// LÓGICA INTERNA: Stats (devuelve solo los datos)
// ============================================================
const obtenerStats = async () => {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const ayer = new Date(hoy);
  ayer.setDate(ayer.getDate() - 1);

  const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  const inicioMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
  const finMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth(), 0, 23, 59, 59);

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
    Paciente.count({ where: { activo: true } }),
    Paciente.count({ where: { activo: true, created_at: { [Op.gte]: inicioMes } } }),
    Paciente.count({ where: { activo: true, created_at: { [Op.between]: [inicioMesAnterior, finMesAnterior] } } }),
    Usuario.count({ where: { activo: true } }),
    Consulta.count({ where: { fecha_hora: { [Op.gte]: hoy } } }).catch(() => 0),
    Consulta.count({ where: { fecha_hora: { [Op.between]: [ayer, new Date(ayer.getTime() + 24 * 60 * 60 * 1000)] } } }).catch(() => 0),
    Consulta.count({ where: { fecha_hora: { [Op.gte]: inicioMes } } }).catch(() => 0),
    Consulta.count({ where: { fecha_hora: { [Op.between]: [inicioMesAnterior, finMesAnterior] } } }).catch(() => 0),
    Consulta.count({
      where: {
        proxima_cita: { [Op.gte]: hoy, [Op.lte]: new Date(hoy.getTime() + 7 * 24 * 60 * 60 * 1000) },
        estado: { [Op.ne]: 'Anulada' },
      },
    }).catch(() => 0),
    db.sequelize
      .query(`SELECT COUNT(*) as total FROM medicamentos WHERE stock_actual <= stock_minimo AND activo = TRUE`, { type: db.Sequelize.QueryTypes.SELECT })
      .then((r) => Number(r[0]?.total || 0))
      .catch(() => 0),
  ]);

  return {
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
  };
};

// ============================================================
// LÓGICA INTERNA: Charts (devuelve solo los datos)
// ============================================================
const obtenerCharts = async () => {
  const hoy = new Date();
  const hace6Meses = new Date(hoy.getFullYear(), hoy.getMonth() - 5, 1);

  const consultasPorMesRaw = await Consulta.findAll({
    attributes: [
      [fn('DATE_FORMAT', col('fecha_hora'), '%Y-%m'), 'mes'],
      [fn('COUNT', col('id')), 'cantidad'],
    ],
    where: { fecha_hora: { [Op.gte]: hace6Meses } },
    group: [literal("DATE_FORMAT(fecha_hora, '%Y-%m')")],
    order: [[literal("DATE_FORMAT(fecha_hora, '%Y-%m')"), 'ASC']],
    raw: true,
  }).catch(() => []);

  const mesesNombres = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const consultasPorMes = [];
  for (let i = 5; i >= 0; i--) {
    const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
    const mesKey = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
    const mesNombre = mesesNombres[fecha.getMonth()];
    const found = consultasPorMesRaw.find((r) => r.mes === mesKey);
    consultasPorMes.push({ mes: mesNombre, cantidad: found ? Number(found.cantidad) : 0 });
  }

  const distribucionDiagnosticosRaw = await Consulta.findAll({
    attributes: [['diagnostico_principal', 'diagnostico'], [fn('COUNT', col('id')), 'cantidad']],
    where: { diagnostico_principal: { [Op.ne]: null }, estado: 'Completada' },
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

  const consultasPorDiaRaw = await Consulta.findAll({
    attributes: [[fn('DATE', col('fecha_hora')), 'dia'], [fn('COUNT', col('id')), 'cantidad']],
    where: { fecha_hora: { [Op.gte]: new Date(hoy.getTime() - 6 * 24 * 60 * 60 * 1000) } },
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
    consultasPorDia.push({ dia: diaNombre, cantidad: found ? Number(found.cantidad) : 0 });
  }

  const distribucionSexoRaw = await Paciente.findAll({
    attributes: [['sexo', 'sexo'], [fn('COUNT', col('id')), 'cantidad']],
    where: { activo: true },
    group: ['sexo'],
    raw: true,
  }).catch(() => []);

  const distribucionSexo = distribucionSexoRaw.map((s) => ({
    nombre: s.sexo === 'M' ? 'Masculino' : 'Femenino',
    cantidad: Number(s.cantidad),
    color: s.sexo === 'M' ? '#3b82f6' : '#ec4899',
  }));

  const distribucionEdad = await db.sequelize
    .query(
      `SELECT 
        CASE
          WHEN TIMESTAMPDIFF(YEAR, fecha_nacimiento, CURDATE()) < 5 THEN '0-4'
          WHEN TIMESTAMPDIFF(YEAR, fecha_nacimiento, CURDATE()) < 18 THEN '5-17'
          WHEN TIMESTAMPDIFF(YEAR, fecha_nacimiento, CURDATE()) < 30 THEN '18-29'
          WHEN TIMESTAMPDIFF(YEAR, fecha_nacimiento, CURDATE()) < 60 THEN '30-59'
          ELSE '60+'
        END AS rango,
        COUNT(*) as cantidad
      FROM pacientes WHERE activo = TRUE
      GROUP BY rango ORDER BY FIELD(rango, '0-4', '5-17', '18-29', '30-59', '60+')`,
      { type: db.Sequelize.QueryTypes.SELECT }
    )
    .then((rows) => rows.map((r) => ({ rango: r.rango, cantidad: Number(r.cantidad) })))
    .catch(() => []);

  return {
    consultasPorMes,
    consultasPorDia,
    distribucionDiagnosticos,
    distribucionSexo,
    distribucionEdad,
  };
};

// ============================================================
// LÓGICA INTERNA: Actividad (devuelve solo los datos)
// ============================================================
const obtenerActividad = async () => {
  const hoy = new Date();
  const hace7Dias = new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000);

  const ultimasConsultas = await Consulta.findAll({
    limit: 5,
    order: [['fecha_hora', 'DESC']],
    attributes: ['id', 'fecha_hora', 'diagnostico_principal', 'cie10_principal', 'motivo_consulta', 'estado'],
    include: [
      { model: Paciente, as: 'paciente', attributes: ['id', 'nombres', 'apellidos', 'historia_clinica'] },
      { model: Usuario, as: 'medico', attributes: ['id', 'nombres', 'apellidos'] },
    ],
  }).catch(() => []);

  const ultimosPacientes = await Paciente.findAll({
    limit: 5,
    order: [['created_at', 'DESC']],
    attributes: ['id', 'nombres', 'apellidos', 'historia_clinica', 'created_at', 'sexo'],
  }).catch(() => []);

  const ultimosUsuarios = await Usuario.findAll({
    limit: 5,
    order: [['created_at', 'DESC']],
    attributes: ['id', 'nombres', 'apellidos', 'email', 'created_at'],
  }).catch(() => []);

  const actividad = [];
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

  actividad.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  const actividadReciente = actividad.slice(0, 5);

  return { ultimasConsultas, ultimosPacientes, ultimosUsuarios, actividadReciente };
};

// ============================================================
// ENDPOINTS EXPUESTOS (Rutas de Express)
// ============================================================

export const getStats = asyncHandler(async (req, res) => {
  const data = await obtenerStats();
  res.status(HTTP_STATUS.OK).json({ success: true, data });
});

export const getCharts = asyncHandler(async (req, res) => {
  const data = await obtenerCharts();
  res.status(HTTP_STATUS.OK).json({ success: true, data });
});

export const getActividad = asyncHandler(async (req, res) => {
  const data = await obtenerActividad();
  res.status(HTTP_STATUS.OK).json({ success: true, data });
});

export const getResumen = asyncHandler(async (req, res) => {
  const [stats, charts, actividad] = await Promise.allSettled([
    obtenerStats(),
    obtenerCharts(),
    obtenerActividad(),
  ]);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: {
      stats: stats.status === 'fulfilled' ? stats.value : null,
      charts: charts.status === 'fulfilled' ? charts.value : null,
      actividad: actividad.status === 'fulfilled' ? actividad.value : null,
    },
  });
});

export default {
  getStats,
  getCharts,
  getActividad,
  getResumen,
};