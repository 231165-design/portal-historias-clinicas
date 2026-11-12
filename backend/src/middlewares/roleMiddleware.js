// ============================================================
// MIDDLEWARE: Autorización por Roles y Permisos
// ============================================================

import { HTTP_STATUS, MESSAGES, PERMISSIONS } from '../config/constants.js';

// ============================================================
// VERIFICAR ROLES ESPECÍFICOS
// ============================================================
export const authorize = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: MESSAGES.TOKEN_REQUIRED,
      });
    }

    const userRole = req.userRole;

    if (!rolesPermitidos.includes(userRole)) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: MESSAGES.NO_PERMISSIONS,
        required_roles: rolesPermitidos,
        your_role: userRole,
      });
    }

    next();
  };
};

// ============================================================
// VERIFICAR PERMISO ESPECÍFICO
// ============================================================
export const authorizePermission = (...permisosRequeridos) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: MESSAGES.TOKEN_REQUIRED,
      });
    }

    const userRole = req.userRole;
    const userPermisos = PERMISSIONS[userRole] || [];

    // Admin tiene todos los permisos
    if (userPermisos.includes('*')) {
      return next();
    }

    // Verificar si tiene AL MENOS UNO de los permisos requeridos
    const tienePermiso = permisosRequeridos.some((p) => userPermisos.includes(p));

    if (!tienePermiso) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: MESSAGES.NO_PERMISSIONS,
        required_permissions: permisosRequeridos,
      });
    }

    next();
  };
};

// ============================================================
// HELPER: Verificar si el usuario es admin
// ============================================================
export const isAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(HTTP_STATUS.FORBIDDEN).json({
      success: false,
      message: 'Solo administradores pueden realizar esta acción',
    });
  }
  next();
};

// ============================================================
// HELPER: Verificar si es el dueño del recurso
// ============================================================
export const isOwnerOrAdmin = (getResourceUserId) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: MESSAGES.TOKEN_REQUIRED,
      });
    }

    if (req.userRole === 'admin') {
      return next();
    }

    try {
      const resourceUserId = await getResourceUserId(req);
      if (resourceUserId !== req.userId) {
        return res.status(HTTP_STATUS.FORBIDDEN).json({
          success: false,
          message: 'No tienes acceso a este recurso',
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default { authorize, authorizePermission, isAdmin, isOwnerOrAdmin };