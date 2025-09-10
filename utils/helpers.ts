import type {
  CommunicationMedium,
  Department,
  Employee,
  EmployeeProfileFormData,
  EmploymentType,
  WorkLocation,
} from "types/employee";

export function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}

/**
 * Returns the first day of the current month as an ISO date string (YYYY-MM-DD).
 */
export function getFirstDayOfCurrentMonth(): string {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);

  // Format as YYYY-MM-DD
  return firstDay.toISOString().split("T")[0];
}

/**
 * Returns initials from a full name.
 * Example: "Linda Myers" -> "LM"
 */
export function getInitials(fullName: string): string {
  if (!fullName.trim()) return "";

  return fullName
    .trim()
    .split(/\s+/) // split by spaces (handles multiple spaces too)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

export function generateAPIQueryForGlobalSearch(search: string): string {
  // genrate query for global search
  // search in name, email, department, designation, skills
  // api is pocketbase
  // example query: (name~"john"||email~"john"||department~"john"||designation~"john"||skills~"john")
  const fields = ["name", "email", "department", "designation", "skills"];
  const query = fields
    .map((field) => `${field}~"${encodeURIComponent(search)}"`)
    .join("||");
  return `filter=(${query})&page=1&perPage=20`;
}

/**
 * Converts a Date object or ISO string to YYYY-MM-DD format
 * for use in HTML <input type="date">.
 */
export function formatDateForInput(date: Date | string): string {
  if (!date) return "";

  const d = typeof date === "string" ? new Date(date) : date;

  if (isNaN(d.getTime())) {
    console.warn("Invalid date passed to formatDateForInput:", date);
    return "";
  }

  return d.toISOString().split("T")[0]; // Extract YYYY-MM-DD
}

export function jsonToFormData(data: Record<string, any>): FormData {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    console.log(key, value, typeof value);
    if (value === undefined || value === null) {
      return; // skip empty
    }

    // ✅ Handle arrays (e.g., multi-select, checkboxes)
    if (Array.isArray(value)) {
      value.forEach((item) => formData.append(key, item));
      return;
    }

    // ✅ Handle File (or Blob)
    if (value instanceof File || value instanceof Blob) {
      formData.append(key, value);
      return;
    }

    // ✅ Handle booleans
    if (typeof value === "boolean") {
      formData.append(key, value ? "true" : "false");
      return;
    }

    // ✅ Handle everything else (string, number, etc.)
    formData.append(key, value.toString());
  });

  return formData;
}

export function toEmployeeProfileData(
  employee: Employee
): EmployeeProfileFormData {
  return {
    name: employee.name,
    email: employee.email,
    department: employee.department?.toString() ?? "",
    designation: employee.designation,
    joining_date: employee.joining_date,
    employment_type: employee.employment_type?.toString() ?? "",
    skills: employee.skills
      ? employee.skills.split(",").map((s) => s.trim())
      : [],
    bio: employee.bio ?? "",
    is_remote: employee.is_remote ?? false,
    preferred_working_hours: employee.preferred_working_hours ?? "",
    birth_date: employee.date_of_birth ?? "",
    emergency_contact: employee.emergency_contact ?? "",
    linkedin_profile: employee.linkedin_profile ?? "",
    performance_rating: employee.performance_rating ?? 0,
    notification_preferences: employee.notification_preferences
      ? employee.notification_preferences.map((p) => p.toString())
      : [],
    work_location: employee.work_location?.toString() ?? "",
    contract_end_date: employee.contract_end_date ?? undefined,
    preferred_communication: employee.preferred_communication?.toString() ?? "",
  };
}

export function toEmployee(
  data: EmployeeProfileFormData
): Omit<Employee, "id"> {
  return {
    name: data.name,
    email: data.email,
    department: data.department as Department,
    designation: data.designation,
    joining_date: data.joining_date,
    employment_type: data.employment_type as EmploymentType,
    skills: data.skills.length > 0 ? data.skills.join(", ") : undefined,
    bio: data.bio || undefined,
    is_remote: data.is_remote ?? false,
    preferred_working_hours: data.preferred_working_hours || undefined,
    date_of_birth: data.birth_date || undefined,
    emergency_contact: data.emergency_contact || undefined,
    linkedin_profile: data.linkedin_profile || undefined,
    performance_rating:
      data.performance_rating && data.performance_rating > 0
        ? data.performance_rating
        : undefined,
    notification_preferences:
      data.notification_preferences?.length > 0
        ? (data.notification_preferences as Employee["notification_preferences"])
        : [],
    work_location: data.work_location as WorkLocation,
    contract_end_date: data.contract_end_date || undefined,
    preferred_communication:
      data.preferred_communication as CommunicationMedium,
  };
}

export const formatDate = (date: string | Date) => {
  const d = new Date(date);
  // Use consistent formatting that works on both server and client
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};
