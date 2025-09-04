import type { Route } from "./+types/employee-detail";

export async function loader({params}: Route.LoaderArgs) {
    const employeeId = params.id;
    return  {employeeId };
}

export async function action() {}

export default function EmployeeDetail({loaderData}: Route.ComponentProps) {
  return <div>Employee Detail Page! Employee Id: {loaderData.employeeId}</div>;
}