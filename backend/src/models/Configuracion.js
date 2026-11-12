// ============================================================
// MODELO: Configuracion
// ============================================================

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Configuracion = sequelize.define('Configuracion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  clave: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  valor: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  descripcion: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
}, {
  tableName: 'configuracion',
  timestamps: true,
  createdAt: false,
  updatedAt: 'updated_at',
});

export default Configuracion;