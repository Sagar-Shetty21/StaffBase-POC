import type {
  CommunicationMedium,
  Department,
  Employee,
  EmploymentType,
  NotificationPreference,
  WorkLocation,
} from "types/employee";

export function parseEmployeeForm(formData: FormData): Omit<Employee, "id"> {
  // Mandatory fields
  const requiredFields = [
    "name",
    "email",
    "department",
    "designation",
    "joining_date",
  ] as const;

  for (const field of requiredFields) {
    if (!formData.get(field)) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  // Extract values
  const employee: Omit<Employee, "id"> = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    department: formData.get("department") as Department,
    designation: formData.get("designation") as string,
    joining_date: formData.get("joining_date") as string,

    date_of_birth: formData.get("date_of_birth") as string | undefined,
    emergency_contact: formData.get("emergency_contact") as string | undefined,
    linkedin_profile: formData.get("linkedin_profile") as string | undefined,

    employment_type: formData.get("employment_type") as
      | EmploymentType
      | undefined,
    contract_end_date:
      (formData.get("contract_end_date") as string) || undefined,
    work_location: formData.get("work_location") as WorkLocation | undefined,
    is_remote: formData.get("is_remote") === "true",

    preferred_working_hours: formData.get("preferred_working_hours") as
      | string
      | undefined,
    preferred_communication: formData.get("preferred_communication") as
      | CommunicationMedium
      | undefined,

    skills: formData.get("skills") as string | undefined,
    performance_rating: formData.get("performance_rating")
      ? Number(formData.get("performance_rating"))
      : undefined,
    bio: formData.get("bio") as string | undefined,

    notification_preferences: (() => {
      const prefs = formData.get("notification_preferences") as string;
      if (!prefs) return [];

      return prefs
        .split(",")
        .filter((v): v is NotificationPreference =>
          [
            "email_notifications",
            "sms_notifications",
            "push_notifications",
            "calendar_reminders",
          ].includes(v.trim())
        );
    })(),

    profile_picture:
      (formData.get("profile_picture") as File | null) || undefined,
  };

  // Remove undefined keys
  return Object.fromEntries(
    Object.entries(employee).filter(([_, v]) => v !== undefined)
  ) as Omit<Employee, "id">;
}
