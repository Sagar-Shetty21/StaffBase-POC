import { fetchEmployeeById } from "services/employees";
import styles from "./EmployeeDetail.module.scss";
import { useState } from "react";
import ImageInput from "components/Inputs/ImageInput";
import TextInput from "components/Inputs/TextInput";
import DateInput from "components/Inputs/DateInput";
import EmployeeExperienceForm from "components/Form/EmployeeExperienceForm";
import type { Route } from "./+types/EmployeeDetail";

export async function loader({ params }: Route.LoaderArgs) {
  const employeeId = params.id;
  if (employeeId) {
    const employeeData = await fetchEmployeeById(employeeId);

    return {
      isSuccess: true,
      message: "Employee data fetched successfully!",
      data: employeeData,
    };
  }

  return {
    isSuccess: false,
    message: "No Employee found with provided ID!",
    data: null,
  };
}

export async function action() {}

export default function EmployeeDetail({ loaderData }: Route.ComponentProps) {
  const { data: employee } = loaderData;
  const [isUpdating, setIsUpdating] = useState(false);

  if (!employee) {
    return <div className={styles.error}>No Employee Found!</div>;
  }

  const handleUpdate = () => {
    setIsUpdating(true);
  };

  const handleCancelUpdate = () => {
    setIsUpdating(false);
  };

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
            <button
              onClick={handleCancelUpdate}
              className={styles.updateCancelBtn}
            >
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
        <div className={styles.imageNameWrapper}>
          {/* <ImageInput isDisabled={!isUpdating} /> */}
          <TextInput
            label="Name"
            onChange={() => {}}
            value={employee.name}
            isDisabled={!isUpdating}
          />
        </div>

        <div className={styles.primaryDetails}>
          <div className={styles.formRow}>
            <TextInput
              label="Email"
              onChange={() => {}}
              value={employee.email}
              isDisabled={!isUpdating}
            />
            <TextInput
              label="Department"
              onChange={() => {}}
              value={employee.department}
              isDisabled={!isUpdating}
            />
          </div>
          <div className={styles.formRow}>
            <DateInput
              label="Joining Date"
              onChange={() => {}}
              value={employee.joining_date}
              isDisabled={!isUpdating}
            />
            <TextInput
              label="Designation"
              onChange={() => {}}
              value={employee.designation}
              isDisabled={!isUpdating}
            />
          </div>
          <hr className={styles.customHorizontalRule} />
          <div className={styles.formRow}>
            <DateInput
              label="Date of Birth"
              onChange={() => {}}
              value={employee.date_of_birth || ""}
              isDisabled={!isUpdating}
            />
            <TextInput
              label="Emergency Contact"
              onChange={() => {}}
              value={employee.emergency_contact || ""}
              isDisabled={!isUpdating}
            />
          </div>
          <TextInput
            label="LinkedIn Profile"
            onChange={() => {}}
            value={employee.linkedin_profile || ""}
            isDisabled={!isUpdating}
          />
        </div>
      </div>

      {/* Additional Details */}
      <div className={styles.additionalDetails}>
        <h3>Additional Details</h3>
        <div className={styles.section}>
          <EmployeeExperienceForm
            isEditing={isUpdating}
            experiences={[]}
            onUpdate={(updatedExperiences) => {
              // Handle the updated experiences
            }}
          />
        </div>
      </div>
    </div>
  );
}
