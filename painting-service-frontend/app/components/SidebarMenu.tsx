'use client';

import { useEffect, useRef, useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FormatPaintIcon from '@mui/icons-material/FormatPaint';
import PaintIcon from '@mui/icons-material/Brush';
import FloorIcon from '@mui/icons-material/HorizontalSplit';
import WallIcon from '@mui/icons-material/VerticalSplit';
import ToolIcon from '@mui/icons-material/Build';
import AccessoryIcon from '@mui/icons-material/Category';
import DiscountIcon from '@mui/icons-material/LocalOffer';
import SimulateIcon from '@mui/icons-material/SmartToy';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import '@fortawesome/fontawesome-free/css/all.min.css';

// ✅ Ajout d'une prop `user` pour afficher le nom dans le menu
const SidebarMenu: React.FC<{ user: { name: string } | null }> = ({ user }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  // ✅ Fonction pour afficher/masquer le menu
  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  // ✅ Fermer le menu si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div>
      {/* ✅ Icône du menu */}
      <button className="text-white text-3xl cursor-pointer p-4" onClick={toggleSidebar}>
        <MenuIcon fontSize="large" />
      </button>

      {/* ✅ Overlay pour fermer le menu en cliquant à l'extérieur */}
      {isOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-[999]"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* ✅ Sidebar avec corrections */}
      <div
        ref={sidebarRef}
        role="dialog"
        className={`fixed top-0 left-0 h-screen w-[85vw] max-w-[320px] bg-white  text-black shadow-2xl transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 z-[9999] overflow-y-auto`}
      >
        {/* ✅ Header du menu */}
        <div className="flex justify-between items-center p-4 border-b bg-gray-100">
          <div className="flex items-center space-x-2">
            <AccountCircleIcon fontSize="small" />
            {/* ✅ Afficher le nom de l'utilisateur ou "Mon compte" */}
            <span className="text-base font-semibold">
              {user ? user.name : 'Mon compte'}
            </span>
          </div>
          <button onClick={toggleSidebar}>
            <CloseIcon className="text-black cursor-pointer text-lg" />
          </button>
        </div>

        {/* ✅ Contenu du menu */}
        <nav className="p-4">
          {/* ✅ Liste des options */}
          <ul className="space-y-3">
            <li className="flex justify-between items-center text-sm font-medium py-2 hover:text-yellow-500 cursor-pointer">
              <span className="flex items-center">
                <PaintIcon className="mr-2 text-sm" />
                Peintures
              </span>
              <ChevronRightIcon fontSize="small" />
            </li>
            <li className="flex justify-between items-center text-sm font-medium py-2 hover:text-yellow-500 cursor-pointer">
              <span className="flex items-center">
                <FloorIcon className="mr-2 text-sm" />
                Sols
              </span>
              <ChevronRightIcon fontSize="small" />
            </li>
            <li className="flex justify-between items-center text-sm font-medium py-2 hover:text-yellow-500 cursor-pointer">
              <span className="flex items-center">
                <WallIcon className="mr-2 text-sm" />
                Murs
              </span>
              <ChevronRightIcon fontSize="small" />
            </li>
          </ul>

          {/* ✅ Section "Options rapides" */}
          <div className="mt-6">
            <p className="text-xs font-bold mb-2">Options rapides</p>
            <ul className="space-y-3">
              <li className="flex justify-between items-center text-sm font-medium py-2 hover:text-yellow-500 cursor-pointer">
                <span className="flex items-center">
                  <CalendarMonthIcon className="mr-2 text-sm" />
                  Prendre RDV
                </span>
                <ChevronRightIcon fontSize="small" />
              </li>
              <li className="flex justify-between items-center text-sm font-medium py-2 hover:text-yellow-500 cursor-pointer">
                <span className="flex items-center">
                  <LocationOnIcon className="mr-2 text-sm" />
                  Nos agences
                </span>
                <ChevronRightIcon fontSize="small" />
              </li>
            </ul>
          </div>

          {/* ✅ Icônes des réseaux sociaux */}
          <div className="flex justify-center mt-4 space-x-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook-f text-lg text-gray-700 hover:text-yellow-500"></i>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-youtube text-lg text-gray-700 hover:text-red-500"></i>
            </a>
            <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-pinterest text-lg text-gray-700 hover:text-red-500"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram text-lg text-gray-700 hover:text-pink-500"></i>
            </a>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default SidebarMenu;
