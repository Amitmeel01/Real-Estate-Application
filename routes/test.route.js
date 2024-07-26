const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');

// Route to check if user should be logged in
router.get('/should-be-login', verifyToken, (req, res) => {
    res.status(200).json({ message: "You are allowed" });
});

// Route to check if user should be admin
router.get('/should-be-admin', verifyToken, (req, res) => {
    if (!req.isAdmin) {
        return res.status(403).json({ message: "Not authorised" });
    }

    res.status(200).json({ message: "You are allowed" });
});

module.exports = router;
