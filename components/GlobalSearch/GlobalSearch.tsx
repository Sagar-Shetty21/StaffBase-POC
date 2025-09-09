import React from "react";
import styles from "./GlobalSearch.module.scss";
import { useGlobalSearch } from "utils/contexts/GlobalSearchContext";
import { useEmployeeSearch } from "utils/hooks/GlobalEmployeeSearchApiHook";
import { Link } from "react-router";

type GlobalSearchProps = {};

const GlobalSearch = ({}: GlobalSearchProps) => {
  const { search, isActive, setIsActive } = useGlobalSearch();
  if (!isActive) return null;

  const { data: employees, isLoading, isError } = useEmployeeSearch(search);

  return (
    <div className={styles.container} onClick={() => setIsActive(false)}>
      <div className={styles.resultBox} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.heading}>Search Results</h2>
        <p className={styles.subHeading}>
          Showing results for: <strong>{search}</strong>
        </p>

        {isLoading && <div className={styles.status}>🔄 Loading...</div>}
        {isError && (
          <div className={styles.statusError}>❌ Error fetching results</div>
        )}
        {!isLoading && !isError && employees?.length === 0 && (
          <div className={styles.status}>😕 No results found</div>
        )}

        {!isLoading && !isError && employees && employees.length > 0 && (
          <ul className={styles.resultList}>
            {employees.map((emp) => (
              <li key={emp.id} className={styles.resultItem}>
                <div className={styles.info}>
                  <div className={styles.name}>{emp.name}</div>
                  <div className={styles.designation}>{emp.designation}</div>
                </div>
                <Link
                  to={`/employee/${emp.id}`}
                  className={styles.viewLink}
                  onClick={() => setIsActive(false)}
                >
                  View Profile →
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default GlobalSearch;
