// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title VeriFi - A Blockchain-Based Document Verification System
 * @dev This contract allows verifiers to upload, retrieve, and delete documents.
 * Role-based access control is implemented using OpenZeppelin's AccessControl.
 * It ensures document uniqueness, verifier management, and secure document handling.
 */
contract VeriFi is AccessControl {
    using Strings for string;

    // Roles
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");

    // Document structure
    struct Document {
        string title;           // Document title
        string description;     // Document description
        string documentType;    // Document type
        address uploader;       // Address of the verifier who uploaded the document
    }

    // Mapping from document ID to Document
    mapping(uint256 => Document) public documents;

    // Mapping to track document existence
    mapping(uint256 => bool) public documentExists;

    // Events
    event DocumentUploaded(uint256 indexed documentId, string title, string description, string documentType, address indexed uploader);
    event DocumentDeleted(uint256 indexed documentId, address indexed verifier);
    event VerifierAdded(address indexed verifier);
    event VerifierRemoved(address indexed verifier);

    /**
     * @dev Constructor to initialize the contract and grant the deployer the default admin role.
     */
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender); // Deployer is the default admin
    }

    /**
     * @dev Upload a document to the contract.
     * @param documentId The unique identifier for the document.
     * @param title The title of the document.
     * @param description The description of the document.
     * @param documentType The type of the document.
     * @notice Only verifiers can upload documents.
     * @notice Reverts if the document ID already exists or if title/documentType are empty.
     */
    function uploadDocument(uint256 documentId, string memory title, string memory description, string memory documentType) external onlyRole(VERIFIER_ROLE) {
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
     * @return uploader The address of the verifier who uploaded the document.
     * @notice Only verifiers can retrieve documents.
     * @notice Reverts if the document does not exist.
     */
    function retrieveDocument(uint256 documentId) external view onlyRole(VERIFIER_ROLE) returns (string memory title, string memory description, string memory documentType, address uploader) {
        require(documentExists[documentId], "Document does not exist");

        Document memory doc = documents[documentId];
        return (doc.title, doc.description, doc.documentType, doc.uploader);
    }

    /**
     * @dev Delete a document by its ID.
     * @param documentId The unique identifier for the document.
     * @notice Only the uploader verifier can delete the document.
     * @notice Reverts if the document does not exist or if the caller is not the uploader.
     */
    function deleteDocument(uint256 documentId) external onlyRole(VERIFIER_ROLE) {
        require(documentExists[documentId], "Document does not exist");
        require(documents[documentId].uploader == msg.sender, "Only the uploader can delete the document");

        delete documents[documentId];
        delete documentExists[documentId];
        emit DocumentDeleted(documentId, msg.sender);
    }

    /**
     * @dev Add a new verifier.
     * @param verifier The address of the new verifier.
     * @notice Only the default admin can add new verifiers.
     */
    function addVerifier(address verifier) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(VERIFIER_ROLE, verifier);
        emit VerifierAdded(verifier);
    }

    /**
     * @dev Remove a verifier.
     * @param verifier The address of the verifier to remove.
     * @notice Only the default admin can remove verifiers.
     */
    function removeVerifier(address verifier) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(VERIFIER_ROLE, verifier);
        emit VerifierRemoved(verifier);
    }
}