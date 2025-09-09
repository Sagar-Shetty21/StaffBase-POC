import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/Home/Home.tsx"),
  route("employees", "routes/EmployeesList/EmployeesList.tsx"),
  route("add", "routes/AddEmployee/AddEmployee.tsx"),
  route("employee/:id", "routes/EmployeeDetail/EmployeeDetail.tsx"),
] satisfies RouteConfig;
