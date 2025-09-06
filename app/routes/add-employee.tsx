import EmployeeForm from "components/Form/EmployeeForm";
import { Link, useActionData, useLoaderData, useSubmit, type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import styles from './add-employee.module.scss';
import React from "react";
import { postEmployee } from "services/employees";

export async function action({request}: ActionFunctionArgs) {
  const formData = await request.formData();
  
  const name = formData.get("name");
  const email = formData.get("email")
  const department = formData.get("department")
  const designation = formData.get("designation")
  const joiningDate = formData.get("joining_date")

  if(!name || !email || !department || !designation || !joiningDate){
    return {isSuccess: false, message: "All fields are required!"}
  }

  const newEmployeeData = {
    name: name as string,
    email: email as string,
    department: department as string,
    designation: designation as string,
    joining_date: joiningDate as string
  }

  const addEmployee = await postEmployee(newEmployeeData)

  if(addEmployee){
    return {isSuccess: true, message: "Successfully added employee", data: newEmployeeData}
  }

  return {isSuccess: false, message: "Something went wrong. Please try again"}
}

export default function AddEmployee() {
  const submit = useSubmit();
  let actionResult = useActionData<typeof action>();
  const [result, setResult] = React.useState<typeof actionResult>();

  React.useEffect(() => {
    if (actionResult) {
      setResult(actionResult);
    }
  }, [actionResult]);

  return (
    <div>
        {result?.isSuccess ? (
          <div className={styles.container}>
            <div className={styles.title}>Employee added Successfully</div>
            <div className={styles.details}>
              <div>Name: {result.data?.name}</div>
              <div>Email: {result.data?.email}</div>
              <div>Department: {result.data?.department}</div>
              <div>Designation: {result.data?.designation}</div>
              <div>Joining Date: {result.data?.joining_date}</div>
            </div>
            <div className={styles.btnContainer}>
              <button onClick={() => setResult(undefined)}>Add Another Employee</button>
            </div>
          </div>
        ): (
          <EmployeeForm onSubmit={(data)=> submit({...data}, {method: "POST"})} />
        )}
    </div>
  );
}