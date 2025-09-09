import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  type CellContext,
  type SortingState,
} from "@tanstack/react-table";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  TrendingUp,
  Calendar,
  Building,
  Award,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Download,
} from "lucide-react";
import styles from "./Home.module.scss";
import type { Route } from "./+types/Home";
import {
  fetchEmployeePaginationData,
  fetchEmployeesAddedThisMonth,
  fetchRecentlyAddedEmployees,
} from "services/dashboard";
import type { Employee } from "types/employee";
import { getInitials } from "utils/helpers";

export async function loader({ params }: Route.LoaderArgs) {
  try {
    const recentlyAddedEmployees = await fetchRecentlyAddedEmployees();
    const totalEmployeesData = await fetchEmployeePaginationData();
    const employeesAddedThisMonth = await fetchEmployeesAddedThisMonth();

    return {
      isSuccess: true,
      message: "Employee data fetched successfully!",
      data: {
        recentlyAddedEmployees: recentlyAddedEmployees,
        totalEmployees: totalEmployeesData.totalItems ?? 0,
        employeesAddedThisMonth: employeesAddedThisMonth.totalItems ?? 0,
      },
    };
  } catch (err) {
    console.log(err);
    return {
      isSuccess: false,
      message: "Something went wrong! Please refresh the page.",
      data: null,
    };
  }
}

const columnHelper = createColumnHelper();

const columnsTemp = [
  columnHelper.accessor("name", {
    header: "",
    cell: (info) => (
      <div className={styles.avatar}>{getInitials(info.getValue())}</div>
    ),
    enableSorting: false,
  }),
  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("department", {
    header: "Department",
    cell: (info) => (
      <span className={styles.departmentBadge}>{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor("designation", {
    header: "Role",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("joining_date", {
    header: "Join Date",
    cell: (info) => new Date(info.getValue()).toLocaleDateString(),
  }),
];

const columns = [
  {
    accessorKey: "name",
    header: "Name",
    cell: (info: any) => info.getValue(),
  },
  {
    accessorKey: "department",
    header: "Department",
    cell: (info: any) => (
      <span className={styles.departmentBadge}>{info.getValue()}</span>
    ),
  },
  {
    accessorKey: "designation",
    header: "Role",
    cell: (info: any) => info.getValue(),
  },
  {
    accessorKey: "joining_date",
    header: "Join Date",
    cell: (info: any) =>
      new Date(info.getValue() as string).toLocaleDateString(),
  },
];

export default function EmployeeDashboard({
  loaderData,
}: Route.ComponentProps) {
  const { data: dashboardData } = loaderData;

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  const data = useMemo(
    () => dashboardData?.recentlyAddedEmployees.items as Employee[],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    state: {
      globalFilter,
      sorting,
    },
    initialState: {
      pagination: {
        pageSize: 3,
      },
    },
  });

  const stats = [
    {
      label: "Total Employees",
      value: dashboardData?.totalEmployees ?? 0,
      icon: Users,
      color: "blue",
    },
    {
      label: "New This Month",
      value: dashboardData?.employeesAddedThisMonth ?? 0,
      icon: UserPlus,
      color: "green",
    },
    { label: "Departments", value: "8", icon: Building, color: "purple" },
    {
      label: "Avg. Tenure",
      value: "2.3 yrs",
      icon: Award,
      color: "orange",
    },
  ];

  const recentActivities = [
    {
      action: "New hire",
      employee: "John Doe",
      department: "Engineering",
      time: "2 hours ago",
    },
    {
      action: "Promotion",
      employee: "Jane Smith",
      department: "Marketing",
      time: "5 hours ago",
    },
    {
      action: "Department transfer",
      employee: "Bob Wilson",
      department: "Sales → HR",
      time: "1 day ago",
    },
    {
      action: "Salary update",
      employee: "Alice Brown",
      department: "Finance",
      time: "2 days ago",
    },
  ];

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <header className={styles.dashboardHeader}>
        <div className={styles.headerContent}>
          <h1>Employee Dashboard</h1>
          <p>Manage your workforce with powerful insights and tools</p>
        </div>
        <div className={styles.headerActions}>
          <button className={`${styles.btn} ${styles.btnSecondary}`}>
            <Download size={20} />
            Export
          </button>
          <button className={`${styles.btn} ${styles.btnPrimary}`}>
            <UserPlus size={20} />
            Add Employee
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`${styles.statCard} ${styles[stat.color]}`}
          >
            <div className={styles.statIcon}>
              <stat.icon size={24} />
            </div>
            <div className={styles.statContent}>
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className={styles.contentGrid}>
        {/* Recently Added Employees Table */}
        <div className={`${styles.card} ${styles.tableCard}`}>
          <div className={styles.cardHeader}>
            <div>
              <h2>Recently Added Employees</h2>
              <p>Latest additions to your team</p>
            </div>
            <div className={styles.searchContainer}>
              <Search size={20} />
              <input
                type="text"
                placeholder="Search employees..."
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className={styles.searchInput}
              />
            </div>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.employeeTable}>
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header, index) => (
                      <th
                        key={index}
                        onClick={
                          header.column.getCanSort()
                            ? header.column.getToggleSortingHandler()
                            : undefined
                        }
                        className={
                          header.column.getCanSort() ? styles.sortable : ""
                        }
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}

                        {header.column.getIsSorted() === "asc"
                          ? " 🔼"
                          : header.column.getIsSorted() === "desc"
                            ? " 🔽"
                            : null}
                      </th>
                    ))}
                    <th>Actions</th>
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell, index) => (
                      <td key={index}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                    <td>
                      <div className={styles.actionsMenu}>
                        <button className={styles.actionBtn}>
                          <Eye size={16} />
                        </button>
                        <button className={styles.actionBtn}>
                          <Edit size={16} />
                        </button>
                        <button
                          className={`${styles.actionBtn} ${styles.danger}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.tablePagination}>
            <div className={styles.paginationInfo}>
              Showing{" "}
              {table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
                1}{" "}
              to{" "}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) *
                  table.getState().pagination.pageSize,
                table.getPrePaginationRowModel().rows.length
              )}{" "}
              of {table.getPrePaginationRowModel().rows.length} employees
            </div>
            <div className={styles.paginationControls}>
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className={styles.paginationBtn}
              >
                Previous
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className={styles.paginationBtn}
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className={`${styles.card} ${styles.quickActionsCard}`}>
          <div className={styles.cardHeader}>
            <h3>Quick Actions</h3>
          </div>
          <div className={styles.quickActions}>
            <button className={`${styles.quickActionBtn} ${styles.viewAll}`}>
              <Users size={20} />
              <span>View All Employees</span>
              <span className={styles.count}>
                {dashboardData?.totalEmployees ?? 0}
              </span>
            </button>
            <button className={styles.quickActionBtn}>
              <Filter size={20} />
              <span>Advanced Filters</span>
            </button>
            <button className={styles.quickActionBtn}>
              <TrendingUp size={20} />
              <span>Analytics</span>
            </button>
            <button className={styles.quickActionBtn}>
              <Calendar size={20} />
              <span>Schedule Review</span>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className={`${styles.card} ${styles.activityCard}`}>
          <div className={styles.cardHeader}>
            <h3>Recent Activity</h3>
            <p>Latest updates and changes</p>
          </div>
          <div className={styles.activityList}>
            {recentActivities.map((activity, index) => (
              <div key={index} className={styles.activityItem}>
                <div className={styles.activityDot}></div>
                <div className={styles.activityContent}>
                  <div className={styles.activityMain}>
                    <strong>{activity.action}</strong> - {activity.employee}
                  </div>
                  <div className={styles.activityMeta}>
                    {activity.department} • {activity.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Department Overview */}
        <div className={`${styles.card} ${styles.departmentCard}`}>
          <div className={styles.cardHeader}>
            <h3>Department Overview</h3>
          </div>
          <div className={styles.departmentStats}>
            <div className={styles.deptItem}>
              <div className={`${styles.deptBar} ${styles.engineering}`}></div>
              <span>Engineering (45)</span>
            </div>
            <div className={styles.deptItem}>
              <div className={`${styles.deptBar} ${styles.marketing}`}></div>
              <span>Marketing (32)</span>
            </div>
            <div className={styles.deptItem}>
              <div className={`${styles.deptBar} ${styles.sales}`}></div>
              <span>Sales (28)</span>
            </div>
            <div className={styles.deptItem}>
              <div className={`${styles.deptBar} ${styles.hr}`}></div>
              <span>HR (15)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
