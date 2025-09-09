import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { fetchEmployeesBasedGlobalSearchQuery } from "services/global-search";

export const useEmployeeSearch = (search: string) => {
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); // debounce delay in ms

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  return useQuery({
    queryKey: ["employees", debouncedSearch],
    queryFn: async () => {
      const data = await fetchEmployeesBasedGlobalSearchQuery(debouncedSearch);
      return data?.items ?? [];
    },
    enabled: !!debouncedSearch,
  });
};
