<div align="center">

<br />

<!-- Logo / Banner -->
<img src="https://readme-typing-svg.demolab.com?font=Outfit&weight=700&size=48&pause=1000&color=7C6EF7&center=true&vCenter=true&width=600&lines=VeriFi" alt="VeriFi" />

### **Blockchain-Powered Academic Credential Verification**

*Tamper-proof · Decentralized · Privacy-First*

<br />

[![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Solidity](https://img.shields.io/badge/Solidity-363636?style=for-the-badge&logo=solidity&logoColor=white)](https://soliditylang.org/)
[![Ethereum](https://img.shields.io/badge/Ethereum-3C3C3D?style=for-the-badge&logo=ethereum&logoColor=white)](https://ethereum.org/)
[![IPFS](https://img.shields.io/badge/IPFS-65C2CB?style=for-the-badge&logo=ipfs&logoColor=white)](https://ipfs.tech/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

[![License: MIT](https://img.shields.io/badge/License-MIT-7C6EF7?style=for-the-badge)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=for-the-badge)](CONTRIBUTING.md)
[![Made with ❤️](https://img.shields.io/badge/Made_with-❤️-ff69b4?style=for-the-badge)](#)

<br />

> **VeriFi** is a full-stack, production-grade platform that leverages Ethereum smart contracts and IPFS decentralized storage to issue, store, and verify academic credentials — eliminating fraud, removing intermediaries, and giving individuals sovereign control over their own documents.

<br />

---

</div>

## 📋 Table of Contents

- [✨ Overview](#-overview)
- [🏗️ Architecture](#️-architecture)
- [🎯 Features](#-features)
- [👥 User Roles](#-user-roles)
- [⚙️ Tech Stack](#️-tech-stack)
- [📂 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Blockchain Setup](#blockchain-setup)
  - [Application Setup](#application-setup)
- [🔐 Environment Variables](#-environment-variables)
- [📜 Smart Contract](#-smart-contract)
- [🗄️ Database Schema](#️-database-schema)
- [🔌 API Reference](#-api-reference)
- [🛣️ Roadmap](#️-roadmap)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Overview

The traditional academic credential system is broken — fraudulent degrees, slow verification pipelines, and opaque processes cost institutions and employers millions of dollars annually. **VeriFi** solves this at the infrastructure level.

By anchoring document hashes to the Ethereum blockchain and storing files on IPFS via Pinata, VeriFi creates an immutable, auditable, and decentralized record of academic credentials. Every upload, access request, and approval is a transparent on-chain event — verifiable by anyone, alterable by no one.

```
Student → University Verifier signs & uploads to IPFS + Blockchain
       → Organization requests access → Student approves/rejects on-chain
       → Organization reads verified credential from IPFS
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          VeriFi Platform                            │
│                                                                     │
│   ┌──────────────┐    ┌────────────────┐    ┌──────────────────┐   │
│   │   Next.js 15 │    │  Hono API Layer│    │  Clerk Auth      │   │
│   │   (App Router│───▶│  (Route Handler│───▶│  (JWT / OAuth)   │   │
│   │    + RSC)    │    │   /api/**)     │    │                  │   │
│   └──────────────┘    └────────┬───────┘    └──────────────────┘   │
│                                │                                    │
│          ┌─────────────────────┼─────────────────────┐             │
│          ▼                     ▼                     ▼             │
│   ┌─────────────┐    ┌─────────────────┐    ┌──────────────────┐   │
│   │  Neon DB    │    │  Pinata / IPFS  │    │  Ethereum / EVM  │   │
│   │  (PostgreSQL│    │  (Decentralized │    │  Smart Contract  │   │
│   │  + Drizzle) │    │   File Storage) │    │  (VeriFi.sol)    │   │
│   └─────────────┘    └─────────────────┘    └──────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Data Flow:**
1. A **Verifier** (university) uploads a credential → file is pinned to IPFS, hash stored on-chain via `uploadDocument()`.
2. A **Student** registers with a unique on-chain hexcode linked to their wallet address.
3. An **Organization** (employer) requests document access via the blockchain `requestAccess()` function.
4. The **Student** approves or rejects the request on-chain via `grantAccess()` / `rejectAccess()`.
5. Access timestamps are immutably recorded, allowing time-bounded credential sharing.

---

## 🎯 Features

<table>
<tr>
<td width="50%">

### 🔗 Blockchain-First
- On-chain document registry with immutable audit trail
- Role-Based Access Control (RBAC) via OpenZeppelin `AccessControl`
- Cryptographic 8-digit hexcode identity for every student
- Time-stamped, on-chain access grants and revocations
- Smart contract events indexed for real-time UI updates

</td>
<td width="50%">

### 🗂️ Decentralized Storage
- Documents pinned permanently to IPFS via **Pinata**
- IPFS content hashes stored in both PostgreSQL and on-chain
- No single-point-of-failure for document retrieval
- Content-addressed storage ensures zero tampering

</td>
</tr>
<tr>
<td width="50%">

### 🔐 Privacy & Access Control
- Students own their credentials — organizations must request access
- Granular access: per-document, per-organization permissions
- Time-bounded access with configurable `duration_hours`
- Pending / approved / rejected request lifecycle tracked on-chain and in DB

</td>
<td width="50%">

### 💅 Premium UI/UX
- Animated landing page with **GSAP** scroll-driven effects
- **Framer Motion** micro-animations throughout all dashboards
- Role-specific dashboards: Student · Verifier · Organization
- **Recharts** analytics for document and access statistics
- Responsive design with **Tailwind CSS** + **Shadcn/ui**

</td>
</tr>
<tr>
<td width="50%">

### 🛡️ Enterprise-Grade Auth
- Clerk-powered authentication with social OAuth
- JWT-based session management with server-side validation
- Webhook-driven user provisioning via **Svix**
- Middleware-level route protection for all dashboards

</td>
<td width="50%">

### ⚡ Modern Infrastructure
- **Next.js 15** App Router with React Server Components
- **Hono** framework for high-performance API routes
- **Drizzle ORM** for type-safe database queries
- **Neon** serverless PostgreSQL — scale to zero, scale to millions

</td>
</tr>
</table>

---

## 👥 User Roles

VeriFi is built around three distinct actors, each with a dedicated dashboard and on-chain permissions:

```
┌─────────────────────────────────────────────────────────────┐
│                     🎓  STUDENT                             │
│  • Registers with a unique hexcode tied to wallet address   │
│  • Views all credentials issued to them                     │
│  • Approves or rejects incoming access requests on-chain    │
│  • Controls who sees their documents and for how long       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  🏛️  VERIFIER  (University)                 │
│  • Holds VERIFIER_ROLE on the smart contract                │
│  • Uploads and signs academic documents to IPFS + chain     │
│  • Can retrieve and delete documents they have uploaded     │
│  • Manages student enrolment records                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  🏢  ORGANIZATION  (Employer)               │
│  • Requests document access via student hexcode             │
│  • Receives time-bounded access upon student approval       │
│  • Views verified credentials directly from IPFS            │
│  • Access timestamps verifiable on-chain                    │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚙️ Tech Stack

### Frontend

| Technology | Purpose |
|:---|:---|
| <img src="https://skillicons.dev/icons?i=nextjs" height="20"/> **Next.js 15** | Full-stack React framework with App Router & RSC |
| <img src="https://skillicons.dev/icons?i=react" height="20"/> **React 19** | UI library with concurrent features |
| <img src="https://skillicons.dev/icons?i=typescript" height="20"/> **TypeScript 5** | End-to-end type safety |
| <img src="https://skillicons.dev/icons?i=tailwind" height="20"/> **Tailwind CSS** | Utility-first styling framework |
| **Shadcn/ui + Radix UI** | Accessible, headless component primitives |
| **Framer Motion** | Page transitions & micro-animations |
| **GSAP** | Scroll-driven animations on landing page |
| **Recharts** | Dashboard analytics & data visualization |
| **Lucide React + React Icons** | Icon libraries |

### Backend & API

| Technology | Purpose |
|:---|:---|
| **Hono** | Edge-ready API routing layer |
| <img src="https://skillicons.dev/icons?i=postgres" height="20"/> **Neon (PostgreSQL)** | Serverless relational database |
| **Drizzle ORM** | Type-safe database schema & query builder |
| **Clerk** | Authentication, session management & webhooks |
| **Svix** | Webhook delivery for user provisioning events |
| **JSON Web Tokens** | Additional token-based auth layer |

### Blockchain & Storage

| Technology | Purpose |
|:---|:---|
| <img src="https://skillicons.dev/icons?i=solidity" height="20"/> **Solidity ^0.8.20** | Smart contract language |
| <img src="https://skillicons.dev/icons?i=hardhat" height="20"/> **Hardhat** | Ethereum development & testing framework |
| **OpenZeppelin Contracts** | Battle-tested RBAC & security primitives |
| **ethers.js v6** | Ethereum client library for frontend |
| **Pinata SDK** | IPFS pinning service integration |
| **IPFS HTTP Client** | Decentralized file retrieval |
| **Web3.js** | Blockchain interaction utilities |

---

## 📂 Project Structure

```
VeriFi/
├── 📁 application/                  # Next.js 15 Web Application
│   ├── 📁 src/
│   │   ├── 📁 app/
│   │   │   ├── 📁 api/              # Hono API route handlers
│   │   │   │   ├── access/          # Access request management
│   │   │   │   ├── auth/            # Clerk webhook handler
│   │   │   │   ├── document/        # Document CRUD & retrieval
│   │   │   │   ├── organization/    # Organization management
│   │   │   │   ├── student/         # Student profile & enrollment
│   │   │   │   ├── upload/          # IPFS upload endpoint
│   │   │   │   ├── user/            # User management
│   │   │   │   └── verifier/        # Verifier management
│   │   │   ├── 📁 student-dashboard/    # 🎓 Student role dashboard
│   │   │   ├── 📁 verifier-dashboard/  # 🏛️ Verifier role dashboard
│   │   │   ├── 📁 organization-dashboard/ # 🏢 Org role dashboard
│   │   │   ├── 📁 document-viewer/  # IPFS document viewer
│   │   │   ├── 📁 get-started/      # Onboarding & role selection
│   │   │   ├── 📁 sign-in/          # Clerk auth
│   │   │   └── 📁 sign-up/          # Clerk auth
│   │   ├── 📁 components/
│   │   │   ├── magicui/             # MagicUI animated components
│   │   │   ├── my-ui/               # Custom domain components
│   │   │   └── ui/                  # Shadcn/ui primitives
│   │   ├── 📁 db/
│   │   │   ├── schema.ts            # Drizzle ORM schema definitions
│   │   │   └── index.ts             # Neon DB connection
│   │   ├── 📁 lib/                  # Shared utilities & helpers
│   │   ├── 📁 hooks/                # Custom React hooks
│   │   ├── 📁 contexts/             # React context providers
│   │   └── 📁 utils/                # Utility functions
│   ├── drizzle.config.ts            # Drizzle migration config
│   ├── next.config.ts               # Next.js configuration
│   └── tailwind.config.ts           # Tailwind configuration
│
└── 📁 Blockchain/                   # Hardhat Smart Contract Project
    ├── 📁 contracts/
    │   └── VeriFi.sol               # Main smart contract
    ├── 📁 scripts/                  # Deployment scripts
    ├── 📁 test/                     # Contract test suite
    ├── 📁 ignition/                 # Hardhat Ignition modules
    └── hardhat.config.js            # Hardhat configuration
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** `>= 20.x`
- **npm** `>= 10.x`  
- **Git**
- A **MetaMask** wallet (or any EVM-compatible wallet)
- A [Clerk](https://clerk.com) account
- A [Neon](https://neon.tech) PostgreSQL database
- A [Pinata](https://pinata.cloud) account for IPFS

---

### Blockchain Setup

```bash
# 1. Navigate to the Blockchain directory
cd Blockchain

# 2. Install dependencies
npm install

# 3. Copy the environment file and configure it
cp .env.example .env
# Fill in: PRIVATE_KEY, RPC_URL (Sepolia/Mainnet/Localhost)

# 4. Start a local Hardhat node (for local development)
npx hardhat node

# 5. In a new terminal, compile and deploy the contracts
npx hardhat compile
npx hardhat run scripts/deploy.js --network localhost

# 6. Run the contract test suite
npx hardhat test
```

> **Note:** Copy the deployed contract address — you will need it in the application `.env.local` file.

---

### Application Setup

```bash
# 1. Navigate to the application directory
cd application

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local
# Fill in all required keys (see Environment Variables section)

# 4. Push the database schema to Neon
npm run db:generate
npm run db:migrate

# (Optional) Open Drizzle Studio to inspect your database
npm run db:studio

# 5. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

---

## 🔐 Environment Variables

Create a `.env.local` file inside the `application/` directory:

```env
# ─── Clerk Authentication ────────────────────────────────
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
CLERK_WEBHOOK_SECRET=whsec_...

# ─── Neon PostgreSQL Database ────────────────────────────
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require

# ─── Pinata / IPFS ───────────────────────────────────────
PINATA_API_KEY=your_pinata_api_key
PINATA_API_SECRET=your_pinata_api_secret
PINATA_JWT=your_pinata_jwt

# ─── Blockchain ──────────────────────────────────────────
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
```

Create a `.env` file inside the `Blockchain/` directory:

```env
PRIVATE_KEY=your_wallet_private_key_without_0x
RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
```

> ⚠️ **Never commit your `.env` files to version control. Use `.gitignore`.**

---

## 📜 Smart Contract

The `VeriFi.sol` contract is deployed on the EVM and enforces all business rules on-chain.

**Contract:** `VeriFi` | **Compiler:** `^0.8.20` | **Library:** OpenZeppelin `AccessControl`

### Roles

| Role | Identifier | Permissions |
|:---|:---|:---|
| `DEFAULT_ADMIN_ROLE` | Deployer | Add/remove verifiers, assign hashcodes |
| `VERIFIER_ROLE` | University wallets | Upload, retrieve, delete documents |
| *(public)* | Any wallet | Request access, grant/reject access |

### Key Functions

```solidity
// ── Document Management (VERIFIER_ROLE only) ─────────────
uploadDocument(uint256 documentId, string title, string description, string documentType)
retrieveDocument(uint256 documentId) → (title, description, documentType, uploader)
deleteDocument(uint256 documentId)

// ── Verifier Management (DEFAULT_ADMIN_ROLE only) ─────────
addVerifier(address verifier)
removeVerifier(address verifier)
addHashCode(string hashcode, address studentAddress)

// ── Access Control (public) ───────────────────────────────
requestAccess(uint256 documentId, address employerAddress)
grantAccess(address employerAddress, uint256 documentId)
rejectAccess(address employerAddress, uint256 documentId)
getAddressFromHashCode(string hashcode) → address
```

### Events

```solidity
event DocumentUploaded(uint256 indexed documentId, ...);
event DocumentDeleted(uint256 indexed documentId, ...);
event AccessRequested(address indexed studentAddress, uint256 indexed documentId, address indexed employerAddress);
event AccessGranted(address indexed employerAddress, uint256 indexed documentId, address indexed studentAddress);
event AccessRejected(address indexed employerAddress, uint256 indexed documentId, address indexed studentAddress);
event HashCodeAdded(string indexed hashcode, address indexed studentAddress);
```

---

## 🗄️ Database Schema

VeriFi uses a **PostgreSQL** database (Neon) managed by **Drizzle ORM** as a hybrid layer alongside the blockchain for fast querying of off-chain metadata.

```
┌────────────┐     ┌──────────────┐     ┌───────────────┐
│   users    │────▶│   students   │────▶│   documents   │
│ (Clerk ID) │     │ (hexcode,    │     │ (ipfs_hash,   │
│            │     │  wallet_addr)│     │  status, meta)│
└────────────┘     └──────────────┘     └───────────────┘
       │                  │                     │
       │           ┌──────────────┐    ┌────────────────┐
       ├──────────▶│  verifiers   │    │ access_requests│
       │           │ (university) │    │ (org, student, │
       │           └──────────────┘    │  doc, expires) │
       │                               └────────────────┘
       │           ┌──────────────┐             │
       └──────────▶│ organizations│─────────────┘
                   │ (employer)   │
                   └──────────────┘
```

| Table | Description |
|:---|:---|
| `users` | Base user record linked to Clerk identity |
| `students` | Student profile with unique `hexcode` and `wallet_address` |
| `verifiers` | University verifier with `verifier_id` and `web3_wallet` |
| `organizations` | Employer organizations with `web3_wallet` |
| `documents` | Credential records with `ipfs_hash`, `url`, `status`, `metadata` |
| `access` | Approved access grants with `access_duration` |
| `access_requests` | Full lifecycle: pending → approved/rejected with `expires_at` |

---

## 🔌 API Reference

All API routes are located at `/api/**` and built with the **Hono** framework.

| Method | Endpoint | Role | Description |
|:---|:---|:---|:---|
| `POST` | `/api/auth` | * | Clerk webhook — create/sync user |
| `GET` | `/api/user` | * | Get current user profile |
| `GET` | `/api/student` | Student | Get student profile & documents |
| `POST` | `/api/student` | Admin | Register a new student |
| `GET` | `/api/verifier` | Verifier | Get verifier profile |
| `POST` | `/api/upload` | Verifier | Pin file to IPFS + store metadata |
| `GET` | `/api/document` | * | Retrieve document by ID |
| `POST` | `/api/document` | Verifier | Create document record |
| `GET` | `/api/access` | * | Get access requests for caller |
| `POST` | `/api/access` | Org | Submit an access request |
| `PATCH` | `/api/access` | Student | Approve or reject access request |
| `GET` | `/api/organization` | Org | Get organization profile |
| `POST` | `/api/organization` | Admin | Register organization |

---

## 🛣️ Roadmap

- [x] Smart contract with RBAC (OpenZeppelin `AccessControl`)
- [x] IPFS document upload via Pinata
- [x] Clerk authentication with webhook provisioning
- [x] Student, Verifier, and Organization dashboards
- [x] On-chain access request → grant → reject lifecycle
- [x] Time-bounded document access with expiry tracking
- [x] Database schema with Drizzle ORM
- [ ] 📧 Email notifications for access events (Resend / SendGrid)
- [ ] 🌐 Multi-chain support (Polygon, Base, Arbitrum)
- [ ] 📱 Mobile-responsive PWA enhancements
- [ ] 🔍 Public credential lookup via QR code
- [ ] 📊 Advanced analytics dashboard for verifiers
- [ ] 🤖 AI-powered credential fraud detection
- [ ] 🌍 Decentralized identity (DID) integration (W3C standard)

---
## 🌐 **Connect**

- **GitHub**: [@vinay-th](https://github.com/vinay-th)
- **Twitter**: [@code-with-vinay](https://x.com/code_with_vinay)
- **LinkedIn**: [@vinay-thakor](https://www.linkedin.com/in/vinay-thakor/)

---

<div align="center">
  <h3>Built with ❤️ by Vinay Codes</h3>
</div>
