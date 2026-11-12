// ============================================================
// FORMATEADORES DE DATOS
// Sistema HIS Postas - Versión 1
// ============================================================

import { format, parseISO, differenceInYears, isValid } from 'date-fns';
import { es } from 'date-fns/locale';

// ============================================================
// FECHAS
// ============================================================

export const formatDate = (date) => {
  if (!date) return '-';
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(d)) return '-';
    return format(d, 'dd/MM/yyyy');
  } catch {
    return '-';
  }
};

export const formatDateLong = (date) => {
  if (!date) return '-';
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(d)) return '-';
    return format(d, "dd 'de' MMMM 'de' yyyy", { locale: es });
  } catch {
    return '-';
  }
};

export const formatDateTime = (date) => {
  if (!date) return '-';
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(d)) return '-';
    return format(d, 'dd/MM/yyyy HH:mm');
  } catch {
    return '-';
  }
};

export const formatTime = (date) => {
  if (!date) return '-';
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(d)) return '-';
    return format(d, 'HH:mm');
  } catch {
    return '-';
  }
};

export const formatRelativeTime = (date) => {
  if (!date) return '-';
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(d)) return '-';
    const now = new Date();
    const diffMs = now - d;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHour = Math.floor(diffMs / 3600000);
    const diffDay = Math.floor(diffMs / 86400000);

    if (diffMin < 1) return 'Ahora mismo';
    if (diffMin < 60) return `Hace ${diffMin} min`;
    if (diffHour < 24) return `Hace ${diffHour} h`;
    if (diffDay < 7) return `Hace ${diffDay} días`;
    return formatDate(date);
  } catch {
    return '-';
  }
};

export const calcularEdad = (fechaNacimiento) => {
  if (!fechaNacimiento) return 0;
  try {
    const fecha = typeof fechaNacimiento === 'string' ? parseISO(fechaNacimiento) : fechaNacimiento;
    return differenceInYears(new Date(), fecha);
  } catch {
    return 0;
  }
};

export const timeAgo = (date) => {
  if (!date) return '-';
  const d = typeof date === 'string' ? parseISO(date) : date;
  const segundos = Math.floor((new Date() - d) / 1000);

  if (segundos < 60) return 'hace unos segundos';
  const minutos = Math.floor(segundos / 60);
  if (minutos < 60) return `hace ${minutos} min`;
  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `hace ${horas} h`;
  const dias = Math.floor(horas / 24);
  if (dias < 30) return `hace ${dias} días`;
  const meses = Math.floor(dias / 30);
  if (meses < 12) return `hace ${meses} meses`;
  const años = Math.floor(meses / 12);
  return `hace ${años} años`;
};

// ============================================================
// NOMBRES Y TEXTOS
// ============================================================

export const capitalize = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const getInitials = (nombres, apellidos = '') => {
  const n = nombres ? nombres.trim().charAt(0).toUpperCase() : '';
  const a = apellidos ? apellidos.trim().charAt(0).toUpperCase() : '';
  return `${n}${a}`;
};

export const getNombreCompleto = (persona) => {
  if (!persona) return '-';
  return `${persona.nombres || ''} ${persona.apellidos || ''}`.trim() || '-';
};

export const truncate = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

// ============================================================
// NÚMEROS Y MONEDA
// ============================================================

export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return 'S/ 0.00';
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatNumber = (number) => {
  if (number === null || number === undefined) return '0';
  return new Intl.NumberFormat('es-PE').format(number);
};

export const formatPercent = (value, decimals = 1) => {
  if (value === null || value === undefined) return '0%';
  return `${Number(value).toFixed(decimals)}%`;
};

// ============================================================
// DOCUMENTOS
// ============================================================

export const formatDNI = (dni) => {
  if (!dni) return '-';
  return String(dni).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

export const formatPhone = (phone) => {
  if (!phone) return '-';
  const cleaned = String(phone).replace(/\D/g, '');
  if (cleaned.length === 9) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }
  return phone;
};

export const formatHC = (hc) => {
  if (!hc) return '-';
  return hc;
};

// ============================================================
// SIGNOS VITALES
// ============================================================

export const calcularIMC = (peso, talla) => {
  if (!peso || !talla) return null;
  const tallaM = talla / 100;
  const imc = peso / (tallaM * tallaM);
  return Number(imc.toFixed(2));
};

export const clasificarIMC = (imc) => {
  if (!imc) return { label: '-', color: 'gray' };
  if (imc < 18.5) return { label: 'Bajo peso', color: 'yellow' };
  if (imc < 25) return { label: 'Normal', color: 'green' };
  if (imc < 30) return { label: 'Sobrepeso', color: 'orange' };
  if (imc < 35) return { label: 'Obesidad I', color: 'red' };
  if (imc < 40) return { label: 'Obesidad II', color: 'red' };
  return { label: 'Obesidad III', color: 'red' };
};

export const formatPresion = (sistolica, diastolica) => {
  if (!sistolica || !diastolica) return '-';
  return `${sistolica}/${diastolica}`;
};

// ============================================================
// ESTADOS Y BADGES
// ============================================================

export const getEstadoColor = (estado) => {
  const colores = {
    'Completada': 'green',
    'En curso': 'blue',
    'Anulada': 'red',
    'Programada': 'blue',
    'Confirmada': 'cyan',
    'Atendida': 'green',
    'Cancelada': 'red',
    'No asistió': 'gray',
    'Emitida': 'blue',
    'Dispensada': 'green',
    'CRÍTICO': 'red',
    'BAJO': 'yellow',
    'OK': 'green',
    'VENCIDO': 'red',
    'POR VENCER': 'yellow',
  };
  return colores[estado] || 'gray';
};

// ============================================================
// EXPORT DEFAULT
// ============================================================
export default {
  formatDate,
  formatDateLong,
  formatDateTime,
  formatTime,
  formatRelativeTime,
  calcularEdad,
  timeAgo,
  capitalize,
  getInitials,
  getNombreCompleto,
  truncate,
  formatCurrency,
  formatNumber,
  formatPercent,
  formatDNI,
  formatPhone,
  formatHC,
  calcularIMC,
  clasificarIMC,
  formatPresion,
  getEstadoColor,
};