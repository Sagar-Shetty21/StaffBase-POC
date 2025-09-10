import type { EmployeeResponse } from "types/employee";
import { getFirstDayOfCurrentMonth } from "utils/helpers";

const API_BASE =
  (typeof process !== "undefined" && process.env?.BACKEND_API_URL_BASE) ||
  import.meta.env.VITE_BACKEND_API_URL_BASE ||
  "http://127.0.0.1:8090/api/";
console.log(API_BASE);

export async function fetchEmployeePaginationData(): Promise<EmployeeResponse> {
  const url = `${API_BASE}collections/employees/records?page=1&perPage=1`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(
      `Failed to fetch employee pagination data: ${res.status} ${res.statusText}`
    );
  }

  return res.json();
}

export async function fetchRecentlyAddedEmployees(): Promise<EmployeeResponse> {
  const url = `${API_BASE}collections/employees/records?sort=-created&page=1&perPage=5`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(
      `Failed to fetch recently added employees: ${res.status} ${res.statusText}`
    );
  }

  return res.json();
}

export async function fetchEmployeesAddedThisMonth(): Promise<EmployeeResponse> {
  const url = `${API_BASE}collections/employees/records?filter=created>="${getFirstDayOfCurrentMonth()}"&page=1&perPage=1`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(
      `Failed to fetch employees added this month: ${res.status} ${res.statusText}`
    );
  }

  return res.json();
}
