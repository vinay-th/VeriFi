// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title VeriFi - A Blockchain-Based Document Verification System
 * @dev This contract allows admins to upload, retrieve, and delete documents.
 * Role-based access control is implemented using OpenZeppelin's AccessControl.
 * It ensures document uniqueness, admin management, and secure document handling.
 */
contract VeriFi is AccessControl {
    using Strings for string;

    // Roles
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    // Document structure
    struct Document {
        string title;           // Document title
        string description;     // Document description
        string documentType;    // Document type
        address uploader;       // Address of the admin who uploaded the document
    }

    // Mapping from document ID to Document
    mapping(uint256 => Document) public documents;

    // Mapping to track document existence
    mapping(uint256 => bool) public documentExists;

    // Events
    event DocumentUploaded(uint256 indexed documentId, string title, string description, string documentType, address indexed uploader);
    event DocumentDeleted(uint256 indexed documentId, address indexed admin);
    event AdminAdded(address indexed admin);
    event AdminRemoved(address indexed admin);

    /**
     * @dev Constructor to initialize the contract and grant the deployer the default admin role.
     * Also grants the deployer the ADMIN_ROLE.
     */
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    /**
     * @dev Upload a document to the contract.
     * @param documentId The unique identifier for the document.
     * @param title The title of the document.
     * @param description The description of the document.
     * @param documentType The type of the document.
     * @notice Only admins can upload documents.
     * @notice Reverts if the document ID already exists or if title/documentType are empty.
     */
    function uploadDocument(uint256 documentId, string memory title, string memory description, string memory documentType) external onlyRole(ADMIN_ROLE) {
        require(!documentExists[documentId], "Document already exists");
        require(bytes(title).length > 0, "Title cannot be empty");
        require(bytes(documentType).length > 0, "Document type cannot be empty");

        documents[documentId] = Document({
            title: title,
            description: description,
            documentType: documentType,
            uploader: msg.sender
        });

        documentExists[documentId] = true;
        emit DocumentUploaded(documentId, title, description, documentType, msg.sender);
    }

    /**
     * @dev Retrieve a document by its ID.
     * @param documentId The unique identifier for the document.
     * @return title The title of the document.
     * @return description The description of the document.
     * @return documentType The type of the document.
     * @return uploader The address of the admin who uploaded the document.
     * @notice Only admins can retrieve documents.
     * @notice Reverts if the document does not exist.
     */
    function retrieveDocument(uint256 documentId) external view onlyRole(ADMIN_ROLE) returns (string memory title, string memory description, string memory documentType, address uploader) {
        require(documentExists[documentId], "Document does not exist");

        Document memory doc = documents[documentId];
        return (doc.title, doc.description, doc.documentType, doc.uploader);
    }

    /**
     * @dev Delete a document by its ID.
     * @param documentId The unique identifier for the document.
     * @notice Only the uploader admin can delete the document.
     * @notice Reverts if the document does not exist or if the caller is not the uploader.
     */
    function deleteDocument(uint256 documentId) external onlyRole(ADMIN_ROLE) {
        require(documentExists[documentId], "Document does not exist");
        require(documents[documentId].uploader == msg.sender, "Only the uploader can delete the document");

        delete documents[documentId];
        delete documentExists[documentId];
        emit DocumentDeleted(documentId, msg.sender);
    }

    /**
     * @dev Add a new admin.
     * @param admin The address of the new admin.
     * @notice Only the default admin can add new admins.
     */
    function addAdmin(address admin) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(ADMIN_ROLE, admin);
        emit AdminAdded(admin);
    }

    /**
     * @dev Remove an admin.
     * @param admin The address of the admin to remove.
     * @notice Only the default admin can remove admins.
     */
    function removeAdmin(address admin) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(ADMIN_ROLE, admin);
        emit AdminRemoved(admin);
    }
}