# Comprehensive Data Dictionary

This document contains the physical data models, DTOs, and blockchain states extracted from the VeriFi codebase. The dictionary is grouped by module/file for better readability and cross-referencing between the UI, database, and smart contract constraints.

## Module: Database Schema ([/application/src/db/schema.ts](file:///e:/Codes/Project/VeriFi/application/src/db/schema.ts))

| Variable | Type | File Name | Format for Display | Size in Bytes | Size for Display | Description | Example | Validation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **Table: `users`** | | | | | | | | |
| [id](file:///e:/Codes/Project/VeriFi/application/src/lib/contract.ts#55-69) | Text (String) | /application/src/db/schema.ts | String | Variable | 50 chars | Unique identifier for user account | `user_2Qf...` | Primary Key, Not Null |
| `name` | Text (String) | /application/src/db/schema.ts | String | Variable | 100 chars | Full name of the user | `Alice Smith` | Not Null |
| `email` | Text (String) | /application/src/db/schema.ts | Email | Variable | 255 chars | Email address of the user | `alice@example.com` | Not Null, Unique |
| `role` | Text (String) | /application/src/db/schema.ts | String | Variable | 20 chars | User role in the system | `user` | Not Null, Default: 'user' |
| `web3_wallet` | Text (String) | /application/src/db/schema.ts | Hex-String | Variable | 42 chars | User's Web3 wallet address | `0x123...` | Unique, Nullable |
| `createdAt` | Timestamp | /application/src/db/schema.ts | ISO-8601 | 8 | 24 chars | Account creation timestamp | `2023-10-01T12:00:00Z` | Not Null, DefaultNow |
| **Table: `students`** | | | | | | | | |
| `enrolment_id` | Serial (Int) | /application/src/db/schema.ts | Numeric | 4 | 10 chars | Autoincrement PK for student records | `12345` | Primary Key |
| `user_id` | Text (String) | /application/src/db/schema.ts | String | Variable | 50 chars | Foreign key reference to users.id | `user_2Qf...` | FK (users.id), Not Null |
| `name` | Text (String) | /application/src/db/schema.ts | String | Variable | 100 chars | Full name of the student | `Bob Jones` | Not Null |
| `email` | Text (String) | /application/src/db/schema.ts | Email | Variable | 255 chars | Email address of the student | `bob@example.com` | Not Null |
| `hexcode` | Text (String) | /application/src/db/schema.ts | Hex-String | Variable | 8 chars | 8-digit unique hexcode for student | `a1b2c3d4` | Not Null, Unique, 8 chars |
| `verifier` | Text (String) | /application/src/db/schema.ts | Boolean String | Variable | 5 chars | Indicates if the student is verified | `false` | Not Null, Default: 'false' |
| `wallet_address` | Text (String) | /application/src/db/schema.ts | Hex-String | Variable | 42 chars | Student's Web3 wallet address | `0xABC...` | Unique, Nullable |
| `createdAt` | Timestamp | /application/src/db/schema.ts | ISO-8601 | 8 | 24 chars | Record creation timestamp | `2023-10-01T12:00:00Z` | Not Null, DefaultNow |
| **Table: `verifiers`** | | | | | | | | |
| [id](file:///e:/Codes/Project/VeriFi/application/src/lib/contract.ts#55-69) | Serial (Int) | /application/src/db/schema.ts | Numeric | 4 | 10 chars | Autoincrement PK for verifiers | `10` | Primary Key |
| `verifier_id` | Text (String) | /application/src/db/schema.ts | String | Variable | 50 chars | Unique ID for the verifier institution | `ver_101` | Not Null, Unique |
| `user_id` | Text (String) | /application/src/db/schema.ts | String | Variable | 50 chars | Foreign key reference to users.id | `user_2Qf...` | FK (users.id), Not Null |
| `name` | Text (String) | /application/src/db/schema.ts | String | Variable | 100 chars | Full name of the verifier | `Dr. Smith` | Not Null |
| `email` | Text (String) | /application/src/db/schema.ts | Email | Variable | 255 chars | Email address of the verifier | `smith@uni.edu` | Not Null, Unique |
| `university_name` | Text (String) | /application/src/db/schema.ts | String | Variable | 150 chars | Name of the university/institution | `Stanford University` | Nullable |
| `web3_wallet` | Text (String) | /application/src/db/schema.ts | Hex-String | Variable | 42 chars | Verifier's Web3 wallet address | `0xDEF...` | Unique, Nullable |
| `createdAt` | Timestamp | /application/src/db/schema.ts | ISO-8601 | 8 | 24 chars | Record creation timestamp | `2023-10-01T12:00:00Z` | Not Null, DefaultNow |
| **Table: `documents`** | | | | | | | | |
| `document_id` | Serial (Int) | /application/src/db/schema.ts | Numeric | 4 | 10 chars | Autoincrement PK for documents | `5001` | Primary Key |
| `student_id` | Int | /application/src/db/schema.ts | Numeric | 4 | 10 chars | Reference to the owner student | `12345` | FK (students.enrolment_id) |
| `ipfs_hash` | Text (String) | /application/src/db/schema.ts | Base58 | Variable | 46 chars | IPFS storage hash | `QmYwAP...` | Not Null, Unique |
| `url` | Text (String) | /application/src/db/schema.ts | URL | Variable | 255 chars | Publicly accessible URL for document | `https://ipfs.io/...` | Not Null, Unique |
| `verifier_id` | Text (String) | /application/src/db/schema.ts | String | Variable | 50 chars | Reference to the uploading verifier | `ver_101` | FK (verifiers.verifier_id) |
| `document_name` | Text (String) | /application/src/db/schema.ts | String | Variable | 150 chars | Human-readable name of the document | `BSc Computer Science` | Not Null |
| `createdAt` | Timestamp | /application/src/db/schema.ts | ISO-8601 | 8 | 24 chars | Document upload timestamp | `2023-10-01T12:00:00Z` | Not Null, DefaultNow |
| `updatedAt` | Timestamp | /application/src/db/schema.ts | ISO-8601 | 8 | 24 chars | Last modification timestamp | `2023-10-05T12:00:00Z` | DefaultNow, Nullable |
| `status` | Text (String) | /application/src/db/schema.ts | String | Variable | 20 chars | Current processing/verification status | `verified` | Not Null, Default: 'pending' |
| `metadata` | Text (JSON) | /application/src/db/schema.ts | JSON String | Variable | Max | Additional document metadata | `{"grade":"A"}` | Nullable |
| **Table: `organizations`** | | | | | | | | |
| `organization_id`| Serial (Int) | /application/src/db/schema.ts | Numeric | 4 | 10 chars | Autoincrement PK for organizations | `300` | Primary Key |
| `user_id` | Text (String) | /application/src/db/schema.ts | String | Variable | 50 chars | Reference to users table | `user_2Qf...` | FK (users.id), Not Null |
| `organization_name`| Text (String) | /application/src/db/schema.ts | String | Variable | 150 chars | Name of the organization | `Google` | Not Null, Unique |
| `createdAt` | Timestamp | /application/src/db/schema.ts | ISO-8601 | 8 | 24 chars | Record creation timestamp | `2023-10-01T12:00:00Z` | Not Null, DefaultNow |
| `web3_wallet` | Text (String) | /application/src/db/schema.ts | Hex-String | Variable | 42 chars | Organization's wallet address | `0x111...` | Unique, Nullable |
| **Table: `access`** | | | | | | | | |
| `access_id` | Serial (Int) | /application/src/db/schema.ts | Numeric | 4 | 10 chars | PK for access logs/records | `900` | Primary Key |
| `student_id` | Int | /application/src/db/schema.ts | Numeric | 4 | 10 chars | Reference to the owner student | `12345` | FK (students.enrolment_id) |
| `organization_id`| Int | /application/src/db/schema.ts | Numeric | 4 | 10 chars | Reference to querying organization | `300` | FK (organizations.org_id) |
| `document_id` | Int | /application/src/db/schema.ts | Numeric | 4 | 10 chars | Reference to requested document | `5001` | FK (documents.document_id) |
| `hexcode` | Text (String) | /application/src/db/schema.ts | Hex-String | Variable | 8 chars | Hexcode used for document access | `a1b2c3d4` | Not Null |
| `request_time` | Timestamp | /application/src/db/schema.ts | ISO-8601 | 8 | 24 chars | Time access was requested/granted | `2023-10-01T12:00:00Z` | Not Null, DefaultNow |
| `access_duration`| Text (String) | /application/src/db/schema.ts | String | Variable | 20 chars | Authorized valid duration | `24h` | Not Null |
| `status` | Text (String) | /application/src/db/schema.ts | String | Variable | 20 chars | Access status | `approved` | Not Null, Default: 'pending' |
| `access_type` | Text (String) | /application/src/db/schema.ts | String | Variable | 30 chars | Classification of access type | `view_only` | Not Null |
| **Table: `access_requests`**| | | | | | | | |
| `request_id` | Varchar | /application/src/db/schema.ts | String | Variable | 50 chars | Unique request ID | `req_99` | Primary Key |
| `document_id` | Serial (Int) | /application/src/db/schema.ts | Numeric | 4 | 10 chars | Reference to requested document | `5001` | FK (documents.document_id) |
| `organization_id`| Serial (Int) | /application/src/db/schema.ts | Numeric | 4 | 10 chars | Reference to requesting org | `300` | FK (organizations.org_id) |
| `student_id` | Serial (Int) | /application/src/db/schema.ts | Numeric | 4 | 10 chars | Reference to student | `12345` | FK (students.enrolment_id) |
| `status` | Varchar | /application/src/db/schema.ts | String | Variable | 20 chars | Request state | `pending` | Default: 'pending' |
| `requested_at` | Timestamp | /application/src/db/schema.ts | ISO-8601 | 8 | 24 chars | Request creation time | `2023-10-01T12:00:00Z` | DefaultNow |
| `expires_at` | Timestamp | /application/src/db/schema.ts | ISO-8601 | 8 | 24 chars | Request expiration time | `2023-10-02T12:00:00Z` | Nullable |
| `duration_hours` | Serial (Int) | /application/src/db/schema.ts | Numeric | 4 | 5 chars | Validity duration in hours | `24` | Nullable |

## Module: Types & DTOs ([/application/src/lib/contract.ts](file:///e:/Codes/Project/VeriFi/application/src/lib/contract.ts))

| Variable | Type | File Name | Format for Display | Size in Bytes | Size for Display | Description | Example | Validation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **Interface: [ContractDocument](file:///e:/Codes/Project/VeriFi/application/src/lib/contract.ts#6-13)** | | | | | | | | |
| `title` | String | /application/src/lib/contract.ts | String | Variable | 150 chars | Title of the uploaded document | `Transcript` | N/A |
| `description` | String | /application/src/lib/contract.ts | String | Variable | 500 chars | Description provided by verifier | `Undergraduate transcript` | N/A |
| `documentType` | String | /application/src/lib/contract.ts | String | Variable | 50 chars | Type classification of document | `Academic` | N/A |
| `uploader` | String | /application/src/lib/contract.ts | Hex-String | Variable | 42 chars | Address of the verifier | `0x123...` | Valid Ethereum Address |
| `ipfsHash` | String | /application/src/lib/contract.ts | Base58 | Variable | 46 chars | IPFS CID | `QmYwAP...` | Optional |
| **Interface: [TransactionResult](file:///e:/Codes/Project/VeriFi/application/src/lib/contract.ts#14-19)** | | | | | | | | |
| `success` | Boolean | /application/src/lib/contract.ts | Boolean | 1 | 5 chars | Indicates transaction success | `true` | N/A |
| `error` | String | /application/src/lib/contract.ts | String | Variable | Max | Error message if failed | `Transaction reverted` | Optional |
| `hash` | String | /application/src/lib/contract.ts | Hex-String | Variable | 66 chars | Blockchain transaction hash | `0xabc...` | Optional |

## Module: Blockchain Smart Contract ([/Blockchain/contracts/VeriFi.sol](file:///e:/Codes/Project/VeriFi/Blockchain/contracts/VeriFi.sol))

| Variable | Type | File Name | Format for Display | Size in Bytes | Size for Display | Description | Example | Validation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **State Variables** | | | | | | | | |
| `VERIFIER_ROLE` | Bytes32 | Blockchain/contracts/VeriFi.sol | Hex-String | 32 | 66 chars | Keccak256 hash for Verifier Role | `0x42f2...` | Constant, 32 bytes |
| `documents` | Mapping | Blockchain/contracts/VeriFi.sol | Struct | Variable | N/A | Maps documentId (uint256) to Document | `[1 => Document]` | N/A |
| `documentExists` | Mapping | Blockchain/contracts/VeriFi.sol | Boolean | 1 per entry | 5 chars | Tracks if a document ID exists | `true` | N/A |
| `pendingRequests` | Mapping | Blockchain/contracts/VeriFi.sol | Boolean | 1 per entry | 5 chars | Maps student -> docId -> employer -> bool | `true` | N/A |
| `hashToAddress` | Mapping | Blockchain/contracts/VeriFi.sol | Hex-String | 20 per entry | 42 chars | Maps 8-digit hashcode to student address | `0x123...` | Hashcode must be 8 chars |
| `accessGrantTimestamps`| Mapping | Blockchain/contracts/VeriFi.sol | Numeric | 32 per entry | 20 chars | Stores access granted timestamps | `1696161600` | N/A |
| **Struct: [Document](file:///e:/Codes/Project/VeriFi/application/src/lib/contract.ts#151-162)**| | | | | | | | |
| `title` | String | Blockchain/contracts/VeriFi.sol | String | Variable | Max | On-chain document title | `Diploma` | length > 0 (via uploadDocument) |
| `description` | String | Blockchain/contracts/VeriFi.sol | String | Variable | Max | On-chain description | `CS Diploma` | N/A |
| `documentType` | String | Blockchain/contracts/VeriFi.sol | String | Variable | Max | On-chain document type | `Degree` | length > 0 (via uploadDocument) |
| `uploader` | Address | Blockchain/contracts/VeriFi.sol | Hex-String | 20 | 42 chars | Verifier's Ethereum address | `0xDef...` | N/A |
