# VeriFi — Developer & Product Documentation

> **Version:** 1.0 · **Last Updated:** March 2026 · **Status:** Development

---

## Table of Contents

| # | Section |
|---|---------|
| 1 | [Product Overview](#1-product-overview) |
| 2 | [System Architecture](#2-system-architecture) |
| 3 | [Authentication & Authorization](#3-authentication--authorization) |
| 4 | [Role-Based Access Control](#4-role-based-access-control) |
| 5 | [Database Reference](#5-database-reference) |
| 6 | [Smart Contract Reference](#6-smart-contract-reference) |
| 7 | [IPFS & Storage Layer](#7-ipfs--storage-layer) |
| 8 | [API Reference](#8-api-reference) |
| 9 | [Frontend Architecture](#9-frontend-architecture) |
| 10 | [Blockchain Client SDK](#10-blockchain-client-sdk) |
| 11 | [Local Development Setup](#11-local-development-setup) |
| 12 | [Environment Variables](#12-environment-variables) |
| 13 | [Database Migrations](#13-database-migrations) |
| 14 | [Deployment Guide](#14-deployment-guide) |
| 15 | [Error Reference](#15-error-reference) |
| 16 | [Security Considerations](#16-security-considerations) |
| 17 | [Glossary](#17-glossary) |

---

## 1. Product Overview

**VeriFi** is a full-stack, development-grade credential verification platform that combines Ethereum smart contracts, IPFS decentralized storage, and a modern Next.js 15 web application to permanently and transparently verify academic documents.

### Problem Statement

| Challenge | Traditional Systems | VeriFi |
|-----------|---------------------|--------|
| **Fraud** | Easy to forge paper documents | IPFS content-hashing makes tampering cryptographically impossible |
| **Verification Speed** | Days to weeks (phone/email back-and-forth) | Near-instant on-chain lookup |
| **Data Sovereignty** | Institution controls records | Student approves every access request, on-chain |
| **Auditability** | Opaque internal logs | All actions emit public, indexed blockchain events |
| **Access Expiry** | Manual revocation | Time-bounded access with `expires_at` recorded on-chain |

### Core Value Propositions

- 🔗 **Immutable** — Documents are hash-linked to Ethereum; no one can alter them
- 🔒 **Privacy-First** — Students control who accesses what and for how long
- ⚡ **Instant** — On-chain lookups replace email chains and manual calls
- 🌐 **Decentralized Storage** — IPFS ensures no single point of failure
- 🏛️ **Institution-Grade** — Role-Based Access Control, audit trails, and verifier management

---

## 2. System Architecture

### High-Level Overview

```
                        ┌────────────────────────────────────────┐
                        │           USER (Browser)               │
                        │   Next.js 15 App  +  MetaMask Wallet   │
                        └─────────────────┬──────────────────────┘
                                          │  HTTPS / WS
                         ┌────────────────▼──────────────────────┐
                         │         Next.js Application           │
                         │   ┌──────────────┐  ┌─────────────┐  │
                         │   │  App Router  │  │  Hono API   │  │
                         │   │  (RSC + SSR) │  │  /api/**    │  │
                         │   └──────────────┘  └──────┬──────┘  │
                         │         │                  │         │
                         └─────────┼──────────────────┼─────────┘
                                   │                  │
              ┌────────────────────┼──────────────────┼──────────────────┐
              │                   │                  │                   │
    ┌─────────▼──────┐  ┌─────────▼──────┐  ┌───────▼────────┐  ┌──────▼──────┐
    │  Clerk Auth    │  │  Neon Postgres  │  │ Pinata / IPFS  │  │  Ethereum   │
    │  (JWT / OAuth) │  │  + Drizzle ORM │  │  (File Storage)│  │  Smart Cont │
    └────────────────┘  └────────────────┘  └────────────────┘  └─────────────┘
```

### Data Flow — Document Upload Pipeline

```
Verifier selects file
        │
        ▼
POST /api/upload (multipart/form-data)
        │
        ├─ 1. Validate verifier exists in DB
        ├─ 2. Validate student has wallet_address
        ├─ 3. Pin file to IPFS via Pinata SDK → returns IpfsHash
        ├─ 4. Call VeriFi.sol → addHashCode(IpfsHash, studentWalletAddress)
        └─ 5. Insert document row into PostgreSQL (status: "verified")
                │
                ▼
        Return { success, ipfsHash, metadata }
```

### Data Flow — Access Request Pipeline

```
Organization submits access request via UI
        │
        ├─ 1. POST /api/student/request-access → insert access row (status: "pending")
        ├─ 2. VeriFi.sol → requestAccess(documentId, employerAddress)  [on-chain event]
        │
        ▼ Student reviews pending requests in dashboard
        │
        ├─ APPROVE → PATCH /api/student/approve-access + VeriFi.sol.grantAccess()
        └─ REJECT  → PATCH /api/student/handle-request + VeriFi.sol.rejectAccess()
```

### Technology Matrix

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Framework** | Next.js | 15.1.7 | Full-stack React with App Router |
| **UI Library** | React | 19.0.0 | Component-based UI |
| **Language** | TypeScript | 5.x | Type safety across the stack |
| **Styling** | Tailwind CSS | 3.4.x | Utility-first CSS |
| **Components** | Shadcn/ui + Radix UI | latest | Accessible UI primitives |
| **Animations** | GSAP + Framer Motion | 3.12 / 12.4 | Scroll animations & transitions |
| **Charts** | Recharts | 2.15 | Dashboard data visualization |
| **API** | Hono | 4.7 | Lightweight edge-ready API handler |
| **Auth** | Clerk | 6.12 | Authentication & user provisioning |
| **Database** | Neon (PostgreSQL) | serverless | Relational data store |
| **ORM** | Drizzle ORM | 0.39 | Type-safe schema & query builder |
| **Blockchain** | Ethereum / Hardhat | EVM | Smart contract environment |
| **Smart Contract** | Solidity | ^0.8.20 | On-chain logic |
| **Contract Lib** | OpenZeppelin | 5.2 | Battle-tested RBAC & security |
| **Web3 Client** | ethers.js | 6.13.5 | Ethereum interaction |
| **IPFS Pinning** | Pinata | SDK 2.1 | Decentralized storage |
| **Webhooks** | Svix | 1.57 | Clerk event delivery |

---

## 3. Authentication & Authorization

VeriFi uses **Clerk** as its authentication provider. Clerk handles sign-up, sign-in, social OAuth, session management, and JWTs. All routes are protected via Next.js middleware.

### Middleware

```typescript
// src/middleware.ts
import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|...)).*)',
    '/(api|trpc)(.*)',
  ],
};
```

> **Behavior:** Every non-static route passes through Clerk authentication. Anonymous users are redirected to `/sign-in`.

### Webhook-Driven User Provisioning

When a user signs up via Clerk, a webhook fires to `/api/auth/user`. This handler:

1. Verifies the webhook signature using `Svix`
2. Extracts `user.id`, `email`, `name` from the event
3. Inserts a row into the `users` table with `role: 'user'`

```
Clerk → POST /api/auth/user (svix-signature header)
                │
                └─ db.insert(users).values({ id, name, email, role: 'user' })
```

### Internal API Key Auth

All Hono-based internal API routes are protected by a custom `keyAuth` middleware that checks for a shared API key in the `x-api-key` header.

```
x-api-key: DADDY-IS-HOME
```

> ⚠️ **This key should be rotated and moved to an environment variable before development deployment.**

### Route Authentication Matrix

| Route | Auth Method | Role Required |
|-------|------------|--------------|
| `/sign-in`, `/sign-up` | Public | — |
| `/get-started` | Clerk session | Any authenticated user |
| `/student-dashboard/**` | Clerk session | `student` role |
| `/verifier-dashboard/**` | Clerk session | `verifier` role |
| `/organization-dashboard/**` | Clerk session | `organization` role |
| `/api/upload` | Clerk session (implicit) | `verifier` |
| `/api/student/**` | `x-api-key` header | Internal services |
| `/api/verifier/**` | Clerk auth + `x-api-key` | Internal services |
| `/api/auth/user` | Svix webhook signature | Clerk infrastructure |

---

## 4. Role-Based Access Control

VeriFi implements a two-layer RBAC system:

1. **Application Level** — Role stored in `users.role` (PostgreSQL), enforced by Next.js middleware and API handlers
2. **Smart Contract Level** — OpenZeppelin `AccessControl` enforced on-chain at the EVM level

### Application Roles

| Role | `users.role` value | Dashboard | Key Permissions |
|------|-------------------|-----------|----------------|
| **Student** | `student` | `/student-dashboard` | View own documents, manage access requests |
| **Verifier** | `verifier` | `/verifier-dashboard` | Upload documents, manage students |
| **Organization** | `organization` | `/organization-dashboard` | Request document access |
| **Admin** | `admin` | — | Full API access |

### Smart Contract Roles

| Role | `bytes32` identifier | Assigned To | Permissions |
|------|---------------------|-------------|-------------|
| `DEFAULT_ADMIN_ROLE` | `0x00` | Contract deployer | Manage verifiers, add hashcodes |
| `VERIFIER_ROLE` | `keccak256("VERIFIER_ROLE")` | University wallets | Upload, retrieve, delete documents |
| *(none)* | — | Students & Orgs | Request/grant/reject access (public functions) |

---

## 5. Database Reference

VeriFi uses **Neon** (serverless PostgreSQL) with **Drizzle ORM** for type-safe schema management.

### Entity Relationship Diagram

```
users (Clerk ID)
  │
  ├──▶ students (enrolment_id, hexcode, wallet_address)
  │         │
  │         ├──▶ documents (ipfs_hash, url, status, metadata)
  │         │         │
  │         │         └──▶ access_requests (org, duration, expires_at, status)
  │         │
  │         └──▶ access (access_duration, access_type, status)
  │
  ├──▶ verifiers (verifier_id, university_name, web3_wallet)
  │
  └──▶ organizations (organization_name, web3_wallet)
```

### Table Reference

#### `users`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `text` | PRIMARY KEY | Clerk user ID |
| `name` | `text` | NOT NULL | Display name |
| `email` | `text` | NOT NULL, UNIQUE | User's email address |
| `role` | `text` | NOT NULL, DEFAULT `'user'` | Application role |
| `web3_wallet` | `text` | UNIQUE | Ethereum wallet address |
| `created_at` | `timestamp` | NOT NULL, DEFAULT NOW | Record creation time |

#### `students`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `enrolment_id` | `serial` | PRIMARY KEY | Auto-increment enrolment identifier |
| `user_id` | `text` | FK → `users.id`, NOT NULL | Clerk user reference |
| `name` | `text` | NOT NULL | Student's full name |
| `email` | `text` | NOT NULL | Student's email |
| `hexcode` | `text` | NOT NULL, UNIQUE | Generated identity hash (`0x` prefixed) |
| `verifier` | `text` | NOT NULL, DEFAULT `'false'` | Assigned verifier ID or `'false'` |
| `wallet_address` | `text` | UNIQUE | Connected Ethereum wallet |
| `created_at` | `timestamp` | NOT NULL, DEFAULT NOW | Registration time |

#### `verifiers`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `serial` | PRIMARY KEY | Auto-increment row ID |
| `verifier_id` | `text` | NOT NULL, UNIQUE | Application-assigned verifier ID |
| `user_id` | `text` | FK → `users.id`, NOT NULL | Clerk user reference |
| `name` | `text` | NOT NULL | Verifier name |
| `email` | `text` | NOT NULL, UNIQUE | Verifier's email |
| `university_name` | `text` | — | Affiliated university |
| `web3_wallet` | `text` | UNIQUE | Verifier's Ethereum wallet (used for VERIFIER_ROLE) |
| `created_at` | `timestamp` | NOT NULL, DEFAULT NOW | Registration time |

#### `organizations`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `organization_id` | `serial` | PRIMARY KEY | Auto-increment org identifier |
| `user_id` | `text` | FK → `users.id`, NOT NULL | Clerk user reference |
| `organization_name` | `text` | NOT NULL, UNIQUE | Legal name of organization |
| `web3_wallet` | `text` | UNIQUE | Org's Ethereum wallet |
| `created_at` | `timestamp` | NOT NULL, DEFAULT NOW | Registration time |

#### `documents`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `document_id` | `serial` | PRIMARY KEY | Auto-increment document ID |
| `student_id` | `integer` | FK → `students.enrolment_id`, NOT NULL | Owning student |
| `ipfs_hash` | `text` | NOT NULL, UNIQUE | IPFS CIDv0 content identifier |
| `url` | `text` | NOT NULL, UNIQUE | Pinata gateway URL for file access |
| `verifier_id` | `text` | FK → `verifiers.verifier_id`, NOT NULL | Issuing verifier |
| `document_name` | `text` | NOT NULL | Human-readable document title |
| `status` | `text` | NOT NULL, DEFAULT `'pending'` | `pending` \| `verified` \| `rejected` |
| `metadata` | `text` | — | Document type / additional metadata |
| `created_at` | `timestamp` | NOT NULL, DEFAULT NOW | Upload time |
| `updated_at` | `timestamp` | DEFAULT NOW | Last modification time |

#### `access`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `access_id` | `serial` | PRIMARY KEY | Auto-increment access grant ID |
| `student_id` | `integer` | FK → `students.enrolment_id`, NOT NULL | Document owner |
| `organization_id` | `integer` | FK → `organizations.organization_id`, NOT NULL | Requesting org |
| `document_id` | `integer` | FK → `documents.document_id`, NOT NULL | The document |
| `hexcode` | `text` | NOT NULL | Student's on-chain identity hexcode |
| `request_time` | `timestamp` | NOT NULL, DEFAULT NOW | When access was requested |
| `access_duration` | `text` | NOT NULL | Duration string (e.g. `"24h"`, `"7d"`) |
| `status` | `text` | NOT NULL, DEFAULT `'pending'` | `pending` \| `approved` \| `rejected` |
| `access_type` | `text` | NOT NULL | Type of access (`read`, `download`, etc.) |

#### `access_requests`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `request_id` | `varchar` | PRIMARY KEY | UUID or custom request identifier |
| `document_id` | `serial` | FK → `documents.document_id` | Requested document |
| `organization_id` | `serial` | FK → `organizations.organization_id` | Requesting organization |
| `student_id` | `serial` | FK → `students.enrolment_id` | Document owner |
| `status` | `varchar` | DEFAULT `'pending'` | `pending` \| `approved` \| `rejected` |
| `requested_at` | `timestamp` | DEFAULT NOW | Request submission time |
| `expires_at` | `timestamp` | — | When access expires |
| `duration_hours` | `serial` | — | Requested duration in hours |

---

## 6. Smart Contract Reference

**Contract Name:** `VeriFi`  
**File:** `Blockchain/contracts/VeriFi.sol`  
**Solidity Version:** `^0.8.20`  
**Inherits:** `AccessControl`, `Strings` (OpenZeppelin v5.2)  
**Network:** Ethereum (Hardhat local: chain ID `31337` / Sepolia testnet)

### State Variables

| Variable | Type | Visibility | Description |
|----------|------|-----------|-------------|
| `VERIFIER_ROLE` | `bytes32` | `public constant` | `keccak256("VERIFIER_ROLE")` |
| `documents` | `mapping(uint256 => Document)` | `public` | Document ID → Document struct |
| `documentExists` | `mapping(uint256 => bool)` | `public` | Quick existence check |
| `pendingRequests` | `mapping(address => mapping(uint256 => mapping(address => bool)))` | `public` | `student → documentId → employer → hasPendingRequest` |
| `hashToAddress` | `mapping(string => address)` | `public` | IPFS hash → student wallet |
| `accessGrantTimestamps` | `mapping(address => mapping(uint256 => uint256))` | `public` | `employer → documentId → grantedAt (unix timestamp)` |

### Document Struct

```solidity
struct Document {
    string title;         // Document title
    string description;   // Document description
    string documentType;  // Category of credential
    address uploader;     // Verifier wallet that uploaded
}
```

### Functions

#### Document Management

```solidity
/// @notice Upload a document. Requires VERIFIER_ROLE.
/// @param documentId  Unique uint256 identifier
/// @param title       Non-empty document title
/// @param description Optional description
/// @param documentType Non-empty type string
function uploadDocument(
    uint256 documentId,
    string memory title,
    string memory description,
    string memory documentType
) external onlyRole(VERIFIER_ROLE)
```

```solidity
/// @notice Retrieve a document by ID. Requires VERIFIER_ROLE.
/// @return title, description, documentType, uploader
function retrieveDocument(uint256 documentId)
    external view onlyRole(VERIFIER_ROLE)
    returns (string memory, string memory, string memory, address)
```

```solidity
/// @notice Delete a document. Only the original uploader can delete.
function deleteDocument(uint256 documentId)
    external onlyRole(VERIFIER_ROLE)
```

#### Verifier Management

```solidity
/// @notice Grant VERIFIER_ROLE to a wallet. Requires DEFAULT_ADMIN_ROLE.
function addVerifier(address verifier) external onlyRole(DEFAULT_ADMIN_ROLE)

/// @notice Revoke VERIFIER_ROLE from a wallet. Requires DEFAULT_ADMIN_ROLE.
function removeVerifier(address verifier) external onlyRole(DEFAULT_ADMIN_ROLE)
```

#### Hashcode / Identity

```solidity
/// @notice Bind an 8-byte IPFS hash to a student wallet. Requires DEFAULT_ADMIN_ROLE.
/// @param hashcode    Must be exactly 8 characters
/// @param studentAddress  Target wallet
function addHashCode(string memory hashcode, address studentAddress)
    external onlyRole(DEFAULT_ADMIN_ROLE)

/// @notice Look up the student wallet for a given hashcode (public).
function getAddressFromHashCode(string memory hashcode)
    external view returns (address)
```

#### Access Control

```solidity
/// @notice Student requests on-chain sharing of a document to an employer.
function requestAccess(uint256 documentId, address employerAddress) external

/// @notice Student approves a pending request. Records block.timestamp.
function grantAccess(address employerAddress, uint256 documentId) external

/// @notice Student rejects a pending request.
function rejectAccess(address employerAddress, uint256 documentId) external

/// @notice Returns employer addresses with pending requests (up to 100).
function getPendingRequests(address studentAddress, uint256 documentId)
    external view returns (address[] memory)
```

### Events

| Event | Parameters | Emitted When |
|-------|-----------|-------------|
| `DocumentUploaded` | `documentId, title, description, documentType, uploader` | Document uploaded |
| `DocumentDeleted` | `documentId, verifier` | Document deleted |
| `VerifierAdded` | `verifier` | Verifier role granted |
| `VerifierRemoved` | `verifier` | Verifier role revoked |
| `AccessRequested` | `studentAddress, documentId, employerAddress` | Access request submitted |
| `AccessGranted` | `employerAddress, documentId, studentAddress` | Student approves access |
| `AccessRejected` | `employerAddress, documentId, studentAddress` | Student rejects access |
| `HashCodeAdded` | `hashcode, studentAddress` | IPFS hash linked to wallet |

### Error Conditions

| Revert Reason | Function | Cause |
|---------------|----------|-------|
| `"Document already exists"` | `uploadDocument` | `documentId` already registered |
| `"Title cannot be empty"` | `uploadDocument` | Empty title string |
| `"Document type cannot be empty"` | `uploadDocument` | Empty type string |
| `"Document does not exist"` | `retrieveDocument`, `deleteDocument`, `requestAccess`, `grantAccess`, `rejectAccess` | Invalid `documentId` |
| `"Only the uploader can delete the document"` | `deleteDocument` | Caller ≠ `doc.uploader` |
| `"No pending request"` | `grantAccess`, `rejectAccess` | No pending request for that employer |
| `"Hashcode must be 8 digits"` | `addHashCode` | hashcode length ≠ 8 |
| `"Hashcode already exists"` | `addHashCode` | Duplicate hashcode |

---

## 7. IPFS & Storage Layer

VeriFi uses **Pinata** as the IPFS pinning service. Files are pinned with `CIDv0` and accessible via the Pinata public gateway.

### Upload Flow

```typescript
// Simplified from /api/upload/route.ts
const pinata = new pinataSDK(PINATA_API_KEY, PINATA_API_SECRET);

// Convert file to Node.js Readable stream
const buffer = Buffer.from(await file.arrayBuffer());
const stream = Readable.from(buffer);

// Pin to IPFS
const result = await pinata.pinFileToIPFS(stream, {
  pinataMetadata: { name: file.name },
  pinataOptions: { cidVersion: 0 },
});

// result.IpfsHash → e.g. "QmXyz..."
const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
```

### Document Metadata Structure

Along with the file, the following metadata is captured and stored in `documents.metadata`:

```typescript
interface DocumentMetadata {
  title: string;          // Document display name
  documentType: string;   // e.g. "Degree Certificate", "Transcript"
  fileName: string;       // Original file name
  fileSize: number;       // Bytes
  fileType: string;       // MIME type
  studentId: string;      // Clerk user ID
  timestamp: string;      // ISO 8601 upload time
}
```

### Storage Architecture Rationale

| Concern | Solution |
|---------|----------|
| File immutability | IPFS content addressing — same content = same CID |
| Availability | Pinata providing commercial pinning SLA |
| On-chain proof | IPFS hash stored in smart contract via `addHashCode()` |
| Fast access | Pinata gateway URL stored in PostgreSQL for low-latency reads |
| Tamper detection | Content-addressed retrieval — any modification changes the CID |

---

## 8. API Reference

All API routes are under `/api/` and use **Hono** as the handler framework. Internal routes require `x-api-key: DADDY-IS-HOME` header. Authentication routes use Clerk's `clerkMiddleware`.

### Base URL

```
Development:  http://localhost:3000/api
development:   https://your-domain.com/api
```

---

### `POST /api/upload`

Upload a credential document to IPFS and record it on-chain and in the database.

**Auth:** Implicit Clerk session (verifier must be logged in)

**Request:** `multipart/form-data`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | `File` | ✅ | The credential document (PDF, image, etc.) |
| `title` | `string` | ✅ | Human-readable document name |
| `metadata` | `string` | — | Document type / category |
| `studentId` | `string` | ✅ | Clerk user ID of the target student |
| `verifierId` | `string` | ✅ | Clerk user ID of the uploading verifier |

**Success Response `200`:**

```json
{
  "success": true,
  "ipfsHash": "QmXyzAbcDef123...",
  "metadata": {
    "title": "B.Tech Degree Certificate",
    "documentType": "Degree",
    "fileName": "degree.pdf",
    "fileSize": 204800,
    "fileType": "application/pdf",
    "studentId": "user_2abc...",
    "timestamp": "2026-03-17T15:04:22.000Z"
  }
}
```

**Error Responses:**

| Status | Error Message | Cause |
|--------|--------------|-------|
| `400` | `"File, title, student ID, and verifier ID are required"` | Missing required fields |
| `400` | `"Student has not connected a Web3 wallet"` | No `wallet_address` on student record |
| `404` | `"Verifier not found"` | `verifierId` not in `verifiers` table |
| `500` | `"Failed to add document to blockchain"` | Smart contract transaction failed |
| `500` | `"Failed to store document in database"` | PostgreSQL insert failed |

---

### `GET /api/student/get-all-students`

Returns all registered students.

**Auth:** `x-api-key` header  
**Response:** `Student[]`

---

### `GET /api/student/get-student-by-id?id={clerkUserId}`

Returns a single student by their Clerk user ID.

**Auth:** `x-api-key` header

**Query Params:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | ✅ | Clerk user ID |

**Success `200`:** Student record object  
**Error `404`:** `{ "error": "Student not found" }`

---

### `PATCH /api/student/update-student`

Update a student's mutable fields.

**Auth:** `x-api-key` header  
**Body:** `application/json`

```json
{
  "id": "user_2abc...",
  "name": "John Doe",
  "wallet_address": "0xAbCd..."
}
```

**Response `200`:** `{ "message": "Student updated successfully" }`

---

### `DELETE /api/student/delete-student?id={clerkUserId}`

Permanently delete a student record.

**Auth:** `x-api-key` header  
**Response `200`:** `{ "message": "Student deleted successfully" }`

---

### `POST /api/student/register-student`

Register a new student. Creates corresponding `users` row if it doesn't exist and generates a unique on-chain `hexcode`.

**Auth:** `x-api-key` header  
**Body:** `application/json`

```json
{
  "user_id": "user_2abc...",
  "name": "Jane Smith",
  "email": "jane@example.com"
}
```

**Success `200`:** Full student record with generated `hexcode`

---

### `POST /api/student/allot-verifier`

Assign a verifier to a student.

**Auth:** `x-api-key` header  
**Body:**

```json
{
  "enrolment_id": 42,
  "verifier_id": "verifier_xyz"
}
```

---

### `GET /api/student/get-hexcode?id={enrolmentId}`

Retrieve a student's unique on-chain hexcode by enrolment ID.

**Auth:** `x-api-key` header  
**Response `200`:** `"0xabcdef12"` (string)

---

### `GET /api/student/get-all-documents?id={clerkUserId}`

Retrieve all documents associated with a student.

**Auth:** `x-api-key` header  
**Response `200`:** `Document[]` — empty array returned for new students (not a 404)

---

### `POST /api/student/request-access`

Record an access request from an organization to a student's document in the database.

**Auth:** `x-api-key` header  
**Body:**

```json
{
  "student_id": 1,
  "organization_id": 5,
  "document_id": 12,
  "access_duration": "24h",
  "status": "pending",
  "hexcode": "0xabcdef12",
  "access_type": "read"
}
```

---

### `POST /api/auth/user`

Clerk webhook handler. Creates a user record on signup.  
**Auth:** Svix signature verification  
**Do not call directly.**

---

## 9. Frontend Architecture

### Directory Structure — `src/app/`

```
app/
├── page.tsx                        # Landing page with GSAP animations
├── layout.tsx                      # Root layout: Clerk provider, fonts
├── globals.css                     # Global CSS custom properties
│
├── get-started/                    # Onboarding: role selection
│   └── page.tsx
│
├── sign-in/                        # Clerk hosted sign-in
├── sign-up/                        # Clerk hosted sign-up
│
├── student-dashboard/              # 🎓 Student role
│   ├── layout.tsx                  # Sidebar + Navbar layout
│   └── page.tsx                    # Document list, pending requests
│
├── verifier-dashboard/             # 🏛️ Verifier role
│   ├── layout.tsx
│   └── page.tsx                    # Upload form, student management
│
├── organization-dashboard/         # 🏢 Organization role
│   └── page.tsx                    # Access request management
│
├── document-viewer/                # IPFS document preview
│   └── page.tsx
│
├── payment-success/                # Post-payment confirmation
└── payment-cancelled/              # Cancelled payment redirect
```

### Component Architecture

```
src/components/
├── ui/                   # Shadcn/ui primitives (Button, Card, Dialog, etc.)
├── magicui/              # MagicUI components (animated text, sparkles, etc.)
└── my-ui/                # Domain-specific components
    ├── VerifiUploadCard.tsx    # Document upload interface for verifiers
    ├── StudentCard.tsx         # Student profile display card
    ├── AccessRequestCard.tsx   # Access request UI for organizations
    └── ...
```

### Key Third-Party Libraries

| Library | Import Path | Use Case |
|---------|------------|---------|
| `gsap` | `gsap` | Landing page scroll-trigger animations |
| `motion` | `framer-motion` | Dashboard micro-animations, layout transitions |
| `recharts` | `recharts` | Document & access statistics charts |
| `sonner` | `sonner` | Toast notification system |
| `lucide-react` | `lucide-react` | Iconography throughout dashboards |
| `next-themes` | `next-themes` | Light/Dark theme management |
| `class-variance-authority` | `cva` | Type-safe variant styling |
| `tailwind-merge` | `twMerge` | Merge Tailwind classes without conflicts |

---

## 10. Blockchain Client SDK

`src/lib/contract.ts` exposes a typed `DocumentContract` class that abstracts all smart contract interactions.

### Configuration

```typescript
const CONTRACT_CONFIG = {
  address: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
  rpcUrl: 'http://127.0.0.1:8545/',
  chainId: 31337, // Hardhat default
  privateKey: process.env.NEXT_PUBLIC_WALLET_PRIVATE_KEY || '',
};
```

> ⚠️ **Update `address` and `chainId` when deploying to testnet/mainnet.**

### Provider Strategy

The SDK automatically selects a provider:

1. **Browser + MetaMask detected** → `BrowserProvider(window.ethereum)` — user signs with their wallet
2. **Server-side / no MetaMask** → `JsonRpcProvider(rpcUrl)` + `Wallet(privateKey)` — uses server wallet

### `DocumentContract` Methods

```typescript
// Retrieve document metadata from on-chain
DocumentContract.retrieveDocument(documentId: number): Promise<ContractDocument | null>

// Upload document record to blockchain (VERIFIER_ROLE required)
DocumentContract.uploadDocument(id, title, description, type): Promise<TransactionResult>

// Fetch all documents for a user (via internal API)
DocumentContract.getUserDocuments(userId: string): Promise<ContractDocument[]>

// Access lifecycle
DocumentContract.requestAccess(documentId, employerAddress): Promise<TransactionResult>
DocumentContract.approveAccess(documentId, employerAddress): Promise<TransactionResult>
DocumentContract.rejectAccess(documentId, employerAddress): Promise<TransactionResult>

// Pending request lookup
DocumentContract.getPendingRequests(studentAddress, documentId): Promise<string[]>

// Hashcode / identity
DocumentContract.addHashCode(hashcode, studentAddress): Promise<TransactionResult>
DocumentContract.getAddressFromHashCode(hashcode): Promise<string | null>
```

### `TransactionResult` Type

```typescript
interface TransactionResult {
  success: boolean;
  hash?: string;    // Transaction hash on success
  error?: string;   // Error message on failure
}
```

---

## 11. Local Development Setup

### Prerequisites

- Node.js `>= 20.x`
- npm `>= 10.x`
- Git
- MetaMask browser extension
- Clerk account → [clerk.com](https://clerk.com)
- Neon account → [neon.tech](https://neon.tech)
- Pinata account → [pinata.cloud](https://pinata.cloud)

---

### Step 1 — Clone Repository

```bash
git clone https://github.com/vinay-th/VeriFi.git
cd VeriFi
```

### Step 2 — Start Local Blockchain

```bash
cd Blockchain
npm install

# Start Hardhat node (keep this terminal open)
npx hardhat node
```

You'll see 20 pre-funded test accounts. Copy the **first private key** for your `.env` files.

### Step 3 — Deploy Smart Contract

In a second terminal:

```bash
cd Blockchain

# Compile
npx hardhat compile

# Deploy to local node
npx hardhat run scripts/deploy.js --network localhost
```

**Important:** Copy the deployed contract address from the output. Update `CONTRACT_CONFIG.address` in `src/lib/contract.ts`.

### Step 4 — Application Setup

```bash
cd ../application
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your keys (see Environment Variables section)

# Push schema to Neon
npm run db:generate
npm run db:migrate

# Start dev server
npm run dev
```

App runs at: [http://localhost:3000](http://localhost:3000)

### Step 5 — Run Contract Tests

```bash
cd Blockchain
npx hardhat test
```

---

## 12. Environment Variables

### Application — `.env.local`

```env
# ─── Clerk ───────────────────────────────────────────────────────────────────
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/get-started
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/get-started
CLERK_WEBHOOK_SECRET=whsec_...

# ─── Neon PostgreSQL ─────────────────────────────────────────────────────────
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require

# ─── Pinata / IPFS ───────────────────────────────────────────────────────────
PINATA_API_KEY=your_pinata_api_key
PINATA_API_SECRET=your_pinata_api_secret
PINATA_JWT=your_pinata_jwt_token

# ─── Blockchain ──────────────────────────────────────────────────────────────
NEXT_PUBLIC_CONTRACT_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545
NEXT_PUBLIC_WALLET_PRIVATE_KEY=0x...your_server_wallet_private_key
```

### Blockchain — `Blockchain/.env`

```env
# Server wallet used for admin contract calls
PRIVATE_KEY=your_wallet_private_key_without_0x

# RPC endpoint (Hardhat local or Infura/Alchemy)
RPC_URL=http://127.0.0.1:8545
```

### Variable Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | ✅ | Clerk frontend publishable key |
| `CLERK_SECRET_KEY` | ✅ | Clerk backend secret key |
| `CLERK_WEBHOOK_SECRET` | ✅ | Svix secret for webhook verification |
| `DATABASE_URL` | ✅ | Neon PostgreSQL connection string |
| `PINATA_API_KEY` | ✅ | Pinata API key for IPFS uploads |
| `PINATA_API_SECRET` | ✅ | Pinata API secret |
| `PINATA_JWT` | ✅ | Pinata JWT (alternative auth method) |
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | ✅ | Deployed VeriFi.sol contract address |
| `NEXT_PUBLIC_RPC_URL` | ✅ | Ethereum RPC endpoint URL |
| `NEXT_PUBLIC_WALLET_PRIVATE_KEY` | ✅ | Admin wallet private key for server-side contract calls |

> 🔐 **Never expose `NEXT_PUBLIC_WALLET_PRIVATE_KEY` in client-side code in development. Move admin calls to a secured server action or API route.**

---

## 13. Database Migrations

VeriFi uses **Drizzle Kit** for schema migrations.

### Configuration (`drizzle.config.ts`)

```typescript
export default defineConfig({
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL! },
  out: './drizzle',   // Migration files output directory
  verbose: true,
  strict: true,
});
```

### Migration Commands

| Command | Description |
|---------|-------------|
| `npm run db:generate` | Diff schema and generate SQL migration files in `./drizzle/` |
| `npm run db:migrate` | Apply pending migrations to the database |
| `npm run db:studio` | Open Drizzle Studio (visual DB browser at port 4983) |

### Making Schema Changes

1. Modify `src/db/schema.ts`
2. Run `npm run db:generate` — Drizzle detects diff and creates a new `.sql` file in `./drizzle/`
3. Run `npm run db:migrate` — applies the migration

> ⚠️ **Never manually edit generated migration files. Always modify `schema.ts` and re-generate.**

---

## 14. Deployment Guide

### Application — Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd application
vercel deploy --prod
```

**Configure environment variables** in the Vercel dashboard under **Settings → Environment Variables**. Add all variables from the `.env.local` reference.

**Important Vercel settings:**
- Framework Preset: `Next.js`
- Build Command: `npm run build`
- Output Directory: `.next`
- Node.js Version: `20.x`

### Blockchain — Sepolia Testnet

1. Fund a wallet with **Sepolia ETH** via a faucet
2. Set up an RPC provider (Infura / Alchemy)
3. Update `Blockchain/.env`:

```env
PRIVATE_KEY=your_funded_wallet_private_key
RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
```

4. Deploy:

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

5. Update `NEXT_PUBLIC_CONTRACT_ADDRESS` and `NEXT_PUBLIC_RPC_URL` in Vercel env vars

### development Checklist

- [ ] Rotate the internal API key away from `"DADDY-IS-HOME"` to a secure random value stored in env
- [ ] Move admin wallet private key to a secrets manager (not a `NEXT_PUBLIC_` variable)
- [ ] Set Clerk webhook signing secret in dashboard
- [ ] Enable Neon connection pooling for development traffic
- [ ] Update `CONTRACT_CONFIG.chainId` in `contract.ts` to match target network
- [ ] Set up Pinata dedicated gateway for development file access
- [ ] Enable HTTPS / enforce `sslmode=require` for database connections
- [ ] Add rate limiting to `/api/upload`

---

## 15. Error Reference

### HTTP Error Codes

| Code | Meaning | Common Cause |
|------|---------|-------------|
| `400` | Bad Request | Missing required body/query parameters |
| `401` | Unauthorized | Missing or invalid Clerk session / API key |
| `403` | Forbidden | Insufficient role permissions |
| `404` | Not Found | Entity doesn't exist in database |
| `409` | Conflict | Duplicate registration (unique constraint) |
| `500` | Internal Server Error | Blockchain transaction failure, DB error |

### Blockchain-Specific Errors

| Error | Layer | Description |
|-------|-------|-------------|
| `ECONNREFUSED 127.0.0.1:8545` | Contract client | Hardhat node is not running |
| `Error: No signer available` | Contract client | No private key or MetaMask connected |
| `execution reverted: "Document already exists"` | Smart contract | Duplicate `documentId` on upload |
| `execution reverted: "Hashcode must be 8 digits"` | Smart contract | IPFS hash not 8 chars (legacy check) |
| `execution reverted: "No pending request"` | Smart contract | Tried to grant/reject non-existent request |

### IPFS / Upload Errors

| Error | Cause | Resolution |
|-------|-------|-----------|
| `Failed to add document to blockchain` | `addHashCode()` contract call failed | Verify Hardhat node is running; check private key |
| `Failed to store document in database` | PostgreSQL `INSERT` conflict | Check `ipfs_hash` uniqueness constraint |
| `Student has not connected a Web3 wallet` | `student.wallet_address` is null | Student must link MetaMask in dashboard first |

---

## 16. Security Considerations

> ⚠️ The following items are known security considerations for this project.

### 🔴 Critical

| Issue | Risk | Recommendation |
|-------|------|---------------|
| `NEXT_PUBLIC_WALLET_PRIVATE_KEY` exposed client-side | Full admin wallet compromise | Move to server-only env var, use a dedicated server wallet |
| Hardcoded API key `"DADDY-IS-HOME"` | Internal API unauthorized access | Generate cryptographically random key, store in env |
| `getPendingRequests` limited to first 100 addresses | Incomplete data for high-volume docs | Implement event-based indexing with a subgraph |

### 🟡 Medium

| Issue | Risk | Recommendation |
|-------|------|---------------|
| No rate limiting on `/api/upload` | DoS / IPFS pin exhaustion | Add middleware rate limiter (e.g. Upstash Rate Limit) |
| `localhost:3000` hardcoded in `upload/route.ts` | Fails in development when calling `/api/student/register-student` | Use relative paths or `process.env.NEXT_PUBLIC_APP_URL` |

### 🟢 Already Secured

- Clerk JWT validation on every request via `clerkMiddleware()`
- Svix signature verification on webhook endpoint
- OpenZeppelin `AccessControl` for on-chain role enforcement
- Drizzle ORM parameterized queries (no SQL injection risk)
- IPFS content addressing (any file modification = different CID)
- On-chain timestamps for access grants (immutable audit trail)

---

## 17. Glossary

| Term | Definition |
|------|-----------|
| **CID** | Content Identifier — IPFS's unique hash for any piece of data based on its content |
| **CIDv0** | Legacy IPFS CID format starting with `Qm...` (SHA-256 multihash, base58 encoded) |
| **DEFAULT_ADMIN_ROLE** | OpenZeppelin role `bytes32(0)` — granted to the contract deployer |
| **Drizzle ORM** | TypeScript-first ORM with a fluent query builder API and migration tooling |
| **ethers.js** | Lightweight JavaScript library for interacting with Ethereum nodes |
| **Hardhat** | Ethereum development environment for compiling, testing, and deploying contracts |
| **Hono** | Ultrafast web framework for edge runtimes, used as a Next.js route handler |
| **Hexcode** | An 8-character `0x`-prefixed string uniquely identifying a student on-chain |
| **IPFS** | InterPlanetary File System — peer-to-peer protocol for storing and sharing data |
| **Neon** | Serverless PostgreSQL service that auto-suspends on zero traffic |
| **OpenZeppelin** | Industry-standard library of audited Solidity smart contract components |
| **Pinata** | Managed IPFS pinning service that ensures files remain available on the network |
| **RBAC** | Role-Based Access Control — permission model based on user roles |
| **RSC** | React Server Component — Next.js 15 component rendered on the server |
| **Solidity** | Statically typed programming language for writing Ethereum smart contracts |
| **Svix** | Webhook delivery service used by Clerk to emit user lifecycle events |
| **VERIFIER_ROLE** | Smart contract role (`keccak256("VERIFIER_ROLE")`) granting document upload rights |
| **Wallet** | An Ethereum account identified by a public address and controlled by a private key |

---

<div align="center">

*VeriFi Documentation · Built with precision · Trust, Verified.*

</div>
