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
