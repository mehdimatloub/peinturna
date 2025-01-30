import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/navigation"; // Pour rediriger vers la page de recherche

export default function SearchBar({ products = [] }: { products?: any[] }) { 

  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter(); // Pour rediriger après la recherche

  const handleSearch = () => {
    if (searchTerm.trim() === "") return; // Empêche la recherche vide
    router.push(`/search?query=${encodeURIComponent(searchTerm)}`); // Redirection avec le terme recherché
  };

  return (
    <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-lg w-full max-w-[1100px] my-4 md:my-0">

      <input
        type="text"
        placeholder="Rechercher un produit"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-grow border-none text-gray-700 placeholder-gray-400 focus:outline-none"
        onKeyDown={(e) => e.key === "Enter" && handleSearch()} // Recherche avec "Enter"
      />
      <button onClick={handleSearch}>
        <SearchIcon className="text-gray-500 text-3xl cursor-pointer" />
      </button>
    </div>
  );
}
