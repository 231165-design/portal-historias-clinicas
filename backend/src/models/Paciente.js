// ============================================================
// MODELO: Paciente
// ============================================================

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Paciente = sequelize.define('Paciente', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  posta_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  historia_clinica: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
  dni: {
    type: DataTypes.STRING(8),
    allowNull: true,
    unique: true,
  },
  nombres: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  apellidos: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  fecha_nacimiento: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  sexo: {
    type: DataTypes.ENUM('M', 'F'),
    allowNull: false,
  },
  estado_civil: {
    type: DataTypes.ENUM('Soltero', 'Casado', 'Viudo', 'Divorciado', 'Conviviente'),
    defaultValue: 'Soltero',
  },
  grado_instruccion: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  ocupacion: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  direccion: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  distrito: {
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
  grupo_sanguineo: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  factor_rh: {
    type: DataTypes.STRING(5),
    allowNull: true,
  },
  alergias: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  discapacidad: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  tipo_seguro: {
    type: DataTypes.ENUM('SIS', 'ESSALUD', 'Privado', 'Ninguno'),
    defaultValue: 'Ninguno',
  },
  numero_seguro: {
    type: DataTypes.STRING(30),
    allowNull: true,
  },
  contacto_emergencia: {
    type: DataTypes.STRING(150),
    allowNull: true,
  },
  telefono_emergencia: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  foto_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'pacientes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default Paciente;