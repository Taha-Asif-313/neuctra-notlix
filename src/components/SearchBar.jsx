import { Search, Filter } from "lucide-react";

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="relative mb-6">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search size={20} className="text-gray-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-sm pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition bg-white dark:bg-zinc-950 text-gray-900 dark:text-white"
        placeholder="Search notes..."
      />
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
        <button className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200">
          <Filter size={18} />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
