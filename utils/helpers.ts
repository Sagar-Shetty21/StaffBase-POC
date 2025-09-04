import type { Employee } from "types/employee";
import fs from 'fs/promises';

export function getNextEmployeeId(employees: Employee[]): number {
  if (employees.length === 0) {
    return 1; // start from 1 if no employees
  }

  const lastEmployee = employees[employees.length - 1];
  return lastEmployee.id + 1;
}

export async function addEmployeeToFile(
  filePath: string,
  newEmployee: Omit<Employee, "id">
): Promise<Employee> {
  try {
    // read file
    const data = await fs.readFile(filePath, "utf-8");
    const employees: Employee[] = JSON.parse(data);

    // generate new id
    const maxId = getNextEmployeeId(employees)
    const employee: Employee = { id: maxId, ...newEmployee };

    // push and write back
    employees.push(employee);
    await fs.writeFile(filePath, JSON.stringify(employees, null, 2), "utf-8");

    return employee;
  } catch (err) {
    console.error("Error adding employee:", err);
    throw err;
  }
}
