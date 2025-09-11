import type { EmployeeResponse } from "types/employee";
import { generateAPIQueryForGlobalSearch } from "utils/helpers";

const API_BASE =
  (typeof process !== "undefined" && process.env?.BACKEND_API_URL_BASE) ||
  import.meta.env.VITE_BACKEND_API_URL_BASE ||
  "http://127.0.0.1:8090/api/";

export async function fetchEmployeesBasedGlobalSearchQuery(
  query: string
): Promise<EmployeeResponse> {
  const url = `${API_BASE}collections/employees/records?${generateAPIQueryForGlobalSearch(query)}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(
      `Failed to fetch employees: ${res.status} ${res.statusText}`
    );
  }

  return res.json();
}
