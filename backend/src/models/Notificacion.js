// ============================================================
// MODELO: Notificacion
// ============================================================

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Notificacion = sequelize.define('Notificacion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  titulo: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  mensaje: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  tipo: {
    type: DataTypes.ENUM('Info', 'Alerta', 'Urgente', 'Exito'),
    defaultValue: 'Info',
  },
  leida: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  url: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
}, {
  tableName: 'notificaciones',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

export default Notificacion;