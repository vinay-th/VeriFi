// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title VeriFi - A Blockchain-Based Document Verification System
 * @dev This contract allows admins to upload, verify, and revoke documents.
 * Documents are stored on IPFS, and their hashes are stored on-chain.
 * Role-based access control is implemented using OpenZeppelin's AccessControl.
 */
contract VeriFi is AccessControl {
    using Strings for string;

    // Roles
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    // Document structure
    struct Document {
        string name; // Document name
        string issuer; // Issuer of the document
        uint256 timestamp; // Timestamp of upload
        string ipfsHash; // IPFS hash of the document
        bool isVerified; // Verification status
        bool isRevoked; // Revocation status
        string revocationReason; // Reason for revocation
    }

    // Mapping from document ID to Document
    mapping(uint256 => Document) public documents;

    // Mapping to ensure document uniqueness (IPFS hash -> document ID)
    mapping(string => uint256) public documentHashes;

    // Document ID counter
    uint256 public documentCounter;

    // Events
    event DocumentUploaded(uint256 indexed documentId, string name, string issuer, string ipfsHash, uint256 timestamp);
    event DocumentVerified(uint256 indexed documentId, address indexed admin);
    event DocumentRevoked(uint256 indexed documentId, address indexed admin, string reason);
    event AdminAdded(address indexed admin);
    event AdminRemoved(address indexed admin);

    /**
     * @dev Constructor to initialize the contract and grant the deployer the default admin role.
     */
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    /**
     * @dev Upload a document to the contract.
     * @param name The name of the document.
     * @param issuer The issuer of the document.
     * @param ipfsHash The IPFS hash of the document.
     */
    function uploadDocument(string memory name, string memory issuer, string memory ipfsHash) external onlyRole(ADMIN_ROLE) {
        require(bytes(ipfsHash).length > 0, "IPFS hash cannot be empty");
        require(documentHashes[ipfsHash] == 0, "Document already exists");

        documentCounter++;
        documents[documentCounter] = Document({
            name: name,
            issuer: issuer,
            timestamp: block.timestamp,
            ipfsHash: ipfsHash,
            isVerified: false,
            isRevoked: false,
            revocationReason: ""
        });

        documentHashes[ipfsHash] = documentCounter;
        emit DocumentUploaded(documentCounter, name, issuer, ipfsHash, block.timestamp);
    }

    /**
     * @dev Verify a document.
     * @param documentId The ID of the document to verify.
     */
    function verifyDocument(uint256 documentId) external onlyRole(ADMIN_ROLE) {
        require(documentId > 0 && documentId <= documentCounter, "Invalid document ID");
        require(!documents[documentId].isRevoked, "Document is revoked");

        documents[documentId].isVerified = true;
        emit DocumentVerified(documentId, msg.sender);
    }

    /**
     * @dev Revoke a document.
     * @param documentId The ID of the document to revoke.
     * @param reason The reason for revocation.
     */
    function revokeDocument(uint256 documentId, string memory reason) external onlyRole(ADMIN_ROLE) {
        require(documentId > 0 && documentId <= documentCounter, "Invalid document ID");
        require(!documents[documentId].isRevoked, "Document is already revoked");

        documents[documentId].isRevoked = true;
        documents[documentId].revocationReason = reason;
        emit DocumentRevoked(documentId, msg.sender, reason);
    }

    /**
     * @dev Query the verification status of a document.
     * @param documentId The ID of the document to query.
     * @return isVerified Whether the document is verified.
     * @return isRevoked Whether the document is revoked.
     * @return revocationReason The reason for revocation (if applicable).
     */
    function queryDocumentStatus(uint256 documentId) external view returns (bool isVerified, bool isRevoked, string memory revocationReason) {
        require(documentId > 0 && documentId <= documentCounter, "Invalid document ID");

        Document memory doc = documents[documentId];
        return (doc.isVerified, doc.isRevoked, doc.revocationReason);
    }

    /**
     * @dev Add a new admin.
     * @param admin The address of the new admin.
     */
    function addAdmin(address admin) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(ADMIN_ROLE, admin);
        emit AdminAdded(admin);
    }

    /**
     * @dev Remove an admin.
     * @param admin The address of the admin to remove.
     */
    function removeAdmin(address admin) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(ADMIN_ROLE, admin);
        emit AdminRemoved(admin);
    }
}