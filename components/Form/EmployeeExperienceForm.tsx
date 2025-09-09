import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Edit2, Save, X, Plus, MapPin, Calendar } from "lucide-react";
import styles from "./EmployeeExperienceForm.module.scss";

interface Experience {
    id: string;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string | null;
    description: string;
}

interface EmployeeExperienceFormProps {
    isEditing: boolean;
    experiences: Experience[];
    onUpdate?: (experiences: Experience[]) => void;
}

interface ExperienceFormData {
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
    isCurrent: boolean;
}

const EmployeeExperienceForm: React.FC<EmployeeExperienceFormProps> = ({
    isEditing,
    experiences,
    onUpdate,
}) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [experienceList, setExperienceList] =
        useState<Experience[]>(experiences);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<ExperienceFormData>();

    const isCurrent = watch("isCurrent");

    const handleEdit = (experience: Experience) => {
        setEditingId(experience.id);
        reset({
            title: experience.title,
            company: experience.company,
            location: experience.location,
            startDate: experience.startDate,
            endDate: experience.endDate || "",
            description: experience.description,
            isCurrent: !experience.endDate,
        });
    };

    const handleSave = (data: ExperienceFormData) => {
        const updatedExperience: Experience = {
            id: editingId || Date.now().toString(),
            title: data.title,
            company: data.company,
            location: data.location,
            startDate: data.startDate,
            endDate: data.isCurrent ? null : data.endDate,
            description: data.description,
        };

        let updatedList;
        if (editingId) {
            updatedList = experienceList.map((exp) =>
                exp.id === editingId ? updatedExperience : exp
            );
        } else {
            updatedList = [...experienceList, updatedExperience];
        }

        setExperienceList(updatedList);
        onUpdate?.(updatedList);
        setEditingId(null);
        setIsAddingNew(false);
        reset();
    };

    const handleCancel = () => {
        setEditingId(null);
        setIsAddingNew(false);
        reset();
    };

    const handleAddNew = () => {
        setIsAddingNew(true);
        setEditingId(null);
        reset({
            title: "",
            company: "",
            location: "",
            startDate: "",
            endDate: "",
            description: "",
            isCurrent: false,
        });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
        });
    };

    const ExperienceForm = () => (
        <div className={styles.form}>
            <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Job Title *</label>
                    <input
                        {...register("title", {
                            required: "Job title is required",
                        })}
                        className={styles.input}
                        placeholder="e.g. Software Engineer"
                    />
                    {errors.title && (
                        <p className={styles.error}>{errors.title.message}</p>
                    )}
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Company *</label>
                    <input
                        {...register("company", {
                            required: "Company is required",
                        })}
                        className={styles.input}
                        placeholder="e.g. Tech Corp"
                    />
                    {errors.company && (
                        <p className={styles.error}>{errors.company.message}</p>
                    )}
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Location</label>
                    <input
                        {...register("location")}
                        className={styles.input}
                        placeholder="e.g. New York, NY"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Start Date *</label>
                    <input
                        type="month"
                        {...register("startDate", {
                            required: "Start date is required",
                        })}
                        className={styles.input}
                    />
                    {errors.startDate && (
                        <p className={styles.error}>
                            {errors.startDate.message}
                        </p>
                    )}
                </div>
            </div>

            <div className={styles.dateGroup}>
                <label className={styles.checkboxLabel}>
                    <input
                        type="checkbox"
                        {...register("isCurrent")}
                        className={styles.checkbox}
                    />
                    <span>I currently work here</span>
                </label>

                {!isCurrent && (
                    <div className={styles.formGroup}>
                        <label className={styles.label}>End Date</label>
                        <input
                            type="month"
                            {...register("endDate", {
                                required: !isCurrent
                                    ? "End date is required"
                                    : false,
                            })}
                            className={styles.input}
                        />
                        {errors.endDate && (
                            <p className={styles.error}>
                                {errors.endDate.message}
                            </p>
                        )}
                    </div>
                )}
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>Description</label>
                <textarea
                    {...register("description")}
                    rows={4}
                    className={styles.textarea}
                    placeholder="Describe your responsibilities and achievements..."
                />
            </div>

            <div className={styles.formActions}>
                <button
                    type="button"
                    onClick={handleCancel}
                    className={`${styles.button} ${styles.buttonSecondary}`}
                >
                    <X className={styles.icon} />
                    <span>Cancel</span>
                </button>
                <button
                    type="button"
                    onClick={handleSubmit(handleSave)}
                    className={`${styles.button} ${styles.buttonPrimary}`}
                >
                    <Save className={styles.icon} />
                    <span>Save</span>
                </button>
            </div>
        </div>
    );

    const ExperienceCard = ({ experience }: { experience: Experience }) => (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <div className={styles.cardContent}>
                    <h3 className={styles.title}>{experience.title}</h3>
                    <p className={styles.company}>{experience.company}</p>
                </div>
                {isEditing && (
                    <button
                        onClick={() => handleEdit(experience)}
                        className={`${styles.button} ${styles.buttonEdit}`}
                    >
                        <Edit2 className={styles.icon} />
                        <span>Edit</span>
                    </button>
                )}
            </div>

            <div className={styles.cardMeta}>
                {experience.location && (
                    <div className={styles.metaItem}>
                        <MapPin className={styles.icon} />
                        <span>{experience.location}</span>
                    </div>
                )}
                <div className={styles.metaItem}>
                    <Calendar className={styles.icon} />
                    <span>
                        {formatDate(experience.startDate)} -{" "}
                        {experience.endDate
                            ? formatDate(experience.endDate)
                            : "Present"}
                    </span>
                </div>
            </div>

            {experience.description && (
                <div className={styles.description}>
                    {experience.description}
                </div>
            )}
        </div>
    );

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.headerTitle}>Work Experience</h2>
                <div className={styles.headerDivider}></div>
            </div>

            {experienceList.length === 0 && !isEditing && (
                <p>{"Not provided"}</p>
            )}

            <div className={styles.experienceList}>
                {experienceList.map((experience) => (
                    <div key={experience.id}>
                        {editingId === experience.id ? (
                            <div
                                className={`${styles.formContainer} ${styles.editing}`}
                            >
                                <ExperienceForm />
                            </div>
                        ) : (
                            <ExperienceCard experience={experience} />
                        )}
                    </div>
                ))}

                {isAddingNew && (
                    <div className={`${styles.formContainer} ${styles.adding}`}>
                        <h3 className={styles.formTitle}>Add New Experience</h3>
                        <ExperienceForm />
                    </div>
                )}

                {isEditing && !isAddingNew && !editingId && (
                    <button onClick={handleAddNew} className={styles.addButton}>
                        <Plus className={styles.icon} />
                        <span>Add New Experience</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default EmployeeExperienceForm;
