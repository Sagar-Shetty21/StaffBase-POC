import React from 'react';
import { useForm } from 'react-hook-form';
import styles from './Form.module.scss';
import { Form } from 'react-router';

type EmployeeFormData = {
  name: string;
  email: string;
  designation: string;
  department: string;
  joining_date: string;
};

const EmployeeForm: React.FC<{ onSubmit: (data: EmployeeFormData) => void }> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmployeeFormData>();
  
  const submitHandler = (data: EmployeeFormData) => {
    onSubmit(data);
    // reset();
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className={styles.form}>
      <h2>Add New Employee</h2>
        <div className={styles.formGroup}>
          <label>Name</label>
          <input
            {...register('name', { required: 'Name is required' })}
            type="text"
            placeholder="Enter name"
          />
          {errors.name && <span className={styles.error}>{errors.name.message}</span>}
        </div>

        <div className={styles.formGroup}>
          <label>Email</label>
          <input
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Invalid email address',
              },
            })}
            type="email"
            placeholder="Enter email"
          />
          {errors.email && <span className={styles.error}>{errors.email.message}</span>}
        </div>

        <div className={styles.formGroup}>
          <label>Designation</label>
          <input
            {...register('designation', { required: 'Designation is required' })}
            type="text"
            placeholder="Enter designation"
          />
          {errors.designation && <span className={styles.error}>{errors.designation.message}</span>}
        </div>

        <div className={styles.formGroup}>
          <label>Department</label>
          <input
            {...register('department', { required: 'Department is required' })}
            type="text"
            placeholder="Enter department"
          />
          {errors.department && <span className={styles.error}>{errors.department.message}</span>}
        </div>

        <div className={styles.formGroup}>
          <label>Joining Date</label>
          <input
            {...register('joining_date', { required: 'Joining date is required' })}
            type="date"
          />
          {errors.joining_date && <span className={styles.error}>{errors.joining_date.message}</span>}
        </div>

        <button type="submit" className={styles.submitButton}>Add Employee</button>
    </form>
  );
};

export default EmployeeForm;
