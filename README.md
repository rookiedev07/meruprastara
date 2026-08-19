# Meru-Prastāra Memoization Demonstration System

> **A full MERN-stack web application connecting Ācārya Piṅgala's ancient *Chandaḥśāstra* precursor to Pascal's Triangle with fundamental Computer Science concepts: recursion complexity, top-down memoization, and bottom-up dynamic programming tabulation.**

---

## 🌟 Overview

The **Meru-Prastāra Memoization Demonstration System** makes theoretical dynamic programming and algorithm complexity visually intuitive and historically grounded. Users generate the Meru-Prastāra (Pascal's Triangle) row by row and switch between three interchangeable computation engines for $C(n,r)$:

1. **Naive Recursive Engine**: Unoptimized $O(2^n)$ exponential time recursion, deliberately left unoptimized to demonstrate subproblem explosion. Isolated in a **Node.js Worker Thread** with execution timeouts.
2. **Top-Down Memoized Engine**: $O(n \cdot r)$ recursion with lookup cache `memo[n][r]`, tracking exact subproblem cache hits.
3. **Bottom-Up Tabulated Engine**: $O(n \cdot r)$ iterative 2D DP table matrix matching Piṅgala's original row-by-row expansion rule.

---

## 🚀 Quick Start & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB** (Optional): Local MongoDB or MongoDB Atlas instance. *(System includes automatic in-memory fallback for local demonstration if MongoDB is offline).*

### 1. Install Dependencies
Run the unified setup command from the repository root:
```bash
npm run setup
```
*(This automatically runs `npm install` at root, inside `server/`, and inside `client/`)*.

### 2. Environment Configuration
Copy `.env.example` to `server/.env`:
```bash
cp .env.example server/.env
```

Default `server/.env` contents:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/meruprastara
JWT_SECRET=meru_prastara_super_secret_jwt_key_2026
NODE_ENV=development
```

### 3. Seed Historical Articles (Optional)
Populate the database with *Chandaḥśāstra* historical articles:
```bash
npm run seed
```

### 4. Run the Application
Launch both backend REST API and React Vite frontend concurrently:
```bash
npm run dev
```
- **Frontend App**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 💻 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React.js (Vite), React Router v6, Context API, Tailwind CSS |
| **Visualizations** | D3.js (Hierarchical Call Tree), Recharts (Benchmarks), Framer Motion (Triangle Animations) |
| **Backend** | Node.js, Express.js (REST API), Node.js Worker Threads |
| **Database** | MongoDB & Mongoose ODM |
| **Authentication** | JWT (JSON Web Tokens) & bcryptjs |
| **Testing** | Jest & Supertest |

---

## 📁 Repository Folder Structure

```
meruprastara/
├── package.json               # Root scripts (setup, dev, test, seed)
├── README.md                  # Detailed documentation & run guide
├── .env.example               # Environment variables template
├── server/                    # Node.js + Express REST API
│   ├── package.json
│   ├── server.js              # Entrypoint server
│   └── src/
│       ├── config/            # Database connection & fallback
│       ├── models/            # Mongoose schemas (User, TriangleRun, Computation, etc.)
│       ├── engines/           # 3 C(n,r) engines & Node.js Worker Thread isolator
│       ├── controllers/       # Route controllers
│       ├── routes/            # REST API endpoints
│       ├── middleware/        # JWT auth & error handling
│       ├── seed/              # Chandaḥśāstra notes seed script
│       ├── postman/           # Meru_Prastara_API.postman_collection.json
│       └── tests/             # Jest engine unit tests
└── client/                    # React Vite Frontend SPA
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── api/               # Axios API client
        ├── context/           # AuthContext & MeruContext
        ├── components/        # MeruTriangle, RecursionTreeVisualizer, BenchmarkCharts
        ├── pages/             # Home, RecursionTree, Benchmark, Historical, Dashboard, Admin
        └── App.jsx
```

---

## 🧪 Running Unit Tests

To run the automated backend algorithm engine unit tests:
```bash
npm test
```

---

## 📬 Postman API Collection

A ready-to-import Postman collection is provided in `server/src/postman/Meru_Prastara_API.postman_collection.json`.

---

## 📜 License & Credits

Prepared as part of **IKSCS Internal Assessment Project** (Roll No. 2407113, TYCS, July 2026).
Based on Chapter 8 of Ācārya Piṅgala's *Chandaḥśāstra* (c. 3rd–2nd Century BCE).
