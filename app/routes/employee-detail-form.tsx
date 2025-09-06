import { fetchEmployeeById } from "services/employees";
import type { Route } from "./+types/employee-detail-form";

export async function loader({params}: Route.LoaderArgs) {
    const employeeId = params.id;
    if(employeeId){
      const employeeData = await fetchEmployeeById(employeeId)

      return {isSuccess: true, message: "Employee data fetched successfully!", data: employeeData};
    }

    return  {isSuccess: false, message: 'No Employee found with provided ID!', data: null};
}

export default function EmployeeDetailForm({loaderData}: Route.ComponentProps) {
    const { data: employee } = loaderData;
    return (
        <div>
            {employee?.name}
        </div>
    );
}