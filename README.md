# 📌 Painting Service - Guide d'Installation et d'Utilisation

## 📚 Introduction
Bienvenue dans le projet **Peinturna** ! 🎨  
Il s'agit d'une application de **service de peinture** avec une interface utilisateur moderne et intuitive.  
Le projet est construit avec **Next.js** pour le frontend et **Express.js avec MySQL** pour le backend.

---

## 🏰️ Structure du Projet
Le projet est divisé en **deux parties** :

- **Backend** : Situé dans le dossier `backend/`, utilisant **Node.js, Express, MySQL, JWT, Stripe et PayPal**.
- **Frontend** : Situé dans le dossier `painting-service-frontend/`, développé avec **Next.js, Tailwind CSS et React**.

---

## 🚀 Installation et Configuration

### 🔹 1️⃣ Prérequis
Avant de commencer, assurez-vous d'avoir installé :

- **Node.js (v16 ou supérieur)** 📌 [Télécharger ici](https://nodejs.org/)
- **MySQL (v5.7 ou supérieur)** 📌 [Télécharger ici](https://www.mysql.com/)

---

### 🔹 2️⃣ Configuration de la Base de Données

#### ✅ Méthode  : via MySQL Workbench (Interface Graphique)

1️⃣ **Ouvrir MySQL Workbench et se connecter à votre serveur MySQL.**  
2️⃣ **Aller dans "Server" → "Data Import".**  
3️⃣ **Sélectionner "Import from Self-Contained File" et choisir `painting_service.sql`.**  
4️⃣ **Sélectionner "painting_service" comme base de données cible.**  
5️⃣ **Cliquer sur "Start Import".**  

📌 **Vérification** :  
Pour vérifier que l'importation a bien été faite, exécutez :
```bash
mysql -u root -p
```
Puis dans MySQL :
```sql
SHOW DATABASES;
USE painting_service;
SHOW TABLES;
```
Si des tables sont listées, l'importation est réussie ! 🎉

📌 Assurez-vous que les paramètres de la base de données dans `.env` correspondent à votre installation.

---

## ⚙️ Lancement du Backend

1️⃣ Accédez au dossier backend :
   ```bash
   cd backend
   ```

2️⃣ Installez les dépendances :
   ```bash
   npm install
   ```

3️⃣ **Modifiez les variables d'environnement dans `.env` :**  
   Ouvrez le fichier `backend/.env` et remplacez les valeurs suivantes :  
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_NAME=painting_service
   DB_PORT=3306
   PORT=5000
   JWT_SECRET='2f401a083d6ac86358119033674ed9326bf7f86c54a3e832a9eeb7a562a6bfe0d4dd96624be8853e8a1142b2dd097c9b738890be67b088ad25d76b0f2e2f05e0'

   # Configuration email pour les notifications et la récupération de mot de passe
   EMAIL_USER=votre_email
   EMAIL_PASS=votre_mot_de_passe
   ```
   **🔹 ATTENTION :**  
   - **EMAIL_USER** → Entrez votre adresse e-mail (ex: `votre_email@gmail.com`).  
   - **EMAIL_PASS** → Entrez votre mot de passe ou **App Password** si vous utilisez Gmail.  

4️⃣ Démarrez le serveur backend :
   ```bash
   node server.js
   ```

📌 Par défaut, l'API sera disponible sur `http://localhost:5000`

---

## 🖥️ Lancement du Frontend

1️⃣ Accédez au dossier frontend :
   ```bash
   cd painting-service-frontend
   ```

2️⃣ Installez les dépendances :
   ```bash
   npm install --legacy-peer-deps
   ```

3️⃣ Lancez le serveur de développement :
   ```bash
   npm run dev
   ```

📌 Par défaut, l'application sera accessible sur `http://localhost:3000`

---

## 🔑 Authentification et Sécurité
🔹 **JWT** est utilisé pour l'authentification des utilisateurs.  
🔹 **bcryptjs** est utilisé pour le hachage des mots de passe.  
🔹 **Nodemailer** est utilisé pour la réinitialisation de mot de passe.  

---

## 💳 Gestion des Paiements
Le projet intègre **Stripe** et **PayPal** pour les paiements en ligne.

### 🛠️ Configuration des paiements
Ajoutez vos clés API dans le fichier `backend/.env` :
```env
# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key

# PayPal 
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
```

🔹 **Dans le frontend**, remplacez votre clé publique Stripe dans `painting-service-frontend/app/components/StripePayment.tsx` :
```typescript
const stripePromise = loadStripe("pk_test_VOTRE_CLE_PUBLIC");
```

---

## ❓ FAQ

### 1️⃣ Problème de connexion à la base de données ?
✔️ Vérifiez que MySQL est bien installé et lancé.  
✔️ Assurez-vous que les identifiants dans `.env` sont corrects.  

### 2️⃣ L'API ne démarre pas ?
✔️ Exécutez `npm install` dans le dossier `backend`.  
✔️ Vérifiez que le fichier `.env` est bien configuré.  

### 3️⃣ Stripe ne fonctionne pas ?
✔️ Remplacez la clé API Stripe par la vôtre dans le frontend et backend.

---

🎉 **Votre projet est maintenant prêt à être utilisé !** 🎉

