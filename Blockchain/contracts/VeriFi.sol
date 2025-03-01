// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract VeriFi {
    error NotVerifiedAdmin();
    error EmptyIpfsHash();
    error DocumentNotFound();
    error AccessNotRequested();
    error AccessNotGranted();
    error CertificateAlreadyMinted();

    address public admin;
    mapping(address => bool) public verifiedAdmins;
    mapping(address => string[]) public studentDocuments;
    mapping(bytes32 => bool) public verifiedDocuments;
    mapping(bytes32 => address) public documentOwners;
    mapping(address => mapping(address => bool)) public accessRequests; // Tracks access requests
    mapping(address => mapping(address => bool)) public accessGrants; // Tracks granted access
    mapping(bytes32 => bool) public mintedCertificates;

    event DocumentUploaded(address indexed student, string ipfsHash, bytes32 docHash);
    event DocumentVerified(bytes32 indexed docHash);
    event AccessRequested(address indexed student, address indexed employer);
    event AccessGranted(address indexed student, address indexed employer);
    event AccessRevoked(address indexed student, address indexed employer);
    event CertificateMinted(bytes32 indexed docHash);

    modifier onlyAdmin() {
        if (!verifiedAdmins[msg.sender]) {
            revert NotVerifiedAdmin();
        }
        _;
    }

    modifier onlyOwner(bytes32 docHash) {
        require(documentOwners[docHash] == msg.sender, "Not the document owner");
        _;
    }

    constructor() {
        admin = msg.sender;
        verifiedAdmins[msg.sender] = true; // Ensure the deployer is a verified admin
    }

    function addVerifiedAdmin(address _admin) external onlyAdmin {
        verifiedAdmins[_admin] = true;
    }

    function uploadDocument(string memory ipfsHash) external returns (bytes32 docHash) {
        if (bytes(ipfsHash).length == 0) {
            revert EmptyIpfsHash();
        }
        docHash = keccak256(abi.encodePacked(ipfsHash, msg.sender));
        documentOwners[docHash] = msg.sender;
        studentDocuments[msg.sender].push(ipfsHash);
        emit DocumentUploaded(msg.sender, ipfsHash, docHash);
    }

    function verifyDocument(bytes32 docHash) external onlyAdmin {
        if (documentOwners[docHash] == address(0)) {
            revert DocumentNotFound();
        }
        verifiedDocuments[docHash] = true;
        emit DocumentVerified(docHash);
    }

    function requestAccess(address student) external {
        require(msg.sender != student, "Cannot request access to own documents");
        accessRequests[student][msg.sender] = true;
        emit AccessRequested(student, msg.sender);
    }

    function grantAccess(address employer) external {
        require(accessRequests[msg.sender][employer], "No access request found");
        accessRequests[msg.sender][employer] = false;
        accessGrants[msg.sender][employer] = true;
        emit AccessGranted(msg.sender, employer);
    }

    function revokeAccess(address employer) external {
        require(accessGrants[msg.sender][employer], "No granted access to revoke");
        accessGrants[msg.sender][employer] = false;
        emit AccessRevoked(msg.sender, employer);
    }

    function mintCertificate(bytes32 docHash) external onlyAdmin {
        if (mintedCertificates[docHash]) {
            revert CertificateAlreadyMinted();
        }
        mintedCertificates[docHash] = true;
        emit CertificateMinted(docHash);
    }
}