import type { Route } from "./+types/home";
import styles from './home.module.scss';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1>Welcome to StaffBase</h1>
        <p>Your modern solution for managing employee data with ease.</p>
        <button className={styles.ctaButton}>Get Started</button>
      </section>

      <section className={styles.features}>
        <div className={styles.featureCard}>
          <h3>Employee List</h3>
          <p>View all employees in a clean, searchable list.</p>
        </div>
        <div className={styles.featureCard}>
          <h3>Search & Filter</h3>
          <p>Quickly find employees by name, department, or role.</p>
        </div>
        <div className={styles.featureCard}>
          <h3>Add & Edit</h3>
          <p>Easily add new employees or update existing profiles.</p>
        </div>
      </section>

      <section className={styles.footer}>
        <p>Built for HR teams and managers. Simple. Fast. Reliable.</p>
      </section>
    </div>
  );
}
