const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Connexion à la base de données

// Ajouter un contact
router.post('/add', async (req, res) => {
    const { name, email, message } = req.body;
    const query = 'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)';

    try {
        // Utilisation d'await pour exécuter la requête
        const [result] = await db.query(query, [name, email, message]);
        res.status(201).json({ message: 'Contact ajouté avec succès', id: result.insertId });
    } catch (err) {
        console.error('Erreur lors de l’ajout du contact:', err);
        res.status(500).json({ error: err.message });
    }
});

// Récupérer tous les contacts
router.get('/', async (req, res) => {
    const query = 'SELECT * FROM contacts';

    try {
        // Utilisation d'await pour récupérer les résultats
        const [results] = await db.query(query);
        res.json(results);
    } catch (err) {
        console.error('Erreur lors de la récupération des contacts:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
