// ============================================================
// MODELO: Vacuna
// ============================================================

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Vacuna = sequelize.define('Vacuna', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  paciente_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tipo_vacuna: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  dosis: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  lote: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  laboratorio: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  fecha_aplicacion: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  aplicado_por: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  lugar_aplicacion: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'vacunas',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

export default Vacuna;