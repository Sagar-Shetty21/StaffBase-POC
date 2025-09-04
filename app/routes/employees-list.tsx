import EmployeeTable from "components/Table/EmployeeTable";
import type { Route } from "../+types/root";
import fs from 'fs/promises';
import type { Employee } from "types/employee";

export async function loader({ params }: Route.LoaderArgs) {
  const data = await fs.readFile('./data/employees.json', 'utf-8');
  const employees = JSON.parse(data);
  return employees as Employee[];
}

export default function EmployeesList({loaderData}: Route.ComponentProps ) {
  return (
    <div>
        <EmployeeTable data={loaderData ?? []}/>
    </div>
  );
}