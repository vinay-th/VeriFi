// contracts/VeriFi.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract VeriFi {
    struct Document {
        string ipfsHash;
        address uploader;
        bool verified;
    }

    struct AccessRequest {
        address employer;
        uint256 validUntil; // Timestamp until access is valid
    }

    mapping(bytes32 => Document) public documents;
    mapping(address => mapping(bytes32 => AccessRequest)) public accessRequests;
    address public admin;

    event DocumentUploaded(bytes32 indexed documentHash, string ipfsHash, address indexed uploader);
    event DocumentVerified(bytes32 indexed documentHash, address indexed verifier);
    event AccessRequested(bytes32 indexed documentHash, address indexed employer);
    event AccessGranted(bytes32 indexed documentHash, address indexed employer, address indexed student);
    event AccessRevoked(bytes32 indexed documentHash, address indexed employer, address indexed student);

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    function uploadDocument(string memory _ipfsHash) public {
        require(bytes(_ipfsHash).length > 0, "IPFS hash cannot be empty");
        bytes32 documentHash = keccak256(abi.encodePacked(_ipfsHash));
        documents[documentHash] = Document(_ipfsHash, msg.sender, false);
        emit DocumentUploaded(documentHash, _ipfsHash, msg.sender);
    }

    function verifyDocument(bytes32 _documentHash) public onlyAdmin {
        documents[_documentHash].verified = true;
        emit DocumentVerified(_documentHash, msg.sender);
    }

    function getDocumentDetails(bytes32 _documentHash) public view returns (string memory ipfsHash, bool verified) {
        Document storage doc = documents[_documentHash];
        return (doc.ipfsHash, doc.verified);
    }

    function getDocumentHash(string memory _ipfsHash) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_ipfsHash));
    }

    function requestAccess(bytes32 _documentHash) public {
        require(documents[_documentHash].uploader!= msg.sender, "You cannot request access to your own document.");
        accessRequests[documents[_documentHash].uploader][_documentHash] = AccessRequest(msg.sender, block.timestamp + 6 hours); // 6-hour validity
        emit AccessRequested(_documentHash, msg.sender);
    }

    function grantAccess(bytes32 _documentHash, address _employer) public {
        require(documents[_documentHash].uploader == msg.sender, "Only the document owner can grant access.");
        require(accessRequests[msg.sender][_documentHash].employer == _employer, "Employer has not requested access.");
        require(accessRequests[msg.sender][_documentHash].validUntil > block.timestamp, "Request has expired.");
        emit AccessGranted(_documentHash, _employer, msg.sender);
    }

    function revokeAccess(bytes32 _documentHash, address _employer) public {
        require(documents[_documentHash].uploader == msg.sender, "Only the document owner can revoke access.");
        delete accessRequests[msg.sender][_documentHash];
        emit AccessRevoked(_documentHash, _employer, msg.sender);
    }

    function checkAccess(bytes32 _documentHash, address _employer) public view returns (bool) {
        Document storage doc = documents[_documentHash]; // Get the document struct
        return accessRequests[doc.uploader][_documentHash].employer == _employer && accessRequests[doc.uploader][_documentHash].validUntil > block.timestamp;
    }
}