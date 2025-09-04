import EmployeeTable from "components/Table/EmployeeTable";
import type { Route } from "../+types/root";
import { fetchEmployees } from "services/employees";
import { useLoaderData } from "react-router";

export async function loader({ params }: Route.LoaderArgs) {
  try {
    const employees = await fetchEmployees(1, 10)
    console.log(employees)
    return  {isSuccess: true, message: "Employees fetched successfully!", data: employees}
  } catch (err) {
    return {isSuccess: false, message: "Failed to fetch employees!", data: null}
  }
}

export default function EmployeesList() {
  const loaderData = useLoaderData<typeof loader>();
  
  return (
    <div>
        <EmployeeTable data={loaderData?.data?.items ?? []}/>
    </div>
  );
}