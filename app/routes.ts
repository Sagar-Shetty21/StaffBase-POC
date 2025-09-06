import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"), 
    route("employees","routes/employees-list.tsx"), 
    route("add","routes/add-employee.tsx"),
    route("employee/:id","routes/employee-detail.tsx"),
    route("employee/form/:id","routes/employee-detail-form.tsx")
] satisfies RouteConfig;
