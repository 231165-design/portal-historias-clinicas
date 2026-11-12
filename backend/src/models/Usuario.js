// ============================================================
// MODELO: Usuario
// ============================================================

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import bcrypt from 'bcrypt';

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  posta_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  dni: {
    type: DataTypes.STRING(8),
    allowNull: false,
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
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  rol_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  colegiatura: {
    type: DataTypes.STRING(30),
    allowNull: true,
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  foto_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  firma_digital_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  intentos_fallidos: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  bloqueado_hasta: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  ultimo_acceso: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'usuarios',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  hooks: {
    beforeCreate: async (usuario) => {
      if (usuario.password_hash) {
        usuario.password_hash = await bcrypt.hash(usuario.password_hash, 10);
      }
    },
    beforeUpdate: async (usuario) => {
      if (usuario.changed('password_hash')) {
        usuario.password_hash = await bcrypt.hash(usuario.password_hash, 10);
      }
    },
  },
});

// Método para comparar contraseña
Usuario.prototype.validarPassword = async function (password) {
  return bcrypt.compare(password, this.password_hash);
};

// Método para retornar datos públicos (sin password)
Usuario.prototype.toPublicJSON = function () {
  const { password_hash, ...rest } = this.toJSON();
  return rest;
};

export default Usuario;