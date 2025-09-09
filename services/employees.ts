import type { Employee, EmployeeResponse } from "types/employee";

const API_BASE =
  (typeof process !== "undefined" && process.env?.POCKETBASE_URL) ||
  "http://127.0.0.1:8090/api/";

export async function fetchEmployees(
  page = 1,
  perPage = 20
): Promise<EmployeeResponse> {
  const url = `${API_BASE}collections/employees/records?page=${page}&perPage=${perPage}`;

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

export async function postEmployee(employee: FormData): Promise<Employee> {
  const url = `${API_BASE}collections/employees/records`;

  const res = await fetch(url, {
    method: "POST",
    body: employee,
  });

  if (!res.ok) {
    throw new Error(`Failed to post employee: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function fetchEmployeeById(id: string): Promise<Employee> {
  const url = `${API_BASE}collections/employees/records/${id}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(
      `Failed to fetch employee ${id}: ${res.status} ${res.statusText}`
    );
  }

  return res.json();
}
