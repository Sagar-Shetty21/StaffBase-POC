import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import styles from "./EmployeeForm.module.scss";
import RadioOption from "components/Inputs/RadioOption";
import ImageInput from "components/Inputs/ImageInput";
import { departments, employmentTypes, workLocations } from "utils/constants";

interface EmployeeFormData {
  name: string;
  email: string;
  department: string;
  designation: string;
  joining_date: string;
  employment_type: string;
  new_skill_temp: string;
  skills: string[];
  bio: string;
  is_remote: boolean;
  preferred_working_hours: string;
  birth_date: string;
  emergency_contact: string;
  linkedin_profile: string;
  performance_rating: number;
  notification_preferences: string[];
  work_location: string;
  contract_end_date?: string;
  preferred_communication: string;
}

interface EmployeeFormProps {
  onSubmit: (data: EmployeeFormData) => void;
}

export default function EmployeeForm({ onSubmit }: EmployeeFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
    setValue,
    getValues,
    trigger,
  } = useForm<EmployeeFormData>({
    defaultValues: {
      is_remote: false,
      employment_type: "Full-time",
      skills: [],
      notification_preferences: [],
      performance_rating: 5,
      preferred_communication: "email",
    },
  });

  const employmentType = watch("employment_type");
  const isRemote = watch("is_remote");
  const skillsValue = watch("skills") || [];
  const notificationPrefs = watch("notification_preferences") || [];
  const performanceRating = watch("performance_rating");
  const newSkillTemp = watch("new_skill_temp") || "";

  const handleFormSubmit = (data: EmployeeFormData) => {
    // Convert to FormData-compatible format for the action function
    const formattedData = {
      ...data,
      skills: Array.isArray(data.skills) ? data.skills : [],
      notification_preferences: Array.isArray(data.notification_preferences)
        ? data.notification_preferences
        : [],
    };

    onSubmit(formattedData);
  };

  const handleAddSkill = async () => {
    const newSkill = getValues("new_skill_temp");

    // Check if skill is empty
    if (!newSkill || !newSkill.trim()) {
      return;
    }

    const currentSkills = skillsValue;
    const alreadyExists = currentSkills.some(
      (s) => s.toLowerCase() === newSkill.trim().toLowerCase()
    );

    if (alreadyExists) {
      return;
    }

    const updatedSkills = [...currentSkills, newSkill.trim()];
    setValue("skills", updatedSkills);
    setValue("new_skill_temp", "");
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission
      handleAddSkill();
    }
  };

  const handleNotificationToggle = (preference: string) => {
    const current = notificationPrefs;
    const updated = current.includes(preference)
      ? current.filter((p) => p !== preference)
      : [...current, preference];
    setValue("notification_preferences", updated);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.form}>
      <div className={styles.formGrid}>
        {/* Personal Information Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Personal Information</h2>

          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              Full Name *
            </label>
            <input
              id="name"
              type="text"
              data-testid="employee-name"
              className={`${styles.input} ${errors.name ? styles.error : ""}`}
              {...register("name", {
                required: "Full name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
              })}
              placeholder="Enter full name"
            />
            {errors.name && (
              <span className={styles.errorText}>{errors.name.message}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email Address *
            </label>
            <input
              id="email"
              type="email"
              className={`${styles.input} ${errors.email ? styles.error : ""}`}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              placeholder="john.doe@company.com"
            />
            {errors.email && (
              <span className={styles.errorText}>{errors.email.message}</span>
            )}
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="birth_date" className={styles.label}>
                Date of Birth
              </label>
              <input
                id="birth_date"
                type="date"
                className={styles.input}
                {...register("birth_date")}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="emergency_contact" className={styles.label}>
                Emergency Contact
              </label>
              <input
                id="emergency_contact"
                type="tel"
                className={styles.input}
                {...register("emergency_contact")}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="linkedin_profile" className={styles.label}>
              LinkedIn Profile
            </label>
            <input
              id="linkedin_profile"
              type="url"
              className={styles.input}
              {...register("linkedin_profile")}
              placeholder="https://linkedin.com/in/johndoe"
            />
          </div>
        </div>

        {/* Professional Information Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Professional Information</h2>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="department" className={styles.label}>
                Department *
              </label>
              <select
                id="department"
                className={`${styles.select} ${errors.department ? styles.error : ""}`}
                {...register("department", {
                  required: "Department is required",
                })}
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              {errors.department && (
                <span className={styles.errorText}>
                  {errors.department.message}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="designation" className={styles.label}>
                Job Title *
              </label>
              <input
                id="designation"
                type="text"
                className={`${styles.input} ${errors.designation ? styles.error : ""}`}
                {...register("designation", {
                  required: "Job title is required",
                })}
                placeholder="Senior Software Engineer"
              />
              {errors.designation && (
                <span className={styles.errorText}>
                  {errors.designation.message}
                </span>
              )}
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="joining_date" className={styles.label}>
                Joining Date *
              </label>
              <input
                id="joining_date"
                type="date"
                className={`${styles.input} ${errors.joining_date ? styles.error : ""}`}
                {...register("joining_date", {
                  required: "Joining date is required",
                })}
              />
              {errors.joining_date && (
                <span className={styles.errorText}>
                  {errors.joining_date.message}
                </span>
              )}
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Employment Type *</label>
              <div className={styles.radioGroup}>
                {employmentTypes.map((type) => (
                  <RadioOption
                    key={type}
                    label={type}
                    value={type}
                    name="employment_type"
                    register={register}
                    rules={{
                      required: "Employment type is required",
                    }}
                  />
                ))}
              </div>
              {errors.employment_type && (
                <span className={styles.errorText}>
                  {errors.employment_type.message}
                </span>
              )}
            </div>
          </div>

          {employmentType === "Contract" && (
            <div className={styles.formGroup}>
              <label htmlFor="contract_end_date" className={styles.label}>
                Contract End Date
              </label>
              <input
                id="contract_end_date"
                type="date"
                className={styles.input}
                {...register("contract_end_date")}
              />
            </div>
          )}
        </div>

        {/* Work Preferences Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Work Preferences</h2>

          <div className={styles.formGroup}>
            <label htmlFor="work_location" className={styles.label}>
              Work Location
            </label>
            <select
              id="work_location"
              className={styles.select}
              {...register("work_location")}
            >
              <option value="">Select Location</option>
              {workLocations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.checkboxContainer}>
              <label className={styles.checkboxContainer} htmlFor="is_remote">
                <input
                  id="is_remote"
                  type="checkbox"
                  className={styles.checkbox}
                  {...register("is_remote")}
                />
                <span className={styles.checkboxCustom}></span>
                Available for Remote Work
              </label>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="preferred_working_hours" className={styles.label}>
              Preferred Working Hours
            </label>
            <input
              id="preferred_working_hours"
              type="time"
              className={styles.input}
              {...register("preferred_working_hours")}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Preferred Communication Method
            </label>
            <div className={styles.radioGroup}>
              {["email", "slack", "phone", "in-person"].map((method) => (
                <RadioOption
                  key={method}
                  label={method.charAt(0).toUpperCase() + method.slice(1)}
                  value={method}
                  name="preferred_communication"
                  register={register}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Skills & Performance Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Skills & Performance</h2>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Skills ({skillsValue.length} added)
            </label>
            <div className={styles.inputRow}>
              <input
                id="new_skill_temp"
                type="text"
                {...register("new_skill_temp")}
                className={styles.input}
                placeholder="Add a skill (press Enter to add)"
                onKeyDown={handleSkillKeyDown}
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className={styles.addButton}
                disabled={!newSkillTemp.trim()}
              >
                +
              </button>
            </div>

            <div data-testid="skills-container" className={styles.skillsList}>
              {skillsValue.map((skill) => (
                <span key={skill} className={styles.skillTag}>
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="performance_rating" className={styles.label}>
              Initial Performance Rating:{" "}
              <span className={styles.ratingValue}>{performanceRating}/10</span>
            </label>
            <input
              id="performance_rating"
              type="range"
              min="1"
              max="10"
              step="1"
              className={styles.range}
              {...register("performance_rating", {
                valueAsNumber: true,
              })}
            />
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
            <label htmlFor="bio" className={styles.label}>
              Bio / About
            </label>
            <textarea
              id="bio"
              rows={4}
              className={styles.textarea}
              {...register("bio")}
              placeholder="Tell us about yourself, your background, and what you're passionate about..."
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Notification Preferences ({notificationPrefs.length} selected)
            </label>
            <div className={styles.notificationGrid}>
              {[
                {
                  value: "email_notifications",
                  label: "Email Notifications",
                },
                {
                  value: "sms_notifications",
                  label: "SMS Notifications",
                },
                {
                  value: "push_notifications",
                  label: "Push Notifications",
                },
                {
                  value: "calendar_reminders",
                  label: "Calendar Reminders",
                },
              ].map((pref) => (
                <label key={pref.value} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={notificationPrefs.includes(pref.value)}
                    onChange={() => handleNotificationToggle(pref.value)}
                    className={styles.checkbox}
                  />
                  <span className={styles.checkboxCustom}></span>
                  {pref.label}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.submitSection}>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`${styles.submitButton} ${isSubmitting ? styles.loading : ""}`}
        >
          {isSubmitting ? (
            <>
              <div className={styles.spinner}></div>
              Adding Employee...
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
              Add Employee
            </>
          )}
        </button>
      </div>
    </form>
  );
}
