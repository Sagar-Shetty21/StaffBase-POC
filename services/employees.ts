import type { Employee, EmployeeResponse } from "types/employee";

const API_BASE =
  (typeof process !== "undefined" && process.env?.BACKEND_API_URL_BASE) ||
  import.meta.env.VITE_BACKEND_API_URL_BASE ||
  "http://127.0.0.1:8090/api/";
console.log(API_BASE);

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

export async function postEmployee(
  employee: Omit<Employee, "id">
): Promise<Employee> {
  const url = `${API_BASE}collections/employees/records`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(employee),
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

export async function updateEmployeeById(
  id: string,
  updatedData: Partial<Employee>
): Promise<Employee> {
  const url = `${API_BASE}collections/employees/records/${id}`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  });
  if (!res.ok) {
    throw new Error(
      `Failed to update employee ${id}: ${res.status} ${res.statusText}`
    );
  }
  return res.json();
}

export async function deleteEmployeeById(id: string): Promise<void> {
  const url = `${API_BASE}collections/employees/records/${id}`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error(
      `Failed to delete employee ${id}: ${res.status} ${res.statusText}`
    );
  }
  return;
}
