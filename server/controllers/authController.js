const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const { Admin } = require('../models');

// First step of admin login - validate credentials
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ where: { email } });
        if (!admin || !admin.validPassword(password)) {
            return res.status(401).json({ error: 'Неверные учетные данные' });
        }

        // If 2FA is not yet enabled, provide setup
        if (!admin.twoFactorEnabled) {
            const secret = speakeasy.generateSecret({
                name: `Capital Estate (${email})`
            });
            
            // Generate QR code
            const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);
            
            // Store secret temporarily in the database
            await admin.update({ twoFactorSecret: secret.base32 });
            
            return res.status(200).json({
                message: 'Требуется настройка двухфакторной аутентификации',
                needsSetup: true,
                adminId: admin.id,
                secret: secret.base32,
                qrCode: qrCodeUrl
            });
        }

        // If 2FA is enabled, ask for verification code
        return res.status(200).json({
            message: 'Требуется проверка кода аутентификации',
            needsVerification: true,
            adminId: admin.id
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

// Verify 2FA code and complete login
exports.verify2FA = async (req, res) => {
    try {
        const { adminId, token } = req.body;

        const admin = await Admin.findByPk(adminId);
        if (!admin) {
            return res.status(404).json({ error: 'Администратор не найден' });
        }

        // Verify token with the stored secret
        const verified = speakeasy.totp.verify({
            secret: admin.twoFactorSecret,
            encoding: 'base32',
            token: token
        });

        if (!verified) {
            return res.status(401).json({ error: 'Неверный код аутентификации' });
        }

        // If token is valid, generate JWT
        const jwtToken = jwt.sign(
            { id: admin.id },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({ 
            token: jwtToken,
            message: 'Вход выполнен успешно'
        });
    } catch (error) {
        console.error('2FA verification error:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

// Setup and enable 2FA for the first time
exports.setup2FA = async (req, res) => {
    try {
        const { adminId, token } = req.body;

        const admin = await Admin.findByPk(adminId);
        if (!admin) {
            return res.status(404).json({ error: 'Администратор не найден' });
        }

        // Verify the token with the stored secret
        const verified = speakeasy.totp.verify({
            secret: admin.twoFactorSecret,
            encoding: 'base32',
            token: token
        });

        if (!verified) {
            return res.status(401).json({ error: 'Неверный код аутентификации' });
        }

        // Enable 2FA
        await admin.update({ twoFactorEnabled: true });

        // Generate JWT
        const jwtToken = jwt.sign(
            { id: admin.id },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({
            token: jwtToken,
            message: 'Двухфакторная аутентификация успешно настроена'
        });
    } catch (error) {
        console.error('2FA setup error:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

// Check if current token is valid
exports.checkAuth = async (req, res) => {
    try {
        const admin = await Admin.findByPk(req.adminId);
        if (!admin) {
            return res.status(404).json({ error: 'Администратор не найден' });
        }
        
        res.json({ 
            isAuthenticated: true,
            admin: {
                id: admin.id,
                email: admin.email
            }
        });
    } catch (error) {
        console.error('Auth check error:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};