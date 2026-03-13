const authService = require('../services/authService');
const { validationResult } = require('express-validator');

async function signup(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;
        const result = await authService.signup({ name, email, password });
        res.status(201).json(result);
    } catch (error) {
        if (error.message === 'User already exists') {
            return res.status(400).json({ message: error.message });
        }
        next(error);
    }
}

async function login(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        const result = await authService.login({ email, password });
        res.json(result);
    } catch (error) {
        if (error.message === 'Invalid email or password') {
            return res.status(401).json({ message: error.message });
        }
        next(error);
    }
}

async function me(req, res, next) {
    try {
        // req.user is populated by authMiddleware
        res.json(req.user);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    signup,
    login,
    me
};
