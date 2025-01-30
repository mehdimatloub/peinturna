'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/contact/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccessMessage('Votre message a été envoyé avec succès !');
        setErrorMessage('');
        setFormData({ name: '', email: '', message: '' }); // Réinitialise les champs
      } else {
        const data = await response.json();
        setErrorMessage(data.error || 'Une erreur est survenue.');
        setSuccessMessage('');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setErrorMessage('Impossible d’envoyer le message.');
      setSuccessMessage('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary">Formulaire de Contact</h1>
      {successMessage && (
        <div
          className="bg-green-100 text-green-800 p-4 rounded mb-4 text-center shadow"
          role="alert"
          aria-live="polite"
        >
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div
          className="bg-red-100 text-red-800 p-4 rounded mb-4 text-center shadow"
          role="alert"
          aria-live="assertive"
        >
          {errorMessage}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="bg-secondary p-6 rounded-lg shadow-lg mx-auto max-w-lg"
      >
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-primary mb-2">
            Nom
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-primary rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="Nom"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-primary mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-primary rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="Email"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="message" className="block text-sm font-medium text-primary mb-2">
            Votre message
          </label>
          <textarea
            id="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-primary rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="Votre message"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className={`w-full bg-primary text-secondary font-bold py-2 px-4 rounded-lg hover:bg-accent hover:text-primary transition ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={isLoading}
        >
          {isLoading ? 'Envoi en cours...' : 'Envoyer'}
        </button>
      </form>
    </div>
  );
}
