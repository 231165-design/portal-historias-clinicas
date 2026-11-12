// ============================================================
// MODELO: Sesion
// ============================================================

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Sesion = sequelize.define('Sesion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  token: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  refresh_token: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  ip: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  user_agent: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  expira_en: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  activa: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'sesiones',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

export default Sesion;