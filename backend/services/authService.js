// services/authService.js
const { User } = require('../models'); // ✅ Import from models/index.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';

async function signup({ name, email, password }) {
    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            throw new Error('User already exists');
        }

        const user = await User.create({ name, email, password });
        
        const userJson = user.toJSON();
        delete userJson.password;
        
        return {
            user: userJson,
            token: generateToken(user.id)
        };
    } catch (error) {
        console.error('Signup error:', error);
        throw error;
    }
}

async function login({ email, password }) {
    try {
        console.log('Login attempt for:', email);
        
        const user = await User.findOne({ where: { email } });
        if (!user) {
            console.log('User not found');
            throw new Error('Invalid email or password');
        }

        console.log('User found, validating password...');
        const isValid = await user.validatePassword(password);
        
        if (!isValid) {
            console.log('Invalid password');
            throw new Error('Invalid email or password');
        }

        console.log('Login successful');
        const userJson = user.toJSON();
        delete userJson.password;

        return {
            user: userJson,
            token: generateToken(user.id)
        };
    } catch (error) {
        console.error('Login error:', error.message);
        throw error;
    }
}

function generateToken(userId) {
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '24h' });
}

module.exports = {
    signup,
    login
};