// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract VeriFi is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    struct Document {
        bytes32 ipfsHash;
        address uploader;
        bool verified;
    }

    struct AccessRequest {
        address employer;
        uint256 validUntil;
    }

    struct Certificate {
        address recipient;
        string certificateName;
        string issueDate;
        string issuer;
        bytes32 documentHash;
    }

    mapping(bytes32 => Document) public documents;
    mapping(address => mapping(bytes32 => AccessRequest)) public accessRequests;
    mapping(bytes32 => Certificate) public certificates;

    event DocumentUploaded(bytes32 indexed documentHash, bytes32 ipfsHash, address indexed uploader);
    event DocumentVerified(bytes32 indexed documentHash, address indexed verifier);
    event AccessRequested(bytes32 indexed documentHash, address indexed employer);
    event AccessGranted(bytes32 indexed documentHash, address indexed employer, address indexed student);
    event AccessRevoked(bytes32 indexed documentHash, address indexed employer, address indexed student);
    event CertificateMinted(bytes32 indexed certificateHash, address indexed recipient, bytes32 indexed documentHash);

    error EmptyIpfsHash();
    error DocumentDoesNotExist();
    error NotDocumentOwner();
    error EmployerNotRequested();
    error RequestExpired();
    error SelfAccessRequest();
    error NotVerifiedAdmin();
    error CertificateAlreadyMinted();

    constructor(address _superAdmin) {
        _grantRole(DEFAULT_ADMIN_ROLE, _superAdmin);
        _grantRole(ADMIN_ROLE, _superAdmin);
    }

    modifier onlyAdmin() {
        if (!hasRole(ADMIN_ROLE, msg.sender)) {
            revert NotVerifiedAdmin();
        }
        _;
    }

    function addAdmin(address _admin) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(ADMIN_ROLE, _admin);
    }

    function removeAdmin(address _admin) external onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(ADMIN_ROLE, _admin);
    }

    function uploadDocument(bytes32 _ipfsHash) public onlyAdmin {
        if (_ipfsHash == bytes32(0)) {
            revert EmptyIpfsHash();
        }
        documents[_ipfsHash] = Document(_ipfsHash, msg.sender, false);
        emit DocumentUploaded(_ipfsHash, _ipfsHash, msg.sender);
    }

    function verifyDocument(bytes32 _documentHash) public onlyAdmin {
        if (documents[_documentHash].ipfsHash == bytes32(0)) {
            revert DocumentDoesNotExist();
        }
        documents[_documentHash].verified = true;
        emit DocumentVerified(_documentHash, msg.sender);
    }

    function getDocumentDetails(bytes32 _documentHash) public view returns (bytes32 ipfsHash, bool verified) {
        if (documents[_documentHash].ipfsHash == bytes32(0)) {
            revert DocumentDoesNotExist();
        }
        Document storage doc = documents[_documentHash];
        return (doc.ipfsHash, doc.verified);
    }

    function requestAccess(bytes32 _documentHash) public {
        if (documents[_documentHash].uploader == msg.sender) {
            revert SelfAccessRequest();
        }
        if (documents[_documentHash].ipfsHash == bytes32(0)) {
            revert DocumentDoesNotExist();
        }
        accessRequests[documents[_documentHash].uploader][_documentHash] = AccessRequest(msg.sender, block.timestamp + 6 hours);
        emit AccessRequested(_documentHash, msg.sender);
    }

    function grantAccess(bytes32 _documentHash, address _employer) public {
        if (documents[_documentHash].uploader != msg.sender) {
            revert NotDocumentOwner();
        }
        if (accessRequests[msg.sender][_documentHash].employer != _employer) {
            revert EmployerNotRequested();
        }
        if (accessRequests[msg.sender][_documentHash].validUntil <= block.timestamp) {
            revert RequestExpired();
        }
        accessRequests[msg.sender][_documentHash].validUntil = block.timestamp + 6 hours;
        emit AccessGranted(_documentHash, _employer, msg.sender);
    }

    function revokeAccess(bytes32 _documentHash, address _employer) public {
        if (documents[_documentHash].uploader != msg.sender) {
            revert NotDocumentOwner();
        }
        delete accessRequests[msg.sender][_documentHash];
        emit AccessRevoked(_documentHash, _employer, msg.sender);
    }

    function checkAccess(bytes32 _documentHash, address _employer) public view returns (bool) {
        Document storage doc = documents[_documentHash];
        if (doc.ipfsHash == bytes32(0)) {
            revert DocumentDoesNotExist();
        }
        AccessRequest storage request = accessRequests[doc.uploader][_documentHash];
        return request.employer == _employer && request.validUntil > block.timestamp;
    }

    function mintCertificate(
        address _recipient,
        string memory _certificateName,
        string memory _issueDate,
        string memory _issuer,
        bytes32 _documentHash
    ) public onlyAdmin {
        if (certificates[_documentHash].recipient != address(0)) {
            revert CertificateAlreadyMinted();
        }
        certificates[_documentHash] = Certificate(_recipient, _certificateName, _issueDate, _issuer, _documentHash);
        emit CertificateMinted(_documentHash, _recipient, _documentHash);
    }

    function getCertificateDetails(bytes32 _documentHash) public view returns (Certificate memory) {
        return certificates[_documentHash];
    }
}