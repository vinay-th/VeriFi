// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract VeriFi {
    error NotVerifiedAdmin();
    error EmptyIpfsHash();

    address public admin;
    mapping(address => bool) public verifiedAdmins;
    mapping(address => string[]) public studentDocuments;
    mapping(bytes32 => bool) public verifiedDocuments;
    mapping(bytes32 => address) public documentOwners;
    mapping(address => mapping(address => bool)) public accessRequests;
    mapping(bytes32 => bool) public mintedCertificates;

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

    function uploadDocument(string memory ipfsHash) external {
        if (bytes(ipfsHash).length == 0) {
            revert EmptyIpfsHash();
        }
        bytes32 docHash = keccak256(abi.encodePacked(ipfsHash, msg.sender));
        studentDocuments[msg.sender].push(ipfsHash);
        documentOwners[docHash] = msg.sender;
    }

    function verifyDocument(bytes32 docHash) external onlyAdmin {
        verifiedDocuments[docHash] = true;
    }

    function requestAccess(address student) external {
        require(msg.sender != student, "Owner cannot request access");
        accessRequests[student][msg.sender] = true;
    }

    function grantAccess(address employer) external {
        require(accessRequests[msg.sender][employer], "No access request found");
        accessRequests[msg.sender][employer] = false; // Access granted
    }

    function revokeAccess(address employer) external {
        require(accessRequests[msg.sender][employer] == false, "No granted access to revoke");
        accessRequests[msg.sender][employer] = true;
    }

    function mintCertificate(bytes32 docHash) external onlyAdmin {
        require(!mintedCertificates[docHash], "Certificate already minted");
        mintedCertificates[docHash] = true;
    }
}
