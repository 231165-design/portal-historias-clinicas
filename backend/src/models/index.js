// ============================================================
// ÍNDICE DE MODELOS
// ============================================================

import { Sequelize } from 'sequelize';
import sequelize from '../config/database.js';

// Importar modelos
import Rol from './Rol.js';
import Posta from './Posta.js';
import Usuario from './Usuario.js';
import Paciente from './Paciente.js';
import Consulta from './Consulta.js';
import Cita from './Cita.js';
import Vacuna from './Vacuna.js';
import Auditoria from './Auditoria.js';
import Sesion from './Sesion.js';
import Notificacion from './Notificacion.js';
import Configuracion from './Configuracion.js';

// ============================================================
// RELACIONES
// ============================================================

// Posta ↔ Usuario
Posta.hasMany(Usuario, { foreignKey: 'posta_id', as: 'usuarios' });
Usuario.belongsTo(Posta, { foreignKey: 'posta_id', as: 'posta' });

// Rol ↔ Usuario
Rol.hasMany(Usuario, { foreignKey: 'rol_id', as: 'usuarios' });
Usuario.belongsTo(Rol, { foreignKey: 'rol_id', as: 'rol' });

// Posta ↔ Paciente
Posta.hasMany(Paciente, { foreignKey: 'posta_id', as: 'pacientes' });
Paciente.belongsTo(Posta, { foreignKey: 'posta_id', as: 'posta' });

// Usuario (creador) ↔ Paciente
Usuario.hasMany(Paciente, { foreignKey: 'created_by', as: 'pacientesCreados' });
Paciente.belongsTo(Usuario, { foreignKey: 'created_by', as: 'creador' });

// Paciente ↔ Consulta
Paciente.hasMany(Consulta, { foreignKey: 'paciente_id', as: 'consultas' });
Consulta.belongsTo(Paciente, { foreignKey: 'paciente_id', as: 'paciente' });

// Usuario (médico) ↔ Consulta
Usuario.hasMany(Consulta, { foreignKey: 'medico_id', as: 'consultasRealizadas' });
Consulta.belongsTo(Usuario, { foreignKey: 'medico_id', as: 'medico' });

// Posta ↔ Consulta
Posta.hasMany(Consulta, { foreignKey: 'posta_id', as: 'consultas' });
Consulta.belongsTo(Posta, { foreignKey: 'posta_id', as: 'posta' });

// ============================================================
// RELACIONES DE CITAS
// ============================================================

// Paciente ↔ Cita
Paciente.hasMany(Cita, { foreignKey: 'paciente_id', as: 'citas' });
Cita.belongsTo(Paciente, { foreignKey: 'paciente_id', as: 'paciente' });

// Usuario (médico) ↔ Cita
Usuario.hasMany(Cita, { foreignKey: 'medico_id', as: 'citasAsignadas' });
Cita.belongsTo(Usuario, { foreignKey: 'medico_id', as: 'medico' });

// Posta ↔ Cita
Posta.hasMany(Cita, { foreignKey: 'posta_id', as: 'citas' });
Cita.belongsTo(Posta, { foreignKey: 'posta_id', as: 'posta' });

// Usuario (creador) ↔ Cita
Usuario.hasMany(Cita, { foreignKey: 'created_by', as: 'citasCreadas' });
Cita.belongsTo(Usuario, { foreignKey: 'created_by', as: 'creador' });

// ============================================================
// RELACIONES DE VACUNAS
// ============================================================

// Paciente ↔ Vacuna
Paciente.hasMany(Vacuna, { foreignKey: 'paciente_id', as: 'vacunas' });
Vacuna.belongsTo(Paciente, { foreignKey: 'paciente_id', as: 'paciente' });

// Usuario (aplicador) ↔ Vacuna
Usuario.hasMany(Vacuna, { foreignKey: 'aplicado_por', as: 'vacunasAplicadas' });
Vacuna.belongsTo(Usuario, { foreignKey: 'aplicado_por', as: 'aplicador' });

// ============================================================
// RELACIONES DE AUDITORÍA Y SESIONES
// ============================================================

// Usuario ↔ Auditoria
Usuario.hasMany(Auditoria, { foreignKey: 'usuario_id', as: 'auditorias' });
Auditoria.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

// Usuario ↔ Sesion
Usuario.hasMany(Sesion, { foreignKey: 'usuario_id', as: 'sesiones' });
Sesion.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

// Usuario ↔ Notificacion
Usuario.hasMany(Notificacion, { foreignKey: 'usuario_id', as: 'notificaciones' });
Notificacion.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

// ============================================================
// EXPORTAR
// ============================================================
const db = {
  Sequelize,
  sequelize,
  Rol,
  Posta,
  Usuario,
  Paciente,
  Consulta,
  Cita,
  Vacuna,
  Auditoria,
  Sesion,
  Notificacion,
  Configuracion,
};

export {
  Sequelize,
  sequelize,
  Rol,
  Posta,
  Usuario,
  Paciente,
  Consulta,
  Cita,
  Vacuna,
  Auditoria,
  Sesion,
  Notificacion,
  Configuracion,
};

export default db;