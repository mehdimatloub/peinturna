const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Connexion à la base de données

// Ajouter un projet
router.post('/add', async (req, res) => {
    const { title, description, image_url } = req.body;
    const query = 'INSERT INTO projects (title, description, image_url) VALUES (?, ?, ?)';

    try {
        // Utilisation d'await pour exécuter la requête
        const [result] = await db.query(query, [title, description, image_url]);
        res.status(201).json({ message: 'Projet ajouté avec succès', id: result.insertId });
    } catch (err) {
        console.error('Erreur lors de l’ajout du projet:', err);
        res.status(500).json({ error: err.message });
    }
});

// Récupérer tous les projets
router.get('/', async (req, res) => {
    const query = 'SELECT * FROM projects';

    try {
        // Utilisation d'await pour récupérer les résultats
        const [results] = await db.query(query);
        res.json(results);
    } catch (err) {
        console.error('Erreur lors de la récupération des projets:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
