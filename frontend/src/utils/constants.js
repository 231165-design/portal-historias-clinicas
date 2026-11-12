// ============================================================
// CONSTANTES DEL FRONTEND
// Sistema HIS Postas - Versión 1
// ============================================================

// ============================================================
// ROLES
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

export const ROLES_LABELS = {
  admin: 'Administrador',
  medico: 'Médico',
  enfermera: 'Enfermera',
  obstetra: 'Obstetra',
  admision: 'Admisión',
  farmacia: 'Farmacia',
};

export const ROLES_COLORS = {
  admin: 'purple',
  medico: 'blue',
  enfermera: 'green',
  obstetra: 'pink',
  admision: 'yellow',
  farmacia: 'orange',
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

// ============================================================
// TIPOS (Arrays simples para los selects)
// ============================================================
export const TIPOS_SEGURO = ['SIS', 'ESSALUD', 'Privado', 'Ninguno'];
export const TIPOS_SEGURO_LIST = TIPOS_SEGURO;

export const TIPOS_ATENCION = [
  'Consulta',
  'Emergencia',
  'Control',
  'Seguimiento',
  'Visita Domiciliaria',
];

export const TIPOS_ANTECEDENTE = [
  'Personal',
  'Familiar',
  'Quirúrgico',
  'Alérgico',
  'Ginecológico',
  'Otro',
];

export const TIPOS_ARCHIVO = ['Laboratorio', 'Rayos X', 'Ecografía', 'Receta', 'Otro'];

export const GRUPOS_SANGUINEOS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const ESTADOS_CIVILES = ['Soltero', 'Casado', 'Viudo', 'Divorciado', 'Conviviente'];

// ============================================================
// TIPOS DE VACUNA
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
  'Antiamarílica (Fiebre Amarilla)',
];

// ============================================================
// COLORES PARA GRÁFICOS
// ============================================================
export const CHART_COLORS = [
  '#8b5cf6',
  '#10b981',
  '#f59e0b',
  '#ec4899',
  '#3b82f6',
  '#06b6d4',
  '#84cc16',
  '#ef4444',
];

// ============================================================
// MENÚS POR ROL
// ============================================================
export const MENU_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: 'dashboard', roles: ['admin', 'medico', 'enfermera', 'obstetra', 'admision', 'farmacia'] },
  { label: 'Pacientes', path: '/pacientes', icon: 'users', roles: ['admin', 'medico', 'enfermera', 'obstetra', 'admision'] },
  { label: 'Consultas', path: '/consultas', icon: 'stethoscope', roles: ['admin', 'medico'] },
  { label: 'Historia Clínica', path: '/historia', icon: 'file-medical', roles: ['admin', 'medico', 'enfermera', 'obstetra'] },
  { label: 'Citas', path: '/citas', icon: 'calendar', roles: ['admin', 'medico', 'enfermera', 'admision'] },
  { label: 'Farmacia', path: '/farmacia', icon: 'pills', roles: ['admin', 'farmacia'] },
  { label: 'Vacunas', path: '/vacunas', icon: 'syringe', roles: ['admin', 'enfermera'] },
  { label: 'Reportes', path: '/reportes', icon: 'chart', roles: ['admin', 'medico', 'obstetra'] },
  { label: 'Usuarios', path: '/usuarios', icon: 'user-cog', roles: ['admin'] },
  { label: 'Auditoría', path: '/auditoria', icon: 'shield', roles: ['admin'] },
  { label: 'Configuración', path: '/configuracion', icon: 'settings', roles: ['admin'] },
];

// ============================================================
// CÓDIGOS HTTP
// ============================================================
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// ============================================================
// PAGINACIÓN
// ============================================================
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  LIMIT_OPTIONS: [10, 25, 50, 100],
};

// ============================================================
// STORAGE KEYS
// ============================================================
export const STORAGE_KEYS = {
  TOKEN: 'his_token',
  USER: 'his_user',
  THEME: 'his_theme',
  SIDEBAR_COLLAPSED: 'his_sidebar_collapsed',
  SETTINGS: 'his_settings',
};

// ============================================================
// FORMATOS DE FECHA
// ============================================================
export const DATE_FORMATS = {
  SHORT: 'dd/MM/yyyy',
  LONG: "dd 'de' MMMM 'de' yyyy",
  DATETIME: 'dd/MM/yyyy HH:mm',
  TIME: 'HH:mm',
  ISO: "yyyy-MM-dd'T'HH:mm:ss",
};

// ============================================================
// MENSAJES
// ============================================================
export const MESSAGES = {
  LOGIN_SUCCESS: '¡Bienvenido al sistema!',
  LOGIN_ERROR: 'DNI o contraseña incorrectos',
  LOGOUT_SUCCESS: 'Sesión cerrada correctamente',
  SESSION_EXPIRED: 'Tu sesión ha expirado',
  CREATE_SUCCESS: 'Registro creado exitosamente',
  UPDATE_SUCCESS: 'Registro actualizado exitosamente',
  DELETE_SUCCESS: 'Registro eliminado exitosamente',
  DELETE_CONFIRM: '¿Estás seguro de eliminar este registro?',
  NOT_FOUND: 'Registro no encontrado',
  REQUIRED_FIELD: 'Este campo es obligatorio',
  INVALID_EMAIL: 'Ingrese un correo válido',
  INVALID_DNI: 'El DNI debe tener 8 dígitos',
  INVALID_PHONE: 'Ingrese un teléfono válido',
  SERVER_ERROR: 'Error del servidor',
  NETWORK_ERROR: 'Sin conexión',
};

// ============================================================
// PERMISOS POR ROL
// ============================================================
export const PERMISSIONS = {
  admin: ['*'],
  medico: [
    'pacientes:ver', 'pacientes:crear', 'pacientes:editar',
    'consultas:ver', 'consultas:crear', 'consultas:editar',
    'recetas:crear', 'historia:ver',
    'reportes:ver',
  ],
  enfermera: [
    'pacientes:ver', 'pacientes:crear',
    'signos_vitales:crear', 'vacunas:crear',
    'citas:ver', 'citas:crear',
  ],
  obstetra: [
    'pacientes:ver',
    'control_prenatal:crear', 'control_nino:crear',
    'reportes:ver',
  ],
  admision: [
    'pacientes:ver', 'pacientes:crear', 'pacientes:editar',
    'citas:ver', 'citas:crear',
  ],
  farmacia: [
    'medicamentos:ver', 'medicamentos:editar',
    'recetas:ver', 'inventario:editar',
  ],
};

// ============================================================
// CONFIGURACIÓN GENERAL
// ============================================================
export const CONFIG = {
  APP_NAME: 'HIS Postas',
  APP_FULL_NAME: 'Sistema de Historias Clínicas',
  APP_VERSION: '1.0.0',
  APP_DESCRIPTION: 'Sistema de Historias Clínicas para Postas de Salud',
  INSTITUTION: 'Ministerio de Salud',
  COUNTRY: 'Perú',
  CURRENCY: 'S/',
  LOCALE: 'es-PE',
  TIMEZONE: 'America/Lima',
};