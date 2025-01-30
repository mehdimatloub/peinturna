import React from "react";
import { useCart } from "./CartContext";
import Slider from "react-slick"; // Importer Slider de react-slick
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useRouter } from "next/navigation";
// Boutons personnalisés pour le slider
const PrevArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} slick-prev`}
      style={{ ...style, display: "block", left: "-30px", zIndex: 1 }}
      onClick={onClick}
    >
      <i className="fas fa-chevron-left text-black text-lg"></i>
    </div>
  );
};

const NextArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} slick-next`}
      style={{ ...style, display: "block", right: "-30px", zIndex: 1 }}
      onClick={onClick}
    >
      <i className="fas fa-chevron-right text-black text-lg"></i>
    </div>
  );
};

const Cart: React.FC = () => {
  const { cart, products, removeFromCart, updateQuantity, showCart, toggleCart, addToCart } =
    useCart();
    const router = useRouter(); 
    const isLoggedIn = false;

    const handleValidateCart = () => {
      if (!isLoggedIn) {
        router.push("/commande"); // Rediriger vers la page /commande si l'utilisateur n'est pas connecté
      } else {
        alert("Redirection vers la page de paiement ou confirmation"); // Remplacez par votre logique
      }
    };

  const calculateTotal = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

  // Filtrer les produits non présents dans le panier
  const recommendedProducts = products.filter(
    (product) => !cart.some((cartItem) => cartItem.id === product.id)
  );

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <>
      {showCart && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleCart}
        ></div>
      )}

      <div
        className={`fixed right-0 top-0 h-full bg-white shadow-lg w-[40rem] transform ${
          showCart ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 z-50`}
      >
        {/* Header */}
        <div className="bg-black text-white text-center font-bold text-lg py-4 relative">
          Votre Panier
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 text-2xl"
            onClick={toggleCart}
          >
            &times;
          </button>
        </div>

        <div className="p-4 overflow-auto" style={{ maxHeight: "calc(100% - 200px)" }}>
          {cart.length === 0 ? (
            <div className="text-center">
              {/* Message lorsque le panier est vide */}
              <p className="bg-red-100 text-red-500 font-bold py-2 px-4 rounded mb-4">
                Votre panier est vide
              </p>
              <p className="text-gray-600 mb-4">
                Les frais de port seront calculés lors des étapes suivantes. <br />
                <span className="font-bold">Frais de ports offerts à partir de 700 €</span>
              </p>
              <button
                onClick={toggleCart}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
              >
                Continuer le shopping
              </button>
            </div>
          ) : (
            <>
              {/* Liste des produits */}
              <ul className="space-y-4">
                {cart.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={`http://localhost:5000${item.image_url}`}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-bold">{item.name}</h3>
                        <p className="text-sm text-gray-500">Réf. : {item.id}</p>
                        <p className="text-sm text-gray-500">
                          {item.price.toFixed(2)} €
                          <span className="text-gray-400 text-xs">
                            ({item.price.toFixed(2)} €/unité)
                          </span>
                        </p>
                        <div className="flex items-center mt-2 space-x-2">
                          <button
                            className="border border-gray-300 px-3 py-1 rounded text-lg"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            -
                          </button>
                          <span className="text-lg font-semibold">{item.quantity}</span>
                          <button
                            className="border border-gray-300 px-3 py-1 rounded text-lg"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between space-x-4 w-full">
                      <p className="text-lg font-bold flex-1 text-right">
                        {(item.price * item.quantity).toFixed(2)} €
                      </p>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-500 hover:text-red-600 "
                      >
                        <i className="fas fa-trash text-xl"></i>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-6 border-t pt-4">
                <p className="text-lg font-bold">Sous-total : {calculateTotal()} €</p>
                <button
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded w-full mt-4"
                  onClick={handleValidateCart}
                >
                  Valider le panier
                </button>

                {/* Continuer le shopping */}
                <button
                  onClick={toggleCart}
                  className="text-black hover:text-gray-800 font-medium underline py-2 px-4 rounded w-full mt-2"
                >
                  Continuer le shopping
                </button>
              </div>
            </>
          )}

          {/* Section "Avez-vous pensé à..." toujours visible */}
          <div className="mt-6 border-t pt-4 text-center">
            <h3 className="text-lg font-bold mb-4">Avez vous pensé à...</h3>
            <div className="slider-container">
              <Slider {...sliderSettings} className="relative">
                {recommendedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex-shrink-0 border rounded-lg p-6 w-72 bg-gray-50 shadow hover:shadow-md"
                  >
                    <img
                      src={`http://localhost:5000${product.image_url}`}
                      alt={product.name}
                      className="w-full h-40 object-cover rounded"
                    />
                    <p className="text-sm mt-2 font-semibold truncate">{product.name}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-black text-lg font-bold">{product.price} €</p>
                      <button
                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
                        onClick={() =>
                          addToCart({
                            id: product.id,
                            name: product.name,
                            price: parseFloat(product.price.toString()),
                            image_url: product.image_url,
                            quantity: 1,
                          })
                        }
                      >
                        <i className="fas fa-shopping-cart"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
