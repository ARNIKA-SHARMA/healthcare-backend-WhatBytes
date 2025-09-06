const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const User = require('./User');

const Patient = sequelize.define('Patient', {
  name: { type: DataTypes.STRING, allowNull: false },
  age: { type: DataTypes.INTEGER, allowNull: false },
  gender: { type: DataTypes.STRING }
}, {
  tableName: 'patients',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

Patient.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Patient, { foreignKey: 'user_id' });

module.exports = Patient;
