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
    const validatedData = parseEmployeeForm(formData);
    const addEmployee = await postEmployee(validatedData);

    if (addEmployee) {
      // redirect with a Response
      return new Response(null, {
        status: 302,
        headers: { Location: `/employee/${addEmployee.id}` },
      });
    }

    return new Response(
      JSON.stringify({
        isSuccess: false,
        message: "Something went wrong. Please try again",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        isSuccess: false,
        message: getErrorMessage(err),
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
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
