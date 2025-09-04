export interface Employee {
    id: number,
    name: string,
    email: string,
    department: string,
    designation: string,
    joining_date: string,
}

export interface EmployeeResponse {
  page: number
  perPage: number
  totalItems: number
  totalPages: number
  items: Employee[]
}