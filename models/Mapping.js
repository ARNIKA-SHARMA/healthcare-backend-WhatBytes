const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const Patient = require('./Patient');
const Doctor = require('./Doctor');

const Mapping = sequelize.define('Mapping', {}, {
  tableName: 'patient_doctor_mappings',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

// Relations
Mapping.belongsTo(Patient, { foreignKey: 'patient_id' });
Mapping.belongsTo(Doctor, { foreignKey: 'doctor_id' });

Patient.hasMany(Mapping, { foreignKey: 'patient_id' });
Doctor.hasMany(Mapping, { foreignKey: 'doctor_id' });

module.exports = Mapping;
