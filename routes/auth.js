const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = "Arnikaisagoodg$irl";    

// ROUTE 1: Register a user
router.post('/register', [
    body('name', 'Name must be at least 3 characters').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be at least 5 characters').isLength({ min: 5 })
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success, errors: errors.array() });

    try {
        let user = await User.findOne({ where: { email: req.body.email } });
        if (user) return res.status(400).json({ success, error: "User already exists" });

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass
        });

        const data = { user: { id: user.id } };
        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authtoken });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occurred");
    }
});

// ROUTE 2: Login
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists()
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ success, error: "Invalid credentials" });

        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) return res.status(400).json({ success, error: "Invalid credentials" });

        const data = { user: { id: user.id } };
        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authtoken });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE 3: Get user details
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;

