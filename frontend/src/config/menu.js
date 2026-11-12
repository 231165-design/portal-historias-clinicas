// ============================================================
// CONFIGURACIÓN DEL MENÚ LATERAL
// Sistema de Historias Clínicas - Postas de Salud
// ============================================================

import { ROLES } from '../utils/constants';

// ============================================================
// ICONOS SVG (inline para no depender de librerías)
// ============================================================
const ICONS = {
  dashboard: '📊',
  users: '👥',
  stethoscope: '🩺',
  fileMedical: '📋',
  calendar: '📅',
  pills: '💊',
  syringe: '💉',
  chart: '📈',
  userCog: '⚙️',
  shield: '🛡️',
  settings: '🔧',
};

// ============================================================
// ESTRUCTURA DEL MENÚ
// ============================================================
export const MENU_ITEMS = [
  // --- Principal ---
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: ICONS.dashboard,
    roles: [
      ROLES.ADMIN,
      ROLES.MEDICO,
      ROLES.ENFERMERA,
      ROLES.OBSTETRA,
      ROLES.ADMISION,
      ROLES.FARMACIA,
    ],
  },

  // --- Gestión Clínica ---
  {
    id: 'pacientes',
    label: 'Pacientes',
    path: '/pacientes',
    icon: ICONS.users,
    roles: [ROLES.ADMIN, ROLES.MEDICO, ROLES.ENFERMERA, ROLES.OBSTETRA, ROLES.ADMISION],
  },
  {
    id: 'consultas',
    label: 'Consultas',
    path: '/consultas',
    icon: ICONS.stethoscope,
    roles: [ROLES.ADMIN, ROLES.MEDICO],
  },
  {
    id: 'historia',
    label: 'Historia Clínica',
    path: '/historia',
    icon: ICONS.fileMedical,
    roles: [ROLES.ADMIN, ROLES.MEDICO, ROLES.ENFERMERA, ROLES.OBSTETRA],
  },
  {
    id: 'citas',
    label: 'Citas',
    path: '/citas',
    icon: ICONS.calendar,
    roles: [ROLES.ADMIN, ROLES.MEDICO, ROLES.ENFERMERA, ROLES.ADMISION],
  },

  // --- Farmacia ---
  {
    id: 'farmacia',
    label: 'Farmacia',
    path: '/farmacia',
    icon: ICONS.pills,
    roles: [ROLES.ADMIN, ROLES.FARMACIA],
  },
  {
    id: 'vacunas',
    label: 'Vacunas',
    path: '/vacunas',
    icon: ICONS.syringe,
    roles: [ROLES.ADMIN, ROLES.ENFERMERA],
  },

  // --- Reportes ---
  {
    id: 'reportes',
    label: 'Reportes',
    path: '/reportes',
    icon: ICONS.chart,
    roles: [ROLES.ADMIN, ROLES.MEDICO, ROLES.OBSTETRA],
  },

  // --- Administración (solo admin) ---
  {
    id: 'usuarios',
    label: 'Usuarios',
    path: '/usuarios',
    icon: ICONS.userCog,
    roles: [ROLES.ADMIN],
  },
  {
    id: 'auditoria',
    label: 'Auditoría',
    path: '/auditoria',
    icon: ICONS.shield,
    roles: [ROLES.ADMIN],
  },
  {
    id: 'configuracion',
    label: 'Configuración',
    path: '/configuracion',
    icon: ICONS.settings,
    roles: [ROLES.ADMIN],
  },
];

// ============================================================
// FILTRAR MENÚ POR ROL
// ============================================================
export const getMenuByRole = (rol) => {
  if (!rol) return [];
  return MENU_ITEMS.filter((item) => item.roles.includes(rol));
};

// ============================================================
// OBTENER TÍTULO DE PÁGINA
// ============================================================
export const getPageTitle = (pathname) => {
  const item = MENU_ITEMS.find((m) => pathname.startsWith(m.path));
  return item ? item.label : 'Sistema HIS Postas';
};

export default {
  MENU_ITEMS,
  getMenuByRole,
  getPageTitle,
};