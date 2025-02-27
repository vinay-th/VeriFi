// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/AccessControl.sol";

// /**
//  * @title VeriFi - A Blockchain-Based Document Verification System
//  * @dev This contract allows verified admins to upload documents on-chain,
//  *      verify them, grant access to employers, and issue certificates.
//  */

contract VeriFi is AccessControl {
    // Role for verified admins
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    // /**
    //  * @dev Struct to store document details
    //  * @param ipfsHash Hash of the document stored on IPFS
    //  * @param uploader Address of the person who uploaded the document
    //  * @param verified Boolean indicating if the document is verified
    //  */

    struct Document {
        bytes32 ipfsHash;
        address uploader;
        bool verified;
    }

    // /**
    //  * @dev Struct to store access request details
    //  * @param employer Address of the employer requesting access
    //  * @param validUntil Timestamp until the access request is valid
    //  */

    struct AccessRequest {
        address employer;
        uint256 validUntil;
    }

    // /**
    //  * @dev Struct to store certificate details
    //  * @param recipient Address of the person receiving the certificate
    //  * @param certificateName Name of the issued certificate
    //  * @param issueDate Date the certificate was issued
    //  * @param issuer Name of the issuing authority
    //  * @param documentHash Hash of the associated document
    //  */

    struct Certificate {
        address recipient;
        string certificateName;
        string issueDate;
        string issuer;
        bytes32 documentHash;
    }

    // Mappings to store document details, access requests, and certificates
    mapping(bytes32 => Document) public documents;
    mapping(address => mapping(bytes32 => AccessRequest)) public accessRequests;
    mapping(bytes32 => Certificate) public certificates;

    // Events for logging contract actions
    event DocumentUploaded(bytes32 indexed documentHash, bytes32 ipfsHash, address indexed uploader);
    event DocumentVerified(bytes32 indexed documentHash, address indexed verifier);
    event AccessRequested(bytes32 indexed documentHash, address indexed employer);
    event AccessGranted(bytes32 indexed documentHash, address indexed employer, address indexed student);
    event AccessRevoked(bytes32 indexed documentHash, address indexed employer, address indexed student);
    event CertificateMinted(bytes32 indexed certificateHash, address indexed recipient, bytes32 indexed documentHash);

    // Custom errors for more gas-efficient error handling
    error EmptyIpfsHash();
    error DocumentDoesNotExist();
    error NotDocumentOwner();
    error EmployerNotRequested();
    error RequestExpired();
    error SelfAccessRequest();
    error NotVerifiedAdmin();
    error CertificateAlreadyMinted();

    // /**
    //  * @dev Constructor to set the deployer as the super admin
    //  * @param _superAdmin Address of the initial super admin
    //  */

    constructor(address _superAdmin) {
        _grantRole(DEFAULT_ADMIN_ROLE, _superAdmin);
        _grantRole(ADMIN_ROLE, _superAdmin);
    }

    // /**
    //  * @dev Modifier to restrict access to only admins
    //  */

    modifier onlyAdmin() {
        if (!hasRole(ADMIN_ROLE, msg.sender)) {
            revert NotVerifiedAdmin();
        }
        _;
    }

    // /**
    //  * @dev Function to add an admin
    //  * @param _admin Address of the new admin
    //  */

    function addAdmin(address _admin) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(ADMIN_ROLE, _admin);
    }

    // /**
    //  * @dev Function to remove an admin
    //  * @param _admin Address of the admin to be removed
    //  */

    function removeAdmin(address _admin) external onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(ADMIN_ROLE, _admin);
    }

    // /**
    //  * @dev Function to upload a document (only admins can upload)
    //  * @param _ipfsHash Hash of the document stored on IPFS
    //  */

    function uploadDocument(bytes32 _ipfsHash) public onlyAdmin {
        if (_ipfsHash == bytes32(0)) {
            revert EmptyIpfsHash();
        }
        documents[_ipfsHash] = Document(_ipfsHash, msg.sender, false);
        emit DocumentUploaded(_ipfsHash, _ipfsHash, msg.sender);
    }

    // /**
    //  * @dev Function to verify a document (only admins can verify)
    //  * @param _documentHash Hash of the document to be verified
    //  */
    
    function verifyDocument(bytes32 _documentHash) public onlyAdmin {
        if (documents[_documentHash].ipfsHash == bytes32(0)) {
            revert DocumentDoesNotExist();
        }
        documents[_documentHash].verified = true;
        emit DocumentVerified(_documentHash, msg.sender);
    }
}