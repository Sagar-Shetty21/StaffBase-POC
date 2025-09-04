# Staffbase – Employee Management System (POC)

This project is a **proof of concept (POC)** for an internal **Employee Management System** called **Staffbase**.
⚠️ It is **not intended for end-users** — the goal is to **learn, experiment, and explore** modern frontend tooling and practices.

---

## 🎯 Objectives

* Explore modern frontend development with **React** and **Remix (React Router 7 framework)**.
* Experiment with **SCSS** for modular, maintainable styling.
* Learn **React Hook Form** for robust form handling and validation.
* Practice **unit testing** with **Vitest**.
* Implement **end-to-end testing** with **Playwright**.
* Build accessible UI by following **Accessibility (a11y)** best practices.
* Learn **advanced table rendering and data grids** with **TanStack Table**.
* Use **PocketBase** as a lightweight backend service to store and manage data.

---

## 🛠️ Tech Stack

* **SCSS** – Styling with nested rules, variables, and mixins.
* **React** – UI component library.
* **Remix (React Router 7)** – Framework for routing, data loading, and server-side rendering.
* **React Hook Form** – Simple, performant form handling.
* **Vitest** – Unit testing framework for JavaScript/TypeScript.
* **Playwright** – End-to-end testing framework.
* **Accessibility (a11y)** – Ensuring the app is usable by all.
* **TanStack Table** – Advanced tables and data grids.

👉 For backend services, this project uses **PocketBase** (self-contained binary, no setup needed).

---

## 🚀 Getting Started

### Prerequisites

* Node.js (v18+ recommended)
* npm or yarn

---

### Installation

```bash
# Clone the repo
git clone https://github.com/Sagar-Shetty21/StaffBase-POC.git
cd staffbase-poc

# Install dependencies
npm install
```

---

### PocketBase Setup

This project includes a **PocketBase binary** under `backend/`.

No external database or account setup is required ✅.
PocketBase will automatically run as the backend when you start the project.

---

### Development

Run the following command to start both **frontend (Remix)** and **backend (PocketBase)**:

```bash
npm run dev
```

* Frontend will run on: [http://localhost:3000](http://localhost:3000)
* PocketBase will run on: [http://127.0.0.1:8090](http://127.0.0.1:8090)

---

### Build & Production

```bash
# Build frontend
npm run build

# Start frontend (production)
npm run start
```

PocketBase can also be run directly (if needed):

```bash
./backend/pocketbase serve      # Mac/Linux
backend\pocketbase.exe serve    # Windows
```

---

### Testing

Run **unit tests**:

```bash
npm run test
```

Run **end-to-end tests**:

```bash
npm run test:e2e
```

---

## 📖 Notes

* This project is a **learning POC** and not production-ready.
* The backend (PocketBase) is included **only for convenience** to provide persistence and APIs.
* No external cloud setup is required — everything runs locally.

