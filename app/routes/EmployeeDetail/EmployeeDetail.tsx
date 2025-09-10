import {
  deleteEmployeeById,
  fetchEmployeeById,
  updateEmployeeById,
} from "services/employees";
import styles from "./EmployeeDetail.module.scss";
import { useState } from "react";
import ImageInput from "components/Inputs/ImageInput";
import TextInput from "components/Inputs/TextInput";
import DateInput from "components/Inputs/DateInput";
import EmployeeExperienceForm from "components/Form/EmployeeExperienceForm";
import type { Route } from "./+types/EmployeeDetail";
import EmployeeProfileForm from "components/Form/EmployeeEditableForm";
import { toEmployee, toEmployeeProfileData } from "utils/helpers";
import type { Employee, EmployeeProfileFormData } from "types/employee";

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

  const handleUpdateSubmit = async (updatedData: EmployeeProfileFormData) => {
    try {
      const response = await updateEmployeeById(
        employee.id,
        toEmployee(updatedData)
      );
      if (response) {
        alert("Employee Updated successfully.");
        setIsUpdating(false);
      }
    } catch (err) {
      alert("Failed to update employee. Please try again.");
    }
  };

  const handleDelete = async () => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this employee?"
    );
    if (confirmation) {
      try {
        const response = await deleteEmployeeById(employee.id);
        if (response === undefined) {
          // Redirect to employee list page after successful deletion
          alert("Employee deleted successfully.");
          window.location.href = "/employees";
        }
      } catch (error) {
        alert("Failed to delete employee. Please try again.");
      }
    } else {
      return;
    }
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
      <EmployeeProfileForm
        isUpdating={isUpdating}
        initialData={toEmployeeProfileData(employee as Employee)}
        onSubmit={(data) => handleUpdateSubmit(data)}
      />

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
