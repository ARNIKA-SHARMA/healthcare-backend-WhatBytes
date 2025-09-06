const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Doctor = sequelize.define('Doctor', {
  name: { type: DataTypes.STRING, allowNull: false },
  specialization: { type: DataTypes.STRING, allowNull: false }
}, {
  tableName: 'doctors',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Doctor;

