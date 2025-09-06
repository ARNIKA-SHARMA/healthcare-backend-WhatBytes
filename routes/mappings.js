const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Mapping = require('../models/Mapping');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

// ROUTE 1: Assign doctor to patient (POST /api/mappings/)
router.post('/', fetchuser, async (req, res) => {
    try {
        const { patient_id, doctor_id } = req.body;

        const patient = await Patient.findByPk(patient_id);
        const doctor = await Doctor.findByPk(doctor_id);

        if (!patient || !doctor) return res.status(404).send("Patient or Doctor not found");
        if (patient.user_id !== req.user.id) return res.status(401).send("Not Allowed");

        const mapping = await Mapping.create({ patient_id, doctor_id });
        res.json(mapping);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE 2: Get all mappings (GET /api/mappings/)
router.get('/', async (req, res) => {
    try {
        const mappings = await Mapping.findAll({ include: [Patient, Doctor] });
        res.json(mappings);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE 3: Get doctors for a patient (GET /api/mappings/:patient_id)
router.get('/:patient_id', fetchuser, async (req, res) => {
    try {
        const mappings = await Mapping.findAll({
            where: { patient_id: req.params.patient_id },
            include: [Doctor]
        });
        res.json(mappings);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE 4: Delete mapping (DELETE /api/mappings/:id)
router.delete('/:id', fetchuser, async (req, res) => {
    try {
        const mapping = await Mapping.findByPk(req.params.id);

        if (!mapping) return res.status(404).send("Mapping not found");

        const patient = await Patient.findByPk(mapping.patient_id);
        if (patient.user_id !== req.user.id) return res.status(401).send("Not Allowed");

        await mapping.destroy();
        res.json({ success: "Mapping deleted" });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
