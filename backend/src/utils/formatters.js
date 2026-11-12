// ============================================================
// FORMATEADORES DE DATOS
// Sistema de Historias Clínicas - Postas de Salud
// ============================================================

// ============================================================
// FECHAS
// ============================================================
export const formatDate = (date) => {
  if (!date) return '-';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const formatDateLong = (date) => {
  if (!date) return '-';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const formatDateTime = (date) => {
  if (!date) return '-';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '-';
  return d.toLocaleString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatTime = (date) => {
  if (!date) return '-';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '-';
  return d.toLocaleTimeString('es-PE', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

// ============================================================
// NOMBRES
// ============================================================
export const getNombreCompleto = (persona) => {
  if (!persona) return '-';
  return `${persona.nombres || ''} ${persona.apellidos || ''}`.trim() || '-';
};

export const getInitials = (nombres, apellidos = '') => {
  const n = nombres?.trim().charAt(0).toUpperCase() || '';
  const a = apellidos?.trim().charAt(0).toUpperCase() || '';
  return `${n}${a}`;
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

export const formatHistoriaClinica = (hc) => {
  if (!hc) return '-';
  return hc;
};

// ============================================================
// SIGNOS VITALES
// ============================================================
export const formatPresion = (sistolica, diastolica) => {
  if (!sistolica || !diastolica) return '-';
  return `${sistolica}/${diastolica} mmHg`;
};

export const formatTemperatura = (temp) => {
  if (!temp) return '-';
  return `${temp} °C`;
};

export const formatIMC = (imc) => {
  if (!imc) return '-';
  return Number(imc).toFixed(2);
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

export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  return new Intl.NumberFormat('es-PE').format(num);
};

export const formatPercent = (value, decimals = 1) => {
  if (value === null || value === undefined) return '0%';
  return `${Number(value).toFixed(decimals)}%`;
};

// ============================================================
// RESPUESTAS DE API
// ============================================================
export const formatSuccess = (data, message = 'OK') => ({
  success: true,
  message,
  data,
  timestamp: new Date().toISOString(),
});

export const formatError = (message, errors = null) => ({
  success: false,
  message,
  ...(errors && { errors }),
  timestamp: new Date().toISOString(),
});

// ============================================================
// TRUNCAR TEXTO
// ============================================================
export const truncate = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

export default {
  formatDate,
  formatDateLong,
  formatDateTime,
  formatTime,
  getNombreCompleto,
  getInitials,
  formatDNI,
  formatPhone,
  formatHistoriaClinica,
  formatPresion,
  formatTemperatura,
  formatIMC,
  formatCurrency,
  formatNumber,
  formatPercent,
  formatSuccess,
  formatError,
  truncate,
};