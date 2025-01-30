const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Connexion à la base de données

// Récupérer tous les produits
router.get('/', async (req, res) => {
    const sql = 'SELECT * FROM products';
    try {
        const [results] = await db.query(sql); // Utilisation de await pour la requête
        res.json(results);
    } catch (err) {
        console.error('Erreur lors de la récupération des produits:', err);
        res.status(500).send('Erreur serveur');
    }
});

// Ajouter un produit
router.post('/', async (req, res) => {
    const { name, description, price, image_url, stock } = req.body;
    const sql = 'INSERT INTO products (name, description, price, image_url, stock) VALUES (?, ?, ?, ?, ?)';
    try {
        const [result] = await db.query(sql, [name, description, price, image_url, stock]);
        res.status(201).json({ message: 'Produit ajouté avec succès', id: result.insertId });
    } catch (err) {
        console.error('Erreur lors de l’ajout du produit:', err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Modifier un produit
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, price, image_url, stock } = req.body;
    const sql = 'UPDATE products SET name = ?, description = ?, price = ?, image_url = ?, stock = ? WHERE id = ?';
    try {
        const [result] = await db.query(sql, [name, description, price, image_url, stock, id]);
        res.json({ message: 'Produit mis à jour avec succès' });
    } catch (err) {
        console.error('Erreur lors de la mise à jour du produit:', err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Supprimer un produit
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM products WHERE id = ?';
    try {
        const [result] = await db.query(sql, [id]);
        res.json({ message: 'Produit supprimé avec succès' });
    } catch (err) {
        console.error('Erreur lors de la suppression du produit:', err);
        res.status(500).send('Erreur serveur');
    }
});

module.exports = router;
