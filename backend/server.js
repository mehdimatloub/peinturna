const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const mime = require('mime-types');

require('dotenv').config();
const contactRoutes = require('./routes/contact');
const projectRoutes = require('./routes/project');
const serviceRoutes = require('./routes/service');
const productRoutes = require('./routes/product');
const userRoutes = require('./routes/user');
const paymentRoutes = require('./routes/paymentRoutes');

const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;


// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // Remplacez par l'URL de votre frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Méthodes autorisées
    credentials: true // Si vous envoyez des cookies ou des sessions
}));

app.use(bodyParser.json());

// Middleware pour configurer le type MIME pour les fichiers .avif
app.use((req, res, next) => {
    if (req.url.endsWith('.avif')) {
        res.setHeader('Content-Type', 'image/avif');
    }
    next();
});

app.use('/static', express.static(path.join(__dirname, 'image')));

app.use('/api/contact', contactRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/service', serviceRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/payment', paymentRoutes); 
// Route de test
app.get('/', (req, res) => {
    res.send('API de service de peinture est opérationnelle');
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
