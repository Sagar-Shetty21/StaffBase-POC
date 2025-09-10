export interface Employee {
  id: string;
  name: string;
  email: string;
  department: Department;
  designation: string;
  joining_date: string;
  date_of_birth?: string;
  emergency_contact?: string;
  linkedin_profile?: string;
  employment_type?: EmploymentType;
  contract_end_date?: string | null;
  work_location?: WorkLocation;
  is_remote?: boolean;
  preferred_working_hours?: string;
  preferred_communication?: CommunicationMedium;
  skills?: string;
  performance_rating?: number;
  profile_picture?: File | string;
  bio?: string;
  notification_preferences?: NotificationPreference[];
}

export type EmploymentType =
  | "Full-time"
  | "Part-time"
  | "Contract"
  | "Intern"
  | "Consultant";

export type WorkLocation =
  | "New York Office"
  | "San Francisco Office"
  | "London Office"
  | "Bengaluru Office"
  | "Remote"
  | "Hybrid";

export type CommunicationMedium = "email" | "slack" | "phone" | "in-person";

export type NotificationPreference =
  | "email_notifications"
  | "sms_notifications"
  | "push_notifications"
  | "calendar_reminders";

export type Department =
  | "Engineering"
  | "Human Resources"
  | "Marketing"
  | "Sales"
  | "Finance"
  | "Design"
  | "Product"
  | "Operations";

export interface EmployeeResponse {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  items: Employee[];
}

export interface EmployeeProfileFormData {
  name: string;
  email: string;
  department: string;
  designation: string;
  joining_date: string;
  employment_type: string;
  skills: string[];
  bio: string;
  is_remote: boolean;
  preferred_working_hours: string;
  date_of_birth: string;
  emergency_contact: string;
  linkedin_profile: string;
  performance_rating: number;
  notification_preferences: string[];
  work_location: string;
  contract_end_date?: string;
  preferred_communication: string;
}
