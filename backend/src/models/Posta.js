// ============================================================
// MODELO: Posta
// ============================================================

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Posta = sequelize.define('Posta', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  codigo: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
  nombre: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  tipo: {
    type: DataTypes.ENUM('I-1', 'I-2', 'I-3', 'I-4'),
    defaultValue: 'I-3',
  },
  direccion: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  distrito: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  provincia: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  departamento: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: true,
  },
  director: {
    type: DataTypes.STRING(150),
    allowNull: true,
  },
  logo_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'postas',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default Posta;