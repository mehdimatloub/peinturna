'use client';

import { useState, useEffect } from 'react';

export default function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/contact');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des contacts');
        }
        const data = await response.json();
        setContacts(data);
      } catch (error) {
        if (error instanceof Error) {
          console.error('Erreur:', error.message);
          setErrorMessage(error.message);
        } else {
          console.error('Erreur inconnue:', error);
          setErrorMessage('Une erreur inconnue est survenue.');
        }
      }
    };
  
    fetchContacts();
  }, []);
  

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Liste des Contacts</h1>
      {errorMessage && (
        <div className="bg-red-100 text-red-800 p-4 rounded mb-4">{errorMessage}</div>
      )}
      {contacts.length === 0 && !errorMessage ? (
        <p>Aucun contact trouvé.</p>
      ) : (
        <ul className="space-y-4">
          {contacts.map((contact: any) => (
            <li
              key={contact.id}
              className="border border-gray-300 p-4 rounded shadow"
            >
              <p>
                <strong>Nom :</strong> {contact.name}
              </p>
              <p>
                <strong>Email :</strong> {contact.email}
              </p>
              <p>
                <strong>Message :</strong> {contact.message}
              </p>
              <p className="text-gray-500 text-sm">
                <strong>Date :</strong>{' '}
                {new Date(contact.created_at).toLocaleString('fr-FR')}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
