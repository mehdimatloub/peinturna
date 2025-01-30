'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../Components/UserContext';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

interface SignupPageProps { 
    onSignupSuccess: () => void; // Déclarez la prop onSignupSuccess comme une fonction
    redirectToLogin?: boolean; // Indique si la redirection doit se faire vers la page de paiement
    redirectToPayment?: boolean;
}

export default function SignupPage({ onSignupSuccess,  redirectToLogin = true,redirectToPayment = false }: SignupPageProps) {
    const router = useRouter();
    const { signup } = useUser(); 
    const [formData, setFormData] = useState({
        title: '',
        firstName: '',
        lastName: '',
        company: '',
        taxId: '',
        email: '',
        password: '',
        birthDate: '',
        offers: false,
        confidentiality: false,
        newsletter: false,
        terms: false,
    });

    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            setFormData((prevData) => ({
                ...prevData,
                [name]: (e.target as HTMLInputElement).checked,
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();

           
      if (response.ok) {
        // Appelle la méthode `signup` pour stocker l'utilisateur
        if (data.user) {
          signup(data.user);
          console.log('Utilisateur inscrit :', data.user);

          // Gestion de la redirection
          if (redirectToPayment) {
            onSignupSuccess();
          } else if (redirectToLogin) {
            router.push('/login');
          }
        } else {
          throw new Error('Données utilisateur manquantes ou invalides.');
        }
      } else {
        setError(data.message || 'Erreur lors de la création du compte');
      }
    } catch (err) {
      console.error('Erreur lors de l\'inscription :', err);
      setError('Erreur serveur. Veuillez réessayer plus tard.');
    }
  };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-white">
        <div className="w-full max-w-2xl bg-white shadow-md rounded px-8 py-6">
            <div className="flex items-center justify-center space-x-4 mb-4">
                <img
                    src="/logo.jpg"
                    alt="Logo"
                    className="h-22 w-20 object-cover rounded-full shadow-md"
                />
            </div>
            <form onSubmit={handleSubmit}>
                {/* Champs principaux organisés en deux colonnes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Titre *</label>
                        <select
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-yellow-500 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            required
                        >
                            <option value="">-- veuillez choisir --</option>
                            <option value="Mr">Mr</option>
                            <option value="Mme">Mme</option>
                            <option value="Mlle">Mlle</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Prénom *</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Nom *</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Société (Optionnel)</label>
                        <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Numéro d'identification fiscale (Optionnel)</label>
                        <input
                            type="text"
                            name="taxId"
                            value={formData.taxId}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">E-mail *</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            required
                        />
                    </div>
                    <div >
                        <label className="block text-sm font-medium mb-1">Mot de passe *</label>
                        <div className="relative flex items-center">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 pr-10"
                            required
                        />
                        <span
                            onClick={togglePasswordVisibility}
                            className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500 hover:text-gray-700"
                            style={{ top: '50%', transform: 'translateY(-50%)' }}
                            >
                            {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </span>
                    </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Date de naissance (Optionnel)</label>
                        <input
                            type="date"
                            name="birthDate"
                            value={formData.birthDate}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                    </div>
                </div>
    
                {/* Cases à cocher */}
                <div className="mt-6 space-y-4">
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="offers"
                            checked={formData.offers}
                            onChange={handleChange}
                            className="w-4 h-4 text-yellow-500 focus:ring-yellow-500"
                        />
                        <span>Recevoir les offres de nos partenaires</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="confidentiality"
                            checked={formData.confidentiality}
                            onChange={handleChange}
                            className="w-4 h-4 text-yellow-500 focus:ring-yellow-500"
                            required
                        />
                        <span>Message concernant la confidentialité des données clients</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="newsletter"
                            checked={formData.newsletter}
                            onChange={handleChange}
                            className="w-4 h-4 text-yellow-500 focus:ring-yellow-500"
                        />
                        <span>Recevoir notre newsletter</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="terms"
                            checked={formData.terms}
                            onChange={handleChange}
                            className="w-4 h-4 text-yellow-500 focus:ring-yellow-500"
                            required
                        />
                        <span>J'accepte les conditions générales et la politique de confidentialité</span>
                    </label>
                </div>
    
                {/* Bouton de soumission */}
                <div className="mt-6">
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-yellow-500 text-white rounded hover:bg-yellow-400"
                    >
                        Créer mon compte
                    </button>
                </div>
                {error && <div className="text-red-500 mt-4">{error}</div>}
            </form>
        </div>
    </div>
    
    );
}
