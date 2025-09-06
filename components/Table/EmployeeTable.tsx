import React, { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type Row,
} from '@tanstack/react-table';
import styles from './Table.module.scss';
import type { Employee } from 'types/employee';
import { Link } from 'react-router';

type Props = {
  data: Employee[];
  page: number;
  totalPages: number;
  setPage: React.Dispatch<React.SetStateAction<number>>
};

const EmployeeTable: React.FC<Props> = ({ data, page, totalPages, setPage }) => {
  const [globalFilter, setGlobalFilter] = useState('');

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },
      {
        accessorKey: 'department',
        header: 'Department',
      },
      {
        accessorKey: 'designation',
        header: 'Designation',
      },
      {
        accessorKey: 'joining_date',
        header: 'Joining Date',
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }: { row: Row<Employee> }) => (
          <Link
            className={styles.viewButton}
            to={`/employee/${row.original.id}`}
          >
            View
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
      globalFilter
    },
    manualPagination: true,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className={styles.tableContainer}>
      <input
        className={styles.searchInput}
        value={globalFilter ?? ''}
        onChange={(e) => setGlobalFilter(e.target.value)}
        placeholder="Search by name..."
      />

      <table className={styles.table}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.pagination}>
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default EmployeeTable;
