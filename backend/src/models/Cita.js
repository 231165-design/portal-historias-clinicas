// ============================================================
// MODELO: Cita
// ============================================================

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Cita = sequelize.define('Cita', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  paciente_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  medico_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  posta_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fecha_hora: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  motivo: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  tipo: {
    type: DataTypes.ENUM('Consulta', 'Control', 'Vacunación', 'Laboratorio', 'Otro'),
    defaultValue: 'Consulta',
  },
  estado: {
    type: DataTypes.ENUM('Programada', 'Confirmada', 'Atendida', 'Cancelada', 'No asistió'),
    defaultValue: 'Programada',
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'citas',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

export default Cita;