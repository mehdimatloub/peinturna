import React, { useState } from 'react';
import { useCart } from './CartContext';

interface Product {
  id: number;
  name: string;
  description: string;
  price: string | number;
  image_url: string;
}

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1); // Gestion de la quantité
  const { addToCart } = useCart();

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const price =
    typeof product.price === 'number' ? product.price : parseFloat(product.price);

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  return (
    <div className="border p-4 rounded-lg shadow bg-white">
      {/* Image et Aperçu rapide */}
      <div className="relative group">
        <img
          src={`http://localhost:5000${product.image_url}`}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <div
          className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={openModal}
        >
          <button className="text-white text-lg font-medium">
            <i className="fas fa-search text-xl mr-2"></i>Aperçu rapide
          </button>
        </div>
      </div>

      {/* Détails du produit */}
      <h2 className="text-xl font-bold mt-4 text-black">{product.name}</h2>
      <p className="text-gray-600">{product.description}</p>
      <p className="text-lg font-bold">
        {price.toFixed(2)} €
      </p>

      {/* Modal pour Aperçu rapide */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full p-8 relative">
            {/* Bouton de fermeture */}
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-2xl"
              onClick={closeModal}
            >
              &times;
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Image du produit */}
              <div className="flex justify-center items-center">
                <img
                  src={`http://localhost:5000${product.image_url}`}
                  alt={product.name}
                  className="w-full h-auto max-w-md object-contain"
                />
              </div>

              {/* Détails dans le modal */}
              <div className="flex flex-col justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-yellow-500 mb-4">{product.name}</h2>
                  <p className="text-lg text-gray-700 mb-6">{product.description}</p>
                  <p className="text-2xl font-bold text-black mb-6">
                    {(price * quantity).toFixed(2)} € TTC
                  </p>
                </div>

                {/* Contrôles de quantité et ajout au panier */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <button
                      className="border border-gray-300 px-3 py-1 rounded text-xl"
                      onClick={handleDecrement}
                    >
                      -
                    </button>
                    <span className="text-lg font-bold">{quantity}</span>
                    <button
                      className="border border-gray-300 px-3 py-1 rounded text-xl"
                      onClick={handleIncrement}
                    >
                      +
                    </button>
                  </div>

                  {/* Bouton Ajouter au panier */}
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded text-lg"
                    onClick={() => {
                      addToCart({
                        id: product.id,
                        name: product.name,
                        price,
                        image_url: product.image_url,
                        quantity,
                      });
                      closeModal(); // Fermer le modal après ajout au panier
                    }}
                  >
                    Ajouter au panier
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
