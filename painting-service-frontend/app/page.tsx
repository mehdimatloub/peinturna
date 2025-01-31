'use client';

import { useEffect, useState } from 'react';
import ServiceCard from './Components/ServiceCard';
import BannerSwiper from './Components/BannerSwiper';
import ProductList from './Components/ProductList';
import SidebarMenu from './Components/SidebarMenu';
import Cart from './Components/Cart'; // Import du composant Cart
import Link from 'next/link';
import { useCart } from './Components/CartContext'; // Import du contexte du panier
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FormatPaintIcon from '@mui/icons-material/FormatPaint';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import '@fortawesome/fontawesome-free/css/all.min.css';
import SearchBar from './Components/SearchBar'
import Image from "next/image";

export default function HomePage() {
  const [services, setServices] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingServices, setLoadingServices] = useState(true);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollPosition, setLastScrollPosition] = useState(0);

  const { toggleCart, cart } = useCart(); // Utilisation du contexte du panier
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const fetchUser = () => {
      const storedUser = sessionStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    };
  
    fetchUser();
  
    window.addEventListener('userUpdated', fetchUser);
    return () => {
      window.removeEventListener('userUpdated', fetchUser);
    };
  }, []);
  
   

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
  
      // Cache la navbar si on descend, l'affiche si on remonte ou si on est en haut
      if (currentScrollY > lastScrollPosition && currentScrollY > 100) {
        setShowNavbar(false);
      } else {
        //setShowNavbar(true);
      }
  
      setLastScrollPosition(currentScrollY);
   };
  
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollPosition]);
  
  useEffect(() => {
    const fetchServices = async () => {
      setLoadingServices(true);
      try {
        const response = await fetch('http://localhost:5000/api/service');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des services');
        }
        const data = await response.json();
        setServices(data);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : 'Une erreur inconnue est survenue.'
        );
      } finally {
        setLoadingServices(false);
      }
    };

    fetchServices();
  }, []);

  return (
    
    <div className="bg-[var(--background-light)] text-[var(--foreground-light)] min-h-screen flex flex-col relative">
      {/* En-tête */}
      <header className={`fixed top-0 left-0 w-full bg-black py-1 z-50 transition-transform duration-300 ${showNavbar ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="flex items-center justify-between w-full px-8 max-w-[1440px] mx-auto">
          {/* Menu Toggle Icon */}
          <div className="text-white text-4xl cursor-pointer flex-shrink-0">
            <SidebarMenu  user={user}/>
          </div>

          {/* Logo */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            <Image
              src="/logo.jpg"
              alt="Logo Peinturna"
              className="h-15 w-20 object-contain rounded-full  shadow-md "
            />
          </div>

          {/* Barre de recherche */}
          <div className="flex flex-1 justify-center px-4">
  <div className="w-full max-w-[1100px]">
    <SearchBar />
  </div>
</div>

          {/* Icônes de navigation */}
          <div className="flex flex-wrap justify-center items-center space-x-4 text-white">
            <div className="flex flex-col items-center text-center space-y-1">
              <CalendarMonthIcon fontSize="large" />
              <p className="text-xs">Prendre rdv</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-1">
              <LocationOnIcon fontSize="large" />
              <p className="text-xs">Nos agences</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-1">
              
                <FormatPaintIcon fontSize="large" />
                <p className="text-xs">Espace Pro</p>
              
            </div>
            <div className="flex flex-col items-center text-center space-y-1">
    <Link href={user ? "/profile" : "/login"} className="flex flex-col items-center text-center">
      <PersonIcon fontSize="large" />
      <span className="text-xs">{user ? user.name : "Mon compte"}</span>
    </Link>
  </div>
            <div className="relative flex flex-col items-center text-center space-y-1">
              <button onClick={toggleCart} className="flex items-center">
                <ShoppingCartIcon fontSize="large" />
                <span className="absolute top-0 right-0 bg-pink-500 text-white rounded-full text-xs px-1">
                  {cart.length}
                </span>
              </button>
              <p className="text-xs">Panier</p>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="container mx-auto py-1  flex-grow">
        <BannerSwiper />

        {/* Nos Produits */}
        <h2 className="text-5xl font-bold mb-8 text-center  text-gray-800 mb-10">Nos Produits</h2>
        <ProductList />
      </main>

      {/* Panneau latéral du panier */}
      <Cart />

      {/* Section "Nos Clients" */}
      <section className="container mx-auto py-12 clients-section">
        <h2 className="text-5xl font-bold mb-8 text-center  text-gray-800 mb-10">Nos Clients</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 items-center">
          {Array.from({ length: 9 }, (_, i) => (
            <Image
              key={i}
              src={`/client${i + 1}.png`}
              alt={`Client ${i + 1}`}
              className="h-16 w-auto mx-auto"
            />
          ))}
        </div>
      </section>
      <footer className="bg-black text-white py-8">
        <div className="container mx-auto px-4">
          {/* Section principale */}
          <div className="flex flex-wrap justify-between items-start mb-8">
            {/* Colonne 1 */}
            <div className="w-full md:w-1/3 text-center md:text-left mb-4 md:mb-0">
              <Image
                src="/logo-peinturna.png"
                alt="Logo Peinturna"
                className="mx-auto md:mx-0 h-20"
              />
              <p className="mt-4 font-semibold">SIÈGE SOCIAL</p>
              <p>341 Avenue de Rodez</p>
              <p>info@peinturna.fr</p>
              <p>Phone: 05 65 68 95 39</p>
            </div>

            {/* Colonne 2 */}
            <div className="w-full md:w-1/3 text-center">
              <h3 className="font-semibold text-lg mb-4">
                Livraison & Moyens de paiement
              </h3>
              <div className="flex justify-center space-x-4">
                <Image src="/visa.png" alt="Visa" className="h-20" />
                <Image src="/PayPal.png" alt="PayPal" className="h-20" />
                <Image src="/mastercarte.png" alt="MasterCard" className="h-20" />
              </div>
            </div>

            {/* Colonne 3 */}
            <div className="w-full md:w-1/3 text-center md:text-right">
              <h3 className="font-semibold text-lg mb-4">Contact</h3>
              <p className="mt-4">Espace Client</p>
              <p>Se connecter</p>
              <p>Points de Retrait</p>
              <p>Espace Pro</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
