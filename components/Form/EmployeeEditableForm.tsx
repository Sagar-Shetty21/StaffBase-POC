import React, { useState, useEffect } from "react";
import styles from "./EmployeeEditableForm.module.scss";
import TextInput from "components/Inputs/TextInput";
import DateInput from "components/Inputs/DateInput";
import type { EmployeeProfileFormData } from "types/employee";
import { departments, employmentTypes, workLocations } from "utils/constants";

interface EmployeeProfileFormProps {
  initialData?: Partial<EmployeeProfileFormData>;
  isUpdating?: boolean;
  onSubmit?: (data: EmployeeProfileFormData) => void;
  onCancel?: () => void;
}

const communicationMethods = [
  { value: "email", label: "Email" },
  { value: "slack", label: "Slack" },
  { value: "phone", label: "Phone" },
  { value: "in-person", label: "In-Person" },
];

const notificationOptions = [
  { value: "email_notifications", label: "Email Notifications" },
  { value: "sms_notifications", label: "SMS Notifications" },
  { value: "push_notifications", label: "Push Notifications" },
  { value: "calendar_reminders", label: "Calendar Reminders" },
];

export default function EmployeeProfileForm({
  initialData = {},
  isUpdating = false,
  onSubmit,
  onCancel,
}: EmployeeProfileFormProps) {
  const [formData, setFormData] = useState<EmployeeProfileFormData>({
    name: "",
    email: "",
    department: "",
    designation: "",
    joining_date: "",
    employment_type: "Full-time",
    skills: [],
    bio: "",
    is_remote: false,
    preferred_working_hours: "",
    date_of_birth: "",
    emergency_contact: "",
    linkedin_profile: "",
    performance_rating: 5,
    notification_preferences: [],
    work_location: "",
    contract_end_date: "",
    preferred_communication: "email",
    ...initialData,
  });

  const [newSkill, setNewSkill] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: keyof EmployeeProfileFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddSkill = () => {
    if (!newSkill.trim() || !isUpdating) return;

    const skillExists = formData.skills.some(
      (skill) => skill.toLowerCase() === newSkill.trim().toLowerCase()
    );

    if (!skillExists) {
      updateField("skills", [...formData.skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    if (!isUpdating) return;
    updateField(
      "skills",
      formData.skills.filter((skill) => skill !== skillToRemove)
    );
  };

  const handleNotificationToggle = (preference: string) => {
    if (!isUpdating) return;

    const current = formData.notification_preferences;
    const updated = current.includes(preference)
      ? current.filter((p) => p !== preference)
      : [...current, preference];
    updateField("notification_preferences", updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isUpdating || !onSubmit) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (time: string) => {
    if (!time) return "";
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGrid}>
        {/* Personal Information Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Personal Information</h2>

          <TextInput
            label="Full Name"
            value={formData.name}
            onChange={(value) => updateField("name", value)}
            isDisabled={!isUpdating}
          />

          <TextInput
            label="Email Address"
            value={formData.email}
            onChange={(value) => updateField("email", value)}
            isDisabled={!isUpdating}
          />

          <div className={styles.formRow}>
            <DateInput
              label="Date of Birth"
              value={formData.date_of_birth}
              onChange={(value) => updateField("date_of_birth", value)}
              isDisabled={!isUpdating}
            />

            <TextInput
              label="Emergency Contact"
              value={formData.emergency_contact}
              onChange={(value) => updateField("emergency_contact", value)}
              isDisabled={!isUpdating}
            />
          </div>

          <TextInput
            label="LinkedIn Profile"
            value={formData.linkedin_profile}
            onChange={(value) => updateField("linkedin_profile", value)}
            isDisabled={!isUpdating}
          />
        </div>

        {/* Professional Information Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Professional Information</h2>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Department</label>
              {isUpdating ? (
                <select
                  value={formData.department}
                  onChange={(e) => updateField("department", e.target.value)}
                  className={styles.select}
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              ) : (
                <div className={styles.readOnlyValue}>
                  {formData.department || "Not specified"}
                </div>
              )}
            </div>

            <TextInput
              label="Job Title"
              value={formData.designation}
              onChange={(value) => updateField("designation", value)}
              isDisabled={!isUpdating}
            />
          </div>

          <div className={styles.formRow}>
            <DateInput
              label="Joining Date"
              value={formData.joining_date}
              onChange={(value) => updateField("joining_date", value)}
              isDisabled={!isUpdating}
            />

            <div className={styles.formGroup}>
              <label className={styles.label}>Employment Type</label>
              {isUpdating ? (
                <div className={styles.radioGroup}>
                  {employmentTypes.map((type) => (
                    <label key={type} className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="employment_type"
                        value={type}
                        checked={formData.employment_type === type}
                        onChange={(e) =>
                          updateField("employment_type", e.target.value)
                        }
                        className={styles.radio}
                      />
                      <span className={styles.radioCustom}></span>
                      {type}
                    </label>
                  ))}
                </div>
              ) : (
                <div className={styles.readOnlyValue}>
                  {formData.employment_type}
                </div>
              )}
            </div>
          </div>

          {formData.employment_type === "Contract" && (
            <DateInput
              label="Contract End Date"
              value={formData.contract_end_date || ""}
              onChange={(value) => updateField("contract_end_date", value)}
              isDisabled={!isUpdating}
            />
          )}
        </div>

        {/* Work Preferences Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Work Preferences</h2>

          <div className={styles.formGroup}>
            <label className={styles.label}>Work Location</label>
            {isUpdating ? (
              <select
                value={formData.work_location}
                onChange={(e) => updateField("work_location", e.target.value)}
                className={styles.select}
              >
                <option value="">Select Location</option>
                {workLocations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            ) : (
              <div className={styles.readOnlyValue}>
                {formData.work_location || "Not specified"}
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={formData.is_remote}
                onChange={(e) => updateField("is_remote", e.target.checked)}
                className={styles.checkbox}
                disabled={!isUpdating}
              />
              <span className={styles.checkboxCustom}></span>
              Available for Remote Work
            </label>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Preferred Working Hours</label>
            {isUpdating ? (
              <input
                type="time"
                value={formData.preferred_working_hours}
                onChange={(e) =>
                  updateField("preferred_working_hours", e.target.value)
                }
                className={styles.input}
              />
            ) : (
              <div className={styles.readOnlyValue}>
                {formData.preferred_working_hours
                  ? formatTime(formData.preferred_working_hours)
                  : "Not specified"}
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Preferred Communication Method
            </label>
            {isUpdating ? (
              <div className={styles.radioGroup}>
                {communicationMethods.map((method) => (
                  <label key={method.value} className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="preferred_communication"
                      value={method.value}
                      checked={
                        formData.preferred_communication === method.value
                      }
                      onChange={(e) =>
                        updateField("preferred_communication", e.target.value)
                      }
                      className={styles.radio}
                    />
                    <span className={styles.radioCustom}></span>
                    {method.label}
                  </label>
                ))}
              </div>
            ) : (
              <div className={styles.readOnlyValue}>
                {communicationMethods.find(
                  (m) => m.value === formData.preferred_communication
                )?.label || "Email"}
              </div>
            )}
          </div>
        </div>

        {/* Skills & Performance Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Skills & Performance</h2>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Skills ({formData.skills.length}{" "}
              {formData.skills.length === 1 ? "skill" : "skills"})
            </label>

            {isUpdating && (
              <div className={styles.inputRow}>
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className={styles.input}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), handleAddSkill())
                  }
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className={styles.addButton}
                  disabled={!newSkill.trim()}
                >
                  +
                </button>
              </div>
            )}

            <div className={styles.skillsList}>
              {formData.skills.map((skill) => (
                <span key={skill} className={styles.skillTag}>
                  {skill}
                  {isUpdating && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className={styles.removeSkill}
                      aria-label={`Remove ${skill}`}
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
              {formData.skills.length === 0 && (
                <div className={styles.emptyState}>No skills added</div>
              )}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Performance Rating:
              <span className={styles.ratingValue}>
                {formData.performance_rating}/10
              </span>
            </label>
            {isUpdating ? (
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={formData.performance_rating}
                onChange={(e) =>
                  updateField("performance_rating", parseInt(e.target.value))
                }
                className={styles.range}
              />
            ) : (
              <div className={styles.ratingDisplay}>
                <div className={styles.ratingBar}>
                  <div
                    className={styles.ratingFill}
                    style={{
                      width: `${(formData.performance_rating / 10) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            )}
            <div className={styles.rangeLabels}>
              <span>Needs Improvement</span>
              <span>Excellent</span>
            </div>
          </div>
        </div>

        {/* Additional Information Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Additional Information</h2>

          <div className={styles.formGroup}>
            <label className={styles.label}>Bio / About</label>
            {isUpdating ? (
              <textarea
                value={formData.bio}
                onChange={(e) => updateField("bio", e.target.value)}
                rows={4}
                className={styles.textarea}
              />
            ) : (
              <div className={styles.readOnlyTextarea}>
                {formData.bio || "No bio provided"}
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Notification Preferences (
              {formData.notification_preferences.length} selected)
            </label>
            <div className={styles.notificationGrid}>
              {notificationOptions.map((option) => (
                <label key={option.value} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.notification_preferences.includes(
                      option.value
                    )}
                    onChange={() => handleNotificationToggle(option.value)}
                    className={styles.checkbox}
                    disabled={!isUpdating}
                  />
                  <span className={styles.checkboxCustom}></span>
                  {option.label}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isUpdating && (
        <div className={styles.submitSection}>
          <button
            type="button"
            onClick={onCancel}
            className={styles.cancelButton}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`${styles.submitButton} ${isSubmitting ? styles.loading : ""}`}
          >
            {isSubmitting ? (
              <>
                <div className={styles.spinner}></div>
                Updating...
              </>
            ) : (
              <>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="m19 8 2 2-2 2"></path>
                  <path d="m17 10 4 0"></path>
                </svg>
                Update Profile
              </>
            )}
          </button>
        </div>
      )}
    </form>
  );
}
