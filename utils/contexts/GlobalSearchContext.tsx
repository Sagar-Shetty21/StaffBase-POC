import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

type GlobalSearchContextType = {
  search: string;
  isActive: boolean;
  setIsActive: (value: boolean) => void;
  setSearch: (value: string) => void;
};

const GlobalSearchContext = createContext<GlobalSearchContextType | undefined>(
  undefined
);

export function GlobalSearchProvider({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState("");
  const [isActive, setIsActive] = useState(false);

  const value = React.useMemo(
    () => ({
      search,
      isActive,
      setIsActive,
      setSearch,
    }),
    [search, isActive]
  );

  return (
    <GlobalSearchContext.Provider value={value}>
      {children}
    </GlobalSearchContext.Provider>
  );
}

export function useGlobalSearch() {
  const context = useContext(GlobalSearchContext);
  if (!context) {
    throw new Error(
      "useGlobalSearch must be used within a GlobalSearchProvider"
    );
  }
  return context;
}

export function useGlobalSearchSSR() {
  if (typeof window === "undefined") {
    // Return default values during SSR
    return {
      search: "",
      isActive: false,
      setIsActive: () => {},
      setSearch: () => {},
    };
  }

  const context = useContext(GlobalSearchContext);
  if (context === undefined) {
    throw new Error(
      "useGlobalSearchSSR must be used within a GlobalSearchProvider"
    );
  }
  return context;
}
