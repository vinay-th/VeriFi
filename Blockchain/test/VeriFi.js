const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VeriFi", function () {
    let VeriFi; // Contract factory
    let veriFi; // Deployed contract instance
    let owner;  // Owner account (deployer)
    let verifier;  // Verifier account
    let student; // Student account
    let employer; // Employer account

    before(async function () {
        // Get signers for owner, verifier, student, and employer
        [owner, verifier, student, employer] = await ethers.getSigners();

        // Get contract factory for VeriFi
        VeriFi = await ethers.getContractFactory("VeriFi");
        // Deploy the VeriFi contract
        veriFi = await VeriFi.deploy();
    });

    // Verifier Management Tests
    it("Should allow the owner to add a verifier", async function () {
        await veriFi.connect(owner).addVerifier(verifier.address);
        expect(await veriFi.hasRole(await veriFi.VERIFIER_ROLE(), verifier.address)).to.equal(true);
    });

    it("Should not allow a non-owner to add a verifier", async function () {
        await expect(
            veriFi.connect(student).addVerifier(student.address)
        ).to.be.revertedWithCustomError(veriFi, "AccessControlUnauthorizedAccount");
    });

    it("Should allow the owner to remove a verifier", async function () {
        await veriFi.connect(owner).removeVerifier(verifier.address);
        expect(await veriFi.hasRole(await veriFi.VERIFIER_ROLE(), verifier.address)).to.equal(false);
    });

    // Document Upload Tests
    it("Should allow a verifier to upload a document", async function () {
        await veriFi.connect(owner).addVerifier(verifier.address);
        await veriFi.connect(verifier).uploadDocument(1, "Title", "Description", "Type");
        const doc = await veriFi.documents(1);
        expect(doc.title).to.equal("Title");
        expect(doc.description).to.equal("Description");
        expect(doc.documentType).to.equal("Type");
    });

    it("Should prevent uploading a document with an existing ID", async function () {
        await expect(
            veriFi.connect(verifier).uploadDocument(1, "Title", "Description", "Type")
        ).to.be.revertedWith("Document already exists");
    });

    it("Should not allow a non-verifier to upload a document", async function () {
        await expect(
            veriFi.connect(student).uploadDocument(2, "Title", "Description", "Type")
        ).to.be.revertedWithCustomError(veriFi, "AccessControlUnauthorizedAccount");
    });

    // Document Access Tests
    it("Should allow a verifier to retrieve a document", async function () {
        const [title, description, documentType, uploader] = await veriFi.connect(verifier).retrieveDocument(1);
        expect(title).to.equal("Title");
        expect(description).to.equal("Description");
        expect(documentType).to.equal("Type");
        expect(uploader).to.equal(verifier.address);
    });

    it("Should not allow a non-verifier to retrieve a document", async function () {
        await expect(
            veriFi.connect(student).retrieveDocument(1)
        ).to.be.revertedWithCustomError(veriFi, "AccessControlUnauthorizedAccount");
    });

    // Document Deletion Tests
    it("Should allow the uploader to delete a document", async function () {
        await veriFi.connect(verifier).deleteDocument(1);
        expect(await veriFi.documentExists(1)).to.equal(false);
    });

    it("Should not allow a non-uploader to delete a document", async function () {
        await veriFi.connect(verifier).uploadDocument(3, "Title", "Description", "Type");
        await expect(
            veriFi.connect(student).deleteDocument(3)
        ).to.be.revertedWithCustomError(veriFi, "AccessControlUnauthorizedAccount");
    });

    // Pending Requests Tests
    it("Should allow a student to request access to a document", async function () {
        await veriFi.connect(verifier).uploadDocument(4, "Title", "Description", "Type");
        await veriFi.connect(student).requestAccess(4, employer.address);
        expect(await veriFi.pendingRequests(student.address, 4, employer.address)).to.equal(true);
    });

    it("Should allow a student to grant access to a document", async function () {
        // Create a pending request
        await veriFi.connect(student).requestAccess(4, employer.address);
        // Grant access
        await veriFi.connect(student).grantAccess(employer.address, 4);
        expect(await veriFi.pendingRequests(student.address, 4, employer.address)).to.equal(false);
    });

    it("Should allow a student to reject access to a document", async function () {
        // Create a pending request
        await veriFi.connect(student).requestAccess(4, employer.address);
        // Reject access
        await veriFi.connect(student).rejectAccess(employer.address, 4);
        expect(await veriFi.pendingRequests(student.address, 4, employer.address)).to.equal(false);
    });

    // Hash Code Logic Tests
    it("Should allow the owner to add a hashcode", async function () {
        await veriFi.connect(owner).addHashCode("12345678", student.address);
        expect(await veriFi.getAddressFromHashCode("12345678")).to.equal(student.address);
    });

    it("Should not allow a non-owner to add a hashcode", async function () {
        await expect(
            veriFi.connect(student).addHashCode("87654321", student.address)
        ).to.be.revertedWithCustomError(veriFi, "AccessControlUnauthorizedAccount");
    });

    // Access Revocation Tests
    it("Should store the timestamp when access is granted", async function () {
        // Create a pending request
        await veriFi.connect(student).requestAccess(4, employer.address);
        // Grant access
        await veriFi.connect(student).grantAccess(employer.address, 4);
        // Check the timestamp
        const timestamp = await veriFi.accessGrantTimestamps(employer.address, 4);
        expect(timestamp).to.be.gt(0);
    });
});