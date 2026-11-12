// ============================================================
// CONFIGURACIÓN DE ROLES Y PERMISOS
// Sistema de Historias Clínicas - Postas de Salud
// ============================================================

import { ROLES, PERMISSIONS } from '../utils/constants';

// ============================================================
// INFORMACIÓN DE CADA ROL
// ============================================================
export const ROLE_INFO = {
  [ROLES.ADMIN]: {
    label: 'Administrador',
    description: 'Acceso total al sistema',
    color: 'purple',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200',
    icon: '👑',
  },
  [ROLES.MEDICO]: {
    label: 'Médico',
    description: 'Atención médica y diagnóstico',
    color: 'blue',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
    icon: '🩺',
  },
  [ROLES.ENFERMERA]: {
    label: 'Enfermera/o',
    description: 'Signos vitales y vacunación',
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
    borderColor: 'border-green-200',
    icon: '💉',
  },
  [ROLES.OBSTETRA]: {
    label: 'Obstetra',
    description: 'Control prenatal y niño sano',
    color: 'pink',
    bgColor: 'bg-pink-100',
    textColor: 'text-pink-700',
    borderColor: 'border-pink-200',
    icon: '👶',
  },
  [ROLES.ADMISION]: {
    label: 'Admisión',
    description: 'Registro de pacientes y citas',
    color: 'yellow',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-700',
    borderColor: 'border-yellow-200',
    icon: '📋',
  },
  [ROLES.FARMACIA]: {
    label: 'Farmacia',
    description: 'Gestión de medicamentos',
    color: 'orange',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-200',
    icon: '💊',
  },
};

// ============================================================
// VERIFICAR SI UN ROL TIENE UN PERMISO
// ============================================================
export const hasPermission = (rol, permiso) => {
  if (!rol) return false;
  const permisos = PERMISSIONS[rol] || [];
  if (permisos.includes('*')) return true;
  return permisos.includes(permiso);
};

// ============================================================
// VERIFICAR SI UN ROL TIENE UNO DE LOS PERMISOS
// ============================================================
export const hasAnyPermission = (rol, permisos = []) => {
  if (!rol) return false;
  return permisos.some((p) => hasPermission(rol, p));
};

// ============================================================
// VERIFICAR SI UN ROL TIENE TODOS LOS PERMISOS
// ============================================================
export const hasAllPermissions = (rol, permisos = []) => {
  if (!rol) return false;
  return permisos.every((p) => hasPermission(rol, p));
};

// ============================================================
// HELPERS POR ROL
// ============================================================
export const isAdmin = (rol) => rol === ROLES.ADMIN;
export const isMedico = (rol) => rol === ROLES.MEDICO;
export const isEnfermera = (rol) => rol === ROLES.ENFERMERA;
export const isObstetra = (rol) => rol === ROLES.OBSTETRA;
export const isAdmision = (rol) => rol === ROLES.ADMISION;
export const isFarmacia = (rol) => rol === ROLES.FARMACIA;

// ============================================================
// OBTENER INFO DEL ROL
// ============================================================
export const getRoleInfo = (rol) => {
  return ROLE_INFO[rol] || {
    label: 'Desconocido',
    description: 'Sin rol asignado',
    color: 'gray',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-700',
    borderColor: 'border-gray-200',
    icon: '❓',
  };
};

// ============================================================
// OBTENER LABEL DEL ROL
// ============================================================
export const getRoleLabel = (rol) => {
  return ROLE_INFO[rol]?.label || 'Desconocido';
};

// ============================================================
// OBTENER COLOR DEL ROL
// ============================================================
export const getRoleColor = (rol) => {
  return ROLE_INFO[rol]?.color || 'gray';
};

export default {
  ROLE_INFO,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  isAdmin,
  isMedico,
  isEnfermera,
  isObstetra,
  isAdmision,
  isFarmacia,
  getRoleInfo,
  getRoleLabel,
  getRoleColor,
};