import React, { useState, useMemo } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    flexRender,
    createColumnHelper,
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
import styles from "./home.module.scss";

// Mock data for employees
const mockEmployees = [
    {
        id: 1,
        name: "Sarah Johnson",
        department: "Engineering",
        role: "Senior Developer",
        salary: 95000,
        joinDate: "2023-01-15",
        status: "Active",
        avatar: "SJ",
    },
    {
        id: 2,
        name: "Michael Chen",
        department: "Marketing",
        role: "Marketing Manager",
        salary: 78000,
        joinDate: "2023-03-22",
        status: "Active",
        avatar: "MC",
    },
    {
        id: 3,
        name: "Emily Rodriguez",
        department: "HR",
        role: "HR Specialist",
        salary: 65000,
        joinDate: "2023-02-10",
        status: "Active",
        avatar: "ER",
    },
    {
        id: 4,
        name: "David Kim",
        department: "Engineering",
        role: "Frontend Developer",
        salary: 82000,
        joinDate: "2023-08-05",
        status: "Active",
        avatar: "DK",
    },
    {
        id: 5,
        name: "Lisa Thompson",
        department: "Sales",
        role: "Sales Director",
        salary: 105000,
        joinDate: "2022-11-18",
        status: "On Leave",
        avatar: "LT",
    },
];

const columnHelper = createColumnHelper();

const columns = [
    columnHelper.accessor("avatar", {
        header: "",
        cell: (info) => <div className={styles.avatar}>{info.getValue()}</div>,
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
    columnHelper.accessor("role", {
        header: "Role",
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => (
            <span
                className={`${styles.statusBadge} ${styles[info.getValue().toLowerCase().replace(" ", "")]}`}
            >
                {info.getValue()}
            </span>
        ),
    }),
    columnHelper.accessor("joinDate", {
        header: "Join Date",
        cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    }),
];

export default function EmployeeDashboard() {
    const [globalFilter, setGlobalFilter] = useState("");
    const [sorting, setSorting] = useState([]);

    const data = useMemo(() => mockEmployees, []);

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
        { label: "Total Employees", value: "247", icon: Users, color: "blue" },
        {
            label: "New This Month",
            value: "12",
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
                    <p>
                        Manage your workforce with powerful insights and tools
                    </p>
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
                                onChange={(e) =>
                                    setGlobalFilter(e.target.value)
                                }
                                className={styles.searchInput}
                            />
                        </div>
                    </div>

                    <div className={styles.tableContainer}>
                        <table className={styles.employeeTable}>
                            <thead>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <th
                                                key={header.id}
                                                onClick={
                                                    header.column.getCanSort()
                                                        ? header.column.getToggleSortingHandler()
                                                        : undefined
                                                }
                                                className={
                                                    header.column.getCanSort()
                                                        ? styles.sortable
                                                        : ""
                                                }
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column
                                                              .columnDef.header,
                                                          header.getContext()
                                                      )}
                                                {{
                                                    asc: " 🔼",
                                                    desc: " 🔽",
                                                }[
                                                    header.column.getIsSorted()
                                                ] ?? null}
                                            </th>
                                        ))}
                                        <th>Actions</th>
                                    </tr>
                                ))}
                            </thead>
                            <tbody>
                                {table.getRowModel().rows.map((row) => (
                                    <tr key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <td key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </td>
                                        ))}
                                        <td>
                                            <div className={styles.actionsMenu}>
                                                <button
                                                    className={styles.actionBtn}
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    className={styles.actionBtn}
                                                >
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
                            of {table.getPrePaginationRowModel().rows.length}{" "}
                            employees
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
                        <button
                            className={`${styles.quickActionBtn} ${styles.viewAll}`}
                        >
                            <Users size={20} />
                            <span>View All Employees</span>
                            <span className={styles.count}>247</span>
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
                                        <strong>{activity.action}</strong> -{" "}
                                        {activity.employee}
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
                            <div
                                className={`${styles.deptBar} ${styles.engineering}`}
                            ></div>
                            <span>Engineering (45)</span>
                        </div>
                        <div className={styles.deptItem}>
                            <div
                                className={`${styles.deptBar} ${styles.marketing}`}
                            ></div>
                            <span>Marketing (32)</span>
                        </div>
                        <div className={styles.deptItem}>
                            <div
                                className={`${styles.deptBar} ${styles.sales}`}
                            ></div>
                            <span>Sales (28)</span>
                        </div>
                        <div className={styles.deptItem}>
                            <div
                                className={`${styles.deptBar} ${styles.hr}`}
                            ></div>
                            <span>HR (15)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
