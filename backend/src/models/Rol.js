// ============================================================
// MODELO: Rol
// ============================================================

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Rol = sequelize.define('Rol', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  descripcion: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  permisos: {
    type: DataTypes.JSON,
    allowNull: true,
  },
}, {
  tableName: 'roles',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

export default Rol;