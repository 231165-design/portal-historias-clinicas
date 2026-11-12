// ============================================================
// SISTEMA DE PERMISOS
// Sistema HIS Postas - Versión 1
// ============================================================

import { PERMISSIONS, ROLES } from './constants';

/**
 * Verifica si un rol tiene un permiso específico
 */
export const hasPermission = (rol, permiso) => {
  if (!rol) return false;
  const permisos = PERMISSIONS[rol] || [];
  if (permisos.includes('*')) return true;
  return permisos.includes(permiso);
};

/**
 * Verifica si un rol tiene AL MENOS UNO de los permisos
 */
export const hasAnyPermission = (rol, permisos = []) => {
  return permisos.some((p) => hasPermission(rol, p));
};

/**
 * Verifica si un rol tiene TODOS los permisos
 */
export const hasAllPermissions = (rol, permisos = []) => {
  return permisos.every((p) => hasPermission(rol, p));
};

/**
 * Verifica si un usuario es admin
 */
export const isAdmin = (rol) => rol === ROLES.ADMIN;

/**
 * Verifica si un usuario es médico
 */
export const isMedico = (rol) => rol === ROLES.MEDICO;

/**
 * Verifica si un usuario puede editar pacientes
 */
export const canEditPacientes = (rol) => hasPermission(rol, 'pacientes:editar');

/**
 * Verifica si un usuario puede crear consultas
 */
export const canCreateConsultas = (rol) => hasPermission(rol, 'consultas:crear');

/**
 * Verifica si un usuario puede ver reportes
 */
export const canViewReportes = (rol) => hasPermission(rol, 'reportes:ver');

/**
 * Verifica si un usuario puede gestionar usuarios
 */
export const canManageUsers = (rol) => hasPermission(rol, 'usuarios:gestionar') || isAdmin(rol);

/**
 * Verifica si un usuario puede ver auditoría
 */
export const canViewAuditoria = (rol) => isAdmin(rol);

export default {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  isAdmin,
  isMedico,
  canEditPacientes,
  canCreateConsultas,
  canViewReportes,
  canManageUsers,
  canViewAuditoria,
};