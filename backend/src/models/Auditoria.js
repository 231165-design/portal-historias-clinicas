// ============================================================
// MODELO: Auditoria
// ============================================================

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Auditoria = sequelize.define('Auditoria', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  accion: {
    type: DataTypes.ENUM('LOGIN', 'LOGOUT', 'CREAR', 'EDITAR', 'ELIMINAR', 'CONSULTAR', 'EXPORTAR', 'IMPRIMIR'),
    allowNull: false,
  },
  modulo: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  tabla: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  registro_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  datos_anteriores: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  datos_nuevos: {
    type: DataTypes.JSON,
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
}, {
  tableName: 'auditoria',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

export default Auditoria;