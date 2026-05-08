"use client";

import { useState, useRef, useEffect } from "react";
import { MapPin, ChevronDown, X } from "lucide-react";

interface Location {
  city: string;
  state: string;
  country: string;
}

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
}

const nigerianLocations: Location[] = [
  { city: "Ikeja", state: "Lagos", country: "Nigeria" },
  { city: "Victoria Island", state: "Lagos", country: "Nigeria" },
  { city: "Lekki", state: "Lagos", country: "Nigeria" },
  { city: "Yaba", state: "Lagos", country: "Nigeria" },
  { city: "Surulere", state: "Lagos", country: "Nigeria" },
  { city: "Ikorodu", state: "Lagos", country: "Nigeria" },
  { city: "Epe", state: "Lagos", country: "Nigeria" },
  { city: "Badagry", state: "Lagos", country: "Nigeria" },
  { city: "Agege", state: "Lagos", country: "Nigeria" },
  { city: "Alimosho", state: "Lagos", country: "Nigeria" },
  { city: "Apapa", state: "Lagos", country: "Nigeria" },
  { city: "Eti-Osa", state: "Lagos", country: "Nigeria" },
  { city: "Festac", state: "Lagos", country: "Nigeria" },
  { city: "Gbagada", state: "Lagos", country: "Nigeria" },
  { city: "Ikoyi", state: "Lagos", country: "Nigeria" },
  { city: "Ketu", state: "Lagos", country: "Nigeria" },
  { city: "Magodo", state: "Lagos", country: "Nigeria" },
  { city: "Maryland", state: "Lagos", country: "Nigeria" },
  { city: "Mushin", state: "Lagos", country: "Nigeria" },
  { city: "Ogba", state: "Lagos", country: "Nigeria" },
  { city: "Oshodi", state: "Lagos", country: "Nigeria" },
  { city: "Shomolu", state: "Lagos", country: "Nigeria" },
  { city: "Ajah", state: "Lagos", country: "Nigeria" },
  { city: "Sangotedo", state: "Lagos", country: "Nigeria" },
  { city: "Abule Egba", state: "Lagos", country: "Nigeria" },
  { city: "Egbeda", state: "Lagos", country: "Nigeria" },
  { city: "Isolo", state: "Lagos", country: "Nigeria" },
  { city: "Okota", state: "Lagos", country: "Nigeria" },
  { city: "Satellite Town", state: "Lagos", country: "Nigeria" },
  { city: "Trade Fair", state: "Lagos", country: "Nigeria" },
  { city: "Ojo", state: "Lagos", country: "Nigeria" },
  { city: "Amuwo-Odofin", state: "Lagos", country: "Nigeria" },
  { city: "Maitama", state: "FCT", country: "Nigeria" },
  { city: "Wuse", state: "FCT", country: "Nigeria" },
  { city: "Asokoro", state: "FCT", country: "Nigeria" },
  { city: "Garki", state: "FCT", country: "Nigeria" },
  { city: "Jabi", state: "FCT", country: "Nigeria" },
  { city: "Lugbe", state: "FCT", country: "Nigeria" },
  { city: "Kubwa", state: "FCT", country: "Nigeria" },
  { city: "Gwarinpa", state: "FCT", country: "Nigeria" },
  { city: "Utako", state: "FCT", country: "Nigeria" },
  { city: "Wuye", state: "FCT", country: "Nigeria" },
  { city: "Jukwoyi", state: "FCT", country: "Nigeria" },
  { city: "Nyanya", state: "FCT", country: "Nigeria" },
  { city: "Karu", state: "FCT", country: "Nigeria" },
  { city: "Ibadan", state: "Oyo", country: "Nigeria" },
  { city: "Ogbomosho", state: "Oyo", country: "Nigeria" },
  { city: "Iseyin", state: "Oyo", country: "Nigeria" },
  { city: "Saki", state: "Oyo", country: "Nigeria" },
  { city: "Eruwa", state: "Oyo", country: "Nigeria" },
  { city: "Port Harcourt", state: "Rivers", country: "Nigeria" },
  { city: "Obio-Akpor", state: "Rivers", country: "Nigeria" },
  { city: "Bonny", state: "Rivers", country: "Nigeria" },
  { city: "Okrika", state: "Rivers", country: "Nigeria" },
  { city: "Eleme", state: "Rivers", country: "Nigeria" },
  { city: "Trans Amadi", state: "Rivers", country: "Nigeria" },
  { city: "Rumukrushi", state: "Rivers", country: "Nigeria" },
  { city: "Kano", state: "Kano", country: "Nigeria" },
  { city: "Bichi", state: "Kano", country: "Nigeria" },
  { city: "Gaya", state: "Kano", country: "Nigeria" },
  { city: "Rano", state: "Kano", country: "Nigeria" },
  { city: "Kaduna", state: "Kaduna", country: "Nigeria" },
  { city: "Zaria", state: "Kaduna", country: "Nigeria" },
  { city: "Kafanchan", state: "Kaduna", country: "Nigeria" },
  { city: "Enugu", state: "Enugu", country: "Nigeria" },
  { city: "Nsukka", state: "Enugu", country: "Nigeria" },
  { city: "Agbani", state: "Enugu", country: "Nigeria" },
  { city: "Awka", state: "Anambra", country: "Nigeria" },
  { city: "Onitsha", state: "Anambra", country: "Nigeria" },
  { city: "Nnewi", state: "Anambra", country: "Nigeria" },
  { city: "Ekwulobia", state: "Anambra", country: "Nigeria" },
  { city: "Umuahia", state: "Abia", country: "Nigeria" },
  { city: "Aba", state: "Abia", country: "Nigeria" },
  { city: "Ohafia", state: "Abia", country: "Nigeria" },
  { city: "Owerri", state: "Imo", country: "Nigeria" },
  { city: "Orlu", state: "Imo", country: "Nigeria" },
  { city: "Okigwe", state: "Imo", country: "Nigeria" },
  { city: "Asaba", state: "Delta", country: "Nigeria" },
  { city: "Warri", state: "Delta", country: "Nigeria" },
  { city: "Sapele", state: "Delta", country: "Nigeria" },
  { city: "Ughelli", state: "Delta", country: "Nigeria" },
  { city: "Benin City", state: "Edo", country: "Nigeria" },
  { city: "Auchi", state: "Edo", country: "Nigeria" },
  { city: "Ekpoma", state: "Edo", country: "Nigeria" },
  { city: "Uyo", state: "Akwa Ibom", country: "Nigeria" },
  { city: "Eket", state: "Akwa Ibom", country: "Nigeria" },
  { city: "Ikot Ekpene", state: "Akwa Ibom", country: "Nigeria" },
  { city: "Calabar", state: "Cross River", country: "Nigeria" },
  { city: "Ogoja", state: "Cross River", country: "Nigeria" },
  { city: "Abeokuta", state: "Ogun", country: "Nigeria" },
  { city: "Ijebu-Ode", state: "Ogun", country: "Nigeria" },
  { city: "Sagamu", state: "Ogun", country: "Nigeria" },
  { city: "Ilaro", state: "Ogun", country: "Nigeria" },
  { city: "Osogbo", state: "Osun", country: "Nigeria" },
  { city: "Ile-Ife", state: "Osun", country: "Nigeria" },
  { city: "Ilesa", state: "Osun", country: "Nigeria" },
  { city: "Akure", state: "Ondo", country: "Nigeria" },
  { city: "Ondo", state: "Ondo", country: "Nigeria" },
  { city: "Owo", state: "Ondo", country: "Nigeria" },
  { city: "Ado-Ekiti", state: "Ekiti", country: "Nigeria" },
  { city: "Ikere-Ekiti", state: "Ekiti", country: "Nigeria" },
  { city: "Ilorin", state: "Kwara", country: "Nigeria" },
  { city: "Offa", state: "Kwara", country: "Nigeria" },
  { city: "Minna", state: "Niger", country: "Nigeria" },
  { city: "Bida", state: "Niger", country: "Nigeria" },
  { city: "Suleja", state: "Niger", country: "Nigeria" },
  { city: "Jos", state: "Plateau", country: "Nigeria" },
  { city: "Bukuru", state: "Plateau", country: "Nigeria" },
  { city: "Bauchi", state: "Bauchi", country: "Nigeria" },
  { city: "Azare", state: "Bauchi", country: "Nigeria" },
  { city: "Maiduguri", state: "Borno", country: "Nigeria" },
  { city: "Biu", state: "Borno", country: "Nigeria" },
  { city: "Damaturu", state: "Yobe", country: "Nigeria" },
  { city: "Potiskum", state: "Yobe", country: "Nigeria" },
  { city: "Yola", state: "Adamawa", country: "Nigeria" },
  { city: "Mubi", state: "Adamawa", country: "Nigeria" },
  { city: "Jalingo", state: "Taraba", country: "Nigeria" },
  { city: "Wukari", state: "Taraba", country: "Nigeria" },
  { city: "Gombe", state: "Gombe", country: "Nigeria" },
  { city: "Kumo", state: "Gombe", country: "Nigeria" },
  { city: "Dutse", state: "Jigawa", country: "Nigeria" },
  { city: "Hadejia", state: "Jigawa", country: "Nigeria" },
  { city: "Katsina", state: "Katsina", country: "Nigeria" },
  { city: "Daura", state: "Katsina", country: "Nigeria" },
  { city: "Birnin Kebbi", state: "Kebbi", country: "Nigeria" },
  { city: "Argungu", state: "Kebbi", country: "Nigeria" },
  { city: "Sokoto", state: "Sokoto", country: "Nigeria" },
  { city: "Gusau", state: "Zamfara", country: "Nigeria" },
  { city: "Lafia", state: "Nasarawa", country: "Nigeria" },
  { city: "Keffi", state: "Nasarawa", country: "Nigeria" },
  { city: "Makurdi", state: "Benue", country: "Nigeria" },
  { city: "Gboko", state: "Benue", country: "Nigeria" },
  { city: "Otukpo", state: "Benue", country: "Nigeria" },
  { city: "Lokoja", state: "Kogi", country: "Nigeria" },
  { city: "Okene", state: "Kogi", country: "Nigeria" },
  { city: "Abakaliki", state: "Ebonyi", country: "Nigeria" },
  { city: "Yenagoa", state: "Bayelsa", country: "Nigeria" },
];

function filterLocations(query: string): Location[] {
  const normalized = query?.toLowerCase().trim();
  if (!normalized) return [];

  return nigerianLocations.filter(
    (loc) =>
      loc.city.toLowerCase().includes(normalized) ||
      loc.state.toLowerCase().includes(normalized)
  );
}

function formatLocation(loc: Location): string {
  return `${loc.city}, ${loc.state}, ${loc.country}`;
}

export default function LocationAutocomplete({ value, onChange }: LocationAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const suggestions = filterLocations(inputValue);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setHighlightedIndex(0);
  }, [inputValue]);

  function handleSelect(location: Location) {
    const formatted = formatLocation(location);
    setInputValue(formatted);
    onChange(formatted);
    setIsOpen(false);
  }

  function handleClear() {
    setInputValue("");
    onChange("");
    setIsOpen(false);
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev + 1) % suggestions.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
        break;
      case "Enter":
        e.preventDefault();
        handleSelect(suggestions[highlightedIndex]);
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  }

  return (
    <div ref={containerRef} className="relative w-full space-y-2">
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        <MapPin className="w-4 h-4 text-gray-500" />
        Location
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => inputValue && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="e.g., Lagos, Nigeria"
          className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400 text-gray-900"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              className="p-0.5 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
          <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-100">
            {suggestions.length} result{suggestions.length !== 1 ? "s" : ""}
          </div>
          {suggestions.map((location, index) => (
            <button
              key={`${location.city}-${location.state}-${index}`}
              type="button"
              onClick={() => handleSelect(location)}
              className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${
                index === highlightedIndex ? "bg-gray-50" : "hover:bg-gray-50"
              } ${index !== suggestions.length - 1 ? "border-b border-gray-50" : ""}`}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 text-gray-500" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {location.city}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {location.state}, {location.country}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No results */}
      {isOpen && inputValue && suggestions.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center">
          <MapPin className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No locations found</p>
          <p className="text-xs text-gray-400 mt-1">Try searching for a city or state</p>
        </div>
      )}
    </div>
  );
}