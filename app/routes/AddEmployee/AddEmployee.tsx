import EmployeeForm from "components/Form/EmployeeForm";
import {
  Link,
  redirect,
  useActionData,
  useLoaderData,
  useSubmit,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router";
import styles from "./AddEmployee.module.scss";
import React from "react";
import { postEmployee } from "services/employees";
import { parseEmployeeForm } from "utils/validation/employee";
import { getErrorMessage, jsonToFormData } from "utils/helpers";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  try {
    const parsed = parseEmployeeForm(formData);
    const addEmployee = await postEmployee(formData);

    if (addEmployee) {
      return redirect(`/employee/${addEmployee.id}`);
      // return {isSuccess: true, message: "Successfully added employee", data: newEmployeeData}
    }
  } catch (err) {
    return { isSuccess: false, message: getErrorMessage(err) };
  }

  return {
    isSuccess: false,
    message: "Something went wrong. Please try again",
  };
}

export default function AddEmployee() {
  const submit = useSubmit();
  //   let actionResult = useActionData<typeof action>();
  //   const [result, setResult] = React.useState<typeof actionResult>();

  //   React.useEffect(() => {
  //     if (actionResult) {
  //       setResult(actionResult);
  //     }
  //   }, [actionResult]);

  return (
    <div>
      {/* SHOW SUCCESS MESSAGE IN SAME ROUTE */}
      {/* {result?.isSuccess ? (
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
        )} */}

      {/* REDIRECT TO DIFFERENT ROUTE */}
      <EmployeeForm
        onSubmit={(data) => submit({ ...data }, { method: "POST" })}
      />
    </div>
  );
}
