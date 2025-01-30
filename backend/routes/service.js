const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Connexion à la base de données

// Ajouter un service
router.post('/add', async (req, res) => {
    const { title, description } = req.body;
    const query = 'INSERT INTO services (title, description) VALUES (?, ?)';

    try {
        // Utilisation d'await pour exécuter la requête
        const [result] = await db.query(query, [title, description]);
        res.status(201).json({ message: 'Service ajouté avec succès', id: result.insertId });
    } catch (err) {
        console.error('Erreur lors de l’ajout du service:', err);
        res.status(500).json({ error: err.message });
    }
});

// Récupérer tous les services
router.get('/', async (req, res) => {
    const query = 'SELECT * FROM services';

    try {
        // Utilisation d'await pour récupérer les résultats
        const [results] = await db.query(query);
        res.json(results);
    } catch (err) {
        console.error('Erreur lors de la récupération des services:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
