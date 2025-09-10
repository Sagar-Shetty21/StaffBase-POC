import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type Row,
} from "@tanstack/react-table";
import styles from "./EmployeeTable.module.scss";
import type { Employee } from "types/employee";
import { Link } from "react-router";

type Props = {
  data: Employee[];
  page: number;
  totalPages: number;
  totalItems?: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
};

const EmployeeTable: React.FC<Props> = ({
  data,
  page,
  totalPages,
  totalItems,
  setPage,
}) => {
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }: { row: Row<Employee> }) => (
          <div className={styles.nameCell}>
            <div className={styles.avatar}>
              {row.original.name.charAt(0).toUpperCase()}
            </div>
            <span className={styles.nameText}>{row.original.name}</span>
          </div>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }: { row: Row<Employee> }) => (
          <span className={styles.emailCell}>{row.original.email}</span>
        ),
      },
      {
        accessorKey: "department",
        header: "Department",
        cell: ({ row }: { row: Row<Employee> }) => (
          <span className={styles.departmentBadge}>
            {row.original.department}
          </span>
        ),
      },
      {
        accessorKey: "designation",
        header: "Designation",
      },
      {
        accessorKey: "joining_date",
        header: "Joining Date",
        cell: ({ row }: { row: Row<Employee> }) => (
          <span className={styles.dateCell}>
            {new Date(row.original.joining_date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }: { row: Row<Employee> }) => (
          <Link
            className={styles.viewButton}
            to={`/employee/${row.original.id}`}
          >
            <svg
              className={styles.viewIcon}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            View Details
          </Link>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    pageCount: totalPages,
    state: {
      globalFilter,
    },
    manualPagination: true,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableHeader}>
        <h2 className={styles.tableTitle}>Employee Directory</h2>
        <div className={styles.searchContainer}>
          <svg
            className={styles.searchIcon}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            className={styles.searchInput}
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search employees..."
          />
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className={styles.headerRow}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className={styles.headerCell}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, index) => (
              <tr
                key={row.id}
                className={`${styles.bodyRow} ${index % 2 === 0 ? styles.evenRow : styles.oddRow}`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className={styles.bodyCell}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        <div className={styles.paginationInfo}>
          <span className={styles.resultCount}>
            Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, data.length)}{" "}
            of {totalItems} employees
          </span>
        </div>
        <div className={styles.paginationControls}>
          <button
            className={`${styles.paginationButton} ${styles.prevButton}`}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <polyline points="15,18 9,12 15,6" />
            </svg>
            Previous
          </button>

          <div className={styles.pageNumbers}>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((pageNum) => {
                // Show first page, last page, current page, and pages around current
                if (pageNum === 1 || pageNum === totalPages) return true;
                if (Math.abs(pageNum - page) <= 1) return true;
                return false;
              })
              .reduce((acc, pageNum, index, array) => {
                // Add ellipsis between non-consecutive pages
                if (index > 0 && pageNum - array[index - 1] > 1) {
                  acc.push(
                    <span
                      key={`ellipsis-${pageNum}`}
                      className={styles.ellipsis}
                    >
                      ...
                    </span>
                  );
                }
                acc.push(
                  <button
                    key={pageNum}
                    className={`${styles.pageButton} ${page === pageNum ? styles.activePage : ""}`}
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
                return acc;
              }, [] as React.ReactNode[])}
          </div>

          <button
            className={`${styles.paginationButton} ${styles.nextButton}`}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            Next
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <polyline points="9,18 15,12 9,6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeTable;
