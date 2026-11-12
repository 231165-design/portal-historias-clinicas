// ============================================================
// GENERADOR DE NÚMERO DE HISTORIA CLÍNICA
// Sistema de Historias Clínicas - Postas de Salud
// ============================================================

import db from '../models/index.js';
import logger from '../config/logger.js';

const { Paciente } = db;
const { Op } = db.Sequelize;

// ============================================================
// GENERAR HISTORIA CLÍNICA (Formato: YYYY-NNNNN)
// Ejemplo: 2026-00001
// ============================================================
export const generateHistoriaClinica = async () => {
  try {
    const year = new Date().getFullYear();
    const prefix = `${year}-`;

    // Buscar el último paciente del año actual
    const ultimoPaciente = await Paciente.findOne({
      where: {
        historia_clinica: { [Op.like]: `${prefix}%` },
      },
      order: [['historia_clinica', 'DESC']],
    });

    let siguienteNumero = 1;

    if (ultimoPaciente) {
      const partes = ultimoPaciente.historia_clinica.split('-');
      if (partes.length === 2) {
        const ultimoNumero = parseInt(partes[1], 10);
        if (!isNaN(ultimoNumero)) {
          siguienteNumero = ultimoNumero + 1;
        }
      }
    }

    const numeroFormateado = String(siguienteNumero).padStart(5, '0');
    const nuevaHC = `${prefix}${numeroFormateado}`;

    logger.info(`📋 Nueva HC generada: ${nuevaHC}`);
    return nuevaHC;
  } catch (error) {
    logger.error('Error al generar HC:', error);
    throw error;
  }
};

// ============================================================
// VALIDAR FORMATO DE HC
// ============================================================
export const isValidHC = (hc) => {
  return /^\d{4}-\d{5}$/.test(hc);
};

// ============================================================
// EXTRAER AÑO DE HC
// ============================================================
export const getYearFromHC = (hc) => {
  if (!isValidHC(hc)) return null;
  return parseInt(hc.split('-')[0], 10);
};

// ============================================================
// EXTRAER NÚMERO SECUENCIAL
// ============================================================
export const getNumberFromHC = (hc) => {
  if (!isValidHC(hc)) return null;
  return parseInt(hc.split('-')[1], 10);
};

// ============================================================
// GENERAR CÓDIGO DE RECETA (Formato: REC-YYYY-NNNNN)
// ============================================================
export const generateCodigoReceta = async () => {
  try {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 90000) + 10000;
    return `REC-${year}-${random}`;
  } catch (error) {
    logger.error('Error al generar código de receta:', error);
    throw error;
  }
};

// ============================================================
// GENERAR CÓDIGO DE PACIENTE TEMPORAL
// ============================================================
export const generateCodigoTemporal = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TMP-${timestamp}-${random}`;
};

export default {
  generateHistoriaClinica,
  isValidHC,
  getYearFromHC,
  getNumberFromHC,
  generateCodigoReceta,
  generateCodigoTemporal,
};