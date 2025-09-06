const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');
const Doctor = require('../models/Doctor');

// ROUTE 1: Add a new doctor (POST /api/doctors/)
router.post('/', fetchuser, [
    body('name', 'Name is required').isLength({ min: 3 }),
    body('specialization', 'Specialization is required').notEmpty(),
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { name, specialization } = req.body;
        const doctor = await Doctor.create({ name, specialization });
        res.json(doctor);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE 2: Get all doctors (GET /api/doctors/)
router.get('/', async (req, res) => {
    try {
        const doctors = await Doctor.findAll();
        res.json(doctors);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE 3: Get doctor by id (GET /api/doctors/:id)
router.get('/:id', async (req, res) => {
    try {
        const doctor = await Doctor.findByPk(req.params.id);
        if (!doctor) return res.status(404).send("Doctor not found");
        res.json(doctor);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE 4: Update doctor (PUT /api/doctors/:id)
router.put('/:id', fetchuser, async (req, res) => {
    try {
        const { name, specialization } = req.body;
        const doctor = await Doctor.findByPk(req.params.id);

        if (!doctor) return res.status(404).send("Doctor not found");

        await doctor.update({ name, specialization });
        res.json(doctor);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE 5: Delete doctor (DELETE /api/doctors/:id)
router.delete('/:id', fetchuser, async (req, res) => {
    try {
        const doctor = await Doctor.findByPk(req.params.id);
        if (!doctor) return res.status(404).send("Doctor not found");

        await doctor.destroy();
        res.json({ success: "Doctor deleted" });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
