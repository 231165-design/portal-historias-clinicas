// ============================================================
// CONSTANTES DEL SISTEMA
// Sistema de Historias Clínicas - Postas de Salud
// ============================================================

// ============================================================
// ROLES DEL SISTEMA
// ============================================================
export const ROLES = {
  ADMIN: 'admin',
  MEDICO: 'medico',
  ENFERMERA: 'enfermera',
  OBSTETRA: 'obstetra',
  ADMISION: 'admision',
  FARMACIA: 'farmacia',
};

export const ROLES_LIST = Object.values(ROLES);

// ============================================================
// PERMISOS POR ROL
// ============================================================
export const PERMISSIONS = {
  [ROLES.ADMIN]: ['*'],
  [ROLES.MEDICO]: [
    'pacientes:ver', 'pacientes:crear', 'pacientes:editar',
    'consultas:ver', 'consultas:crear', 'consultas:editar',
    'recetas:ver', 'recetas:crear',
    'historia:ver', 'historia:crear',
    'reportes:ver',
  ],
  [ROLES.ENFERMERA]: [
    'pacientes:ver', 'pacientes:crear',
    'signos_vitales:crear', 'signos_vitales:ver',
    'vacunas:crear', 'vacunas:ver',
    'citas:ver', 'citas:crear',
  ],
  [ROLES.OBSTETRA]: [
    'pacientes:ver',
    'control_prenatal:ver', 'control_prenatal:crear',
    'control_nino:ver', 'control_nino:crear',
    'reportes:ver',
  ],
  [ROLES.ADMISION]: [
    'pacientes:ver', 'pacientes:crear', 'pacientes:editar',
    'citas:ver', 'citas:crear', 'citas:editar',
  ],
  [ROLES.FARMACIA]: [
    'medicamentos:ver', 'medicamentos:crear', 'medicamentos:editar',
    'recetas:ver', 'recetas:dispensar',
    'inventario:ver', 'inventario:editar',
  ],
};

// ============================================================
// ESTADOS
// ============================================================
export const ESTADOS_CONSULTA = {
  EN_CURSO: 'En curso',
  COMPLETADA: 'Completada',
  ANULADA: 'Anulada',
};

export const ESTADOS_CITA = {
  PROGRAMADA: 'Programada',
  CONFIRMADA: 'Confirmada',
  ATENDIDA: 'Atendida',
  CANCELADA: 'Cancelada',
  NO_ASISTIO: 'No asistió',
};

export const ESTADOS_RECETA = {
  EMITIDA: 'Emitida',
  DISPENSADA: 'Dispensada',
  ANULADA: 'Anulada',
};

export const TIPOS_SEGURO = {
  SIS: 'SIS',
  ESSALUD: 'ESSALUD',
  PRIVADO: 'Privado',
  NINGUNO: 'Ninguno',
};

export const TIPOS_SEGURO_LIST = Object.values(TIPOS_SEGURO);

// ============================================================
// SEXO
// ============================================================
export const SEXO = {
  MASCULINO: 'M',
  FEMENINO: 'F',
};

// ============================================================
// GRUPOS SANGUÍNEOS
// ============================================================
export const GRUPOS_SANGUINEOS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// ============================================================
// TIPOS DE ANTECEDENTES
// ============================================================
export const TIPOS_ANTECEDENTE = {
  PERSONAL: 'Personal',
  FAMILIAR: 'Familiar',
  QUIRURGICO: 'Quirurgico',
  ALERGICO: 'Alergico',
  GINECOLOGICO: 'Ginecologico',
  OTRO: 'Otro',
};

// ============================================================
// TIPOS DE ARCHIVO
// ============================================================
export const TIPOS_ARCHIVO = {
  LABORATORIO: 'Laboratorio',
  RAYOS_X: 'Rayos X',
  ECOGRAFIA: 'Ecografía',
  RECETA: 'Receta',
  OTRO: 'Otro',
};

// ============================================================
// TIPOS DE ATENCIÓN
// ============================================================
export const TIPOS_ATENCION = {
  CONSULTA: 'Consulta',
  EMERGENCIA: 'Emergencia',
  CONTROL: 'Control',
  SEGUIMIENTO: 'Seguimiento',
  VISITA_DOMICILIARIA: 'Visita Domiciliaria',
};

// ============================================================
// TIPOS DE VACUNA (Calendario MINSA Perú)
// ============================================================
export const TIPOS_VACUNA = [
  'BCG',
  'Hepatitis B',
  'Pentavalente',
  'Antipoliomielítica (IPV)',
  'Antipoliomielítica (APO)',
  'Rotavirus',
  'Neumococo',
  'Influenza',
  'SPR (Sarampión, Paperas, Rubéola)',
  'Varicela',
  'VPH',
  'DPT',
  'Toxoide',
  'Antiamarílica (Fiebre Amarilla)',
];

// ============================================================
// ACCIONES DE AUDITORÍA
// ============================================================
export const ACCIONES_AUDIT = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  CREAR: 'CREAR',
  EDITAR: 'EDITAR',
  ELIMINAR: 'ELIMINAR',
  CONSULTAR: 'CONSULTAR',
  EXPORTAR: 'EXPORTAR',
  IMPRIMIR: 'IMPRIMIR',
};

// ============================================================
// MÓDULOS DEL SISTEMA
// ============================================================
export const MODULOS = {
  AUTH: 'AUTH',
  USUARIOS: 'USUARIOS',
  PACIENTES: 'PACIENTES',
  CONSULTAS: 'CONSULTAS',
  HISTORIA: 'HISTORIA',
  FARMACIA: 'FARMACIA',
  VACUNAS: 'VACUNAS',
  CITAS: 'CITAS',
  REPORTES: 'REPORTES',
  CONFIGURACION: 'CONFIGURACION',
};

// ============================================================
// CÓDIGOS HTTP
// ============================================================
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// ============================================================
// MENSAJES DEL SISTEMA
// ============================================================
export const MESSAGES = {
  // Auth
  LOGIN_SUCCESS: 'Inicio de sesión exitoso',
  LOGIN_FAILED: 'Credenciales inválidas',
  LOGOUT_SUCCESS: 'Sesión cerrada correctamente',
  TOKEN_INVALID: 'Token inválido o expirado',
  TOKEN_REQUIRED: 'Token de autenticación requerido',
  USER_BLOCKED: 'Usuario bloqueado temporalmente por intentos fallidos',
  USER_INACTIVE: 'Usuario inactivo. Contacte al administrador',
  PASSWORD_CHANGED: 'Contraseña actualizada correctamente',

  // Autorización
  NO_PERMISSIONS: 'No tiene permisos para realizar esta acción',
  ROLE_REQUIRED: 'Se requiere un rol específico para esta acción',

  // CRUD
  CREATED_SUCCESS: 'Registro creado exitosamente',
  UPDATED_SUCCESS: 'Registro actualizado exitosamente',
  DELETED_SUCCESS: 'Registro eliminado exitosamente',
  NOT_FOUND: 'Registro no encontrado',
  DUPLICATE: 'El registro ya existe',
  VALIDATION_ERROR: 'Error de validación en los datos enviados',

  // Servidor
  INTERNAL_ERROR: 'Error interno del servidor. Contacte al administrador',
  DATABASE_ERROR: 'Error en la base de datos',

  // Archivos
  FILE_UPLOADED: 'Archivo subido correctamente',
  FILE_TOO_LARGE: 'El archivo excede el tamaño máximo permitido',
  FILE_TYPE_INVALID: 'Tipo de archivo no permitido',
  FILE_NOT_FOUND: 'Archivo no encontrado',
};

// ============================================================
// REGEX DE VALIDACIÓN
// ============================================================
export const REGEX = {
  DNI: /^\d{8}$/,
  TELEFONO: /^[0-9+\-\s()]{6,20}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
  CODIGO_HC: /^\d{4}-\d{5}$/,
  CODIGO_CIE10: /^[A-Z]\d{2}(\.\d{1,2})?$/,
};

// ============================================================
// PAGINACIÓN
// ============================================================
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

// ============================================================
// EXPORT DEFAULT
// ============================================================
export default {
  ROLES,
  ROLES_LIST,
  PERMISSIONS,
  ESTADOS_CONSULTA,
  ESTADOS_CITA,
  ESTADOS_RECETA,
  TIPOS_SEGURO,
  TIPOS_SEGURO_LIST,
  SEXO,
  GRUPOS_SANGUINEOS,
  TIPOS_ANTECEDENTE,
  TIPOS_ARCHIVO,
  TIPOS_ATENCION,
  TIPOS_VACUNA,
  ACCIONES_AUDIT,
  MODULOS,
  HTTP_STATUS,
  MESSAGES,
  REGEX,
  PAGINATION,
};