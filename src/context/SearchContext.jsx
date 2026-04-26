import { createContext, useContext, useMemo, useState } from "react";

const SearchContext = createContext(null);

export const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const value = useMemo(
    () => ({ searchTerm, setSearchTerm }),
    [searchTerm]
  );

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be used within a SearchProvider");
  return ctx;
};

