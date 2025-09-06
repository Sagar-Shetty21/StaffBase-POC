import { fetchEmployeeById } from "services/employees";
import type { Route } from "./+types/employee-detail";
import styles from "./employee-detail.module.scss"
import { useState } from "react";
import ImageInput from "components/Inputs/ImageInput";
import TextInput from "components/Inputs/TextInput";
import DateInput from "components/Inputs/DateInput";

export async function loader({params}: Route.LoaderArgs) {
    const employeeId = params.id;
    if(employeeId){
      const employeeData = await fetchEmployeeById(employeeId)

      return {isSuccess: true, message: "Employee data fetched successfully!", data: employeeData};
    }

    return  {isSuccess: false, message: 'No Employee found with provided ID!', data: null};
}

export async function action() {}

export default function EmployeeDetail({loaderData}: Route.ComponentProps) {
  const { data: employee } = loaderData;
  const [copied, setCopied] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false)

  if (!employee) {
    return <div className={styles.error}>No Employee Found!</div>;
  }

  const handleCopyLink = async () => {
    const link = `${window.location.origin}/employee/${employee.id}/form`;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUpdate = () => {
    setIsUpdating(true)
  };

  const handleCancelUpdate = () => {
    setIsUpdating(false)
  }

  const handleDelete = () => {
    // trigger delete logic
    alert("Delete employee clicked!");
  };

  return (
    <div className={styles.container}>
      {/* Header Actions */}
      <div className={styles.header}>
        <h2>Employee Details</h2>
        <div className={styles.actions}>
          {isUpdating ? (
            <button onClick={handleCancelUpdate} className={styles.updateCancelBtn}>
              Cancel
            </button>
          ) : (
            <button onClick={handleUpdate} className={styles.updateBtn}>
              Update
            </button>
          )}
          <button onClick={handleDelete} className={styles.deleteBtn}>
            Delete
          </button>
        </div>
      </div>

      {/* Top Section */}
      <div className={styles.topSection}>
        <div className={styles.imageWrapper}>
          <ImageInput isDisabled={!isUpdating}/>
        </div>

        <div className={styles.primaryDetails}>
          <TextInput label="Name" onChange={() => {}} value={employee.name} isDisabled={!isUpdating}>
            <h3>{employee.name}</h3>
            </TextInput>
            <TextInput label="Email" onChange={() => {}} value={employee.email} isDisabled={!isUpdating}>
              <p><strong>Email:</strong> {employee.email}</p>
            </TextInput>
            <TextInput label="Department" onChange={() => {}} value={employee.department} isDisabled={!isUpdating}>
              <p><strong>Department:</strong> {employee.department}</p>
            </TextInput>
            <TextInput label="Designation" onChange={() => {}} value={employee.designation} isDisabled={!isUpdating}>
              <p><strong>Designation:</strong> {employee.designation}</p>
            </TextInput>
            <DateInput label="Joining Date" onChange={() => {}} value={employee.joining_date} isDisabled={!isUpdating}>
              <p>
                <strong>Joining Date:</strong>{" "}
                {new Date(employee.joining_date).toLocaleDateString()}
              </p>
            </DateInput>
        </div>
      </div>

      {/* Additional Details */}
      <div className={styles.additionalDetails}>
        <h3>Additional Details</h3>
        <div className={styles.section}>
          <h4>Experience</h4>
          <p>{"Not provided"}</p>
        </div>

        <div className={styles.section}>
          <h4>Skills</h4>
          <p>{ "Not provided"}</p>
        </div>

        <div className={styles.section}>
          <h4>Projects</h4>
          <p>{"Not provided"}</p>
        </div>

        <button onClick={handleCopyLink} className={styles.copyBtn}>
          {copied ? "Copied!" : "Copy Form Link"}
        </button>
      </div>
    </div>
  );
}