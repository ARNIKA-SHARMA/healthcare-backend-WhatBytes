const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false }
}, {
  tableName: 'users',
  timestamps: true, // uses createdAt, updatedAt
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = User;
