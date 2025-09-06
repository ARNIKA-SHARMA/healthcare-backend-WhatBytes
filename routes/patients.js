const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');
const Patient = require('../models/Patient');

// ROUTE 1: Add a new patient (POST /api/patients/)
router.post('/', fetchuser, [
    body('name', 'Name must be at least 3 chars').isLength({ min: 3 }),
    body('age', 'Age must be a number').isInt(),
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { name, age, gender } = req.body;
        const patient = await Patient.create({
            name, age, gender, user_id: req.user.id
        });
        res.json(patient);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE 2: Get all patients of logged-in user (GET /api/patients/)
router.get('/', fetchuser, async (req, res) => {
    try {
        const patients = await Patient.findAll({ where: { user_id: req.user.id } });
        res.json(patients);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE 3: Get patient by id (GET /api/patients/:id)
router.get('/:id', fetchuser, async (req, res) => {
    try {
        const patient = await Patient.findByPk(req.params.id);
        if (!patient) return res.status(404).send("Patient not found");
        res.json(patient);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE 4: Update patient (PUT /api/patients/:id)
router.put('/:id', fetchuser, async (req, res) => {
    try {
        const { name, age, gender } = req.body;
        const patient = await Patient.findByPk(req.params.id);

        if (!patient) return res.status(404).send("Patient not found");
        if (patient.user_id !== req.user.id) return res.status(401).send("Not Allowed");

        await patient.update({ name, age, gender });
        res.json(patient);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE 5: Delete patient (DELETE /api/patients/:id)
router.delete('/:id', fetchuser, async (req, res) => {
    try {
        const patient = await Patient.findByPk(req.params.id);

        if (!patient) return res.status(404).send("Patient not found");
        if (patient.user_id !== req.user.id) return res.status(401).send("Not Allowed");

        await patient.destroy();
        res.json({ success: "Patient deleted" });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;

