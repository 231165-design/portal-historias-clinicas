// ============================================================
// MODELO: Consulta
// ============================================================

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Consulta = sequelize.define('Consulta', {
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
  numero_consulta: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  fecha_hora: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  tipo_atencion: {
    type: DataTypes.ENUM('Consulta', 'Emergencia', 'Control', 'Seguimiento', 'Visita Domiciliaria'),
    defaultValue: 'Consulta',
  },
  motivo_consulta: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  tiempo_enfermedad: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  enfermedad_actual: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  examen_fisico: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  diagnostico_principal: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  cie10_principal: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  diagnosticos_secundarios: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  tratamiento: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  indicaciones: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  requiere_referencia: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  referencia_destino: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  proxima_cita: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  firma_digital: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  estado: {
    type: DataTypes.ENUM('En curso', 'Completada', 'Anulada'),
    defaultValue: 'Completada',
  },
}, {
  tableName: 'consultas',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default Consulta;