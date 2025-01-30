const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); // Connexion à la base de données
const router = express.Router();

// Clé secrète pour signer les tokens (à déplacer dans votre fichier .env pour la sécurité)
const JWT_SECRET = process.env.JWT_SECRET || 'votre_clé_secrète';

// Endpoint d'inscription
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validation des champs
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Tous les champs sont requis' });
        }

        // Vérifier si l'utilisateur existe déjà
        const checkUserQuery = 'SELECT * FROM users WHERE email = ?';
        const [existingUser] = await db.query(checkUserQuery, [email]);

        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Email déjà utilisé' });
        }

        // Hashage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insérer l'utilisateur
        const insertUserQuery = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        const [result] = await db.query(insertUserQuery, [name, email, hashedPassword]);
        const userId = result.insertId;
        res.status(201).json({
            message: 'Utilisateur créé avec succès',
            user: {
                id: userId,
                name,
                email,
                
            },
            
        }
    );
    console.log("Utilisateur créé :", { id: userId, name, email });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur inattendue' });
    }
});

// Endpoint de connexion
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation des champs
        if (!email || !password) {
            return res.status(400).json({ message: 'Email et mot de passe sont requis' });
        }
        console.log('Début de la requête de connexion');
        const getUserQuery = 'SELECT * FROM users WHERE email = ?';
        const [results] = await db.execute(getUserQuery, [email]);
        console.log('Résultats de la requête:', results);

        if (results.length === 0) {
            return res.status(401).json({ message: "Utilisateur introuvable" });
        }

        const user = results[0];

        // Vérification du mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Mot de passe incorrect' });
        }

        // Génération du token JWT
        const token = jwt.sign(
            { id: user.id, name: user.name, email: user.email },
            JWT_SECRET,
            { expiresIn: '1h' } // Expiration du token (1 heure dans cet exemple)
        );

        // Envoi de la réponse avec le token
        res.status(200).json({
            message: 'Connexion réussie',
            token,
            user: { id: user.id, name: user.name, email: user.email },
        });
        console.log("Réponse envoyée par le backend :", {
            id: user.id,
            name: user.name,
            email: user.email,
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur inattendue' });
    }
});

// Endpoint pour vérifier le token (optionnel)
router.get('/profile', async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token manquant' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        res.status(200).json({ message: 'Token valide', user: decoded });
    } catch (error) {
        console.error('Erreur JWT:', error.message);
        res.status(401).json({ message: 'Token invalide ou expiré' });
    }
});
const nodemailer = require('nodemailer');

// 📧 Configuration de Nodemailer
const transporter = nodemailer.createTransport({
    service: 'Gmail', // Ou autre service comme SendGrid ou Mailgun
    auth: {
        user: process.env.EMAIL_USER, // Email de l'expéditeur
        pass: process.env.EMAIL_PASS, // Mot de passe ou App Password
    },
});

// Endpoint : Demander la réinitialisation du mot de passe
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Veuillez entrer un e-mail' });
    }

    try {
        // Vérifier si l'utilisateur existe
        const getUserQuery = 'SELECT * FROM users WHERE email = ?';
        const [users] = await db.execute(getUserQuery, [email]);

        if (users.length === 0) {
            return res.status(404).json({ message: "Aucun compte trouvé avec cet e-mail" });
        }

        const user = users[0];

        // Générer un token JWT valide 1 heure
        const resetToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

        // Lien de réinitialisation
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

        // Envoyer un e-mail avec le lien de réinitialisation
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Réinitialisation de votre mot de passe",
            html: `
                <h2>Demande de réinitialisation de mot de passe</h2>
                <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
                <a href="${resetLink}" target="_blank">${resetLink}</a>
                <p>Ce lien expirera dans 1 heure.</p>
            `,
        });

        res.json({ message: 'E-mail de réinitialisation envoyé avec succès' });

    } catch (error) {
        console.error('Erreur lors de la demande de réinitialisation:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});
// Endpoint : Réinitialiser le mot de passe
router.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).json({ message: 'Token et nouveau mot de passe sont requis' });
    }

    try {
        // Vérifier et décoder le token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Hasher le nouveau mot de passe
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Mettre à jour le mot de passe dans la base de données
        const updatePasswordQuery = 'UPDATE users SET password = ? WHERE id = ?';
        await db.execute(updatePasswordQuery, [hashedPassword, decoded.id]);

        res.json({ message: 'Mot de passe mis à jour avec succès' });

    } catch (error) {
        console.error('Erreur lors de la réinitialisation du mot de passe:', error.message);
        res.status(400).json({ message: 'Token invalide ou expiré' });
    }
});


module.exports = router;
