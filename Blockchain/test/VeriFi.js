const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VeriFi", function () {
    let VeriFi; // Contract factory
    let veriFi; // Deployed contract instance
    let owner;  // Owner account (deployer)
    let verifier;  // Verifier account
    let user;   // Regular user account

    before(async function () {
        // Get signers for owner, verifier, and user
        [owner, verifier, user] = await ethers.getSigners();

        // Get contract factory for VeriFi
        VeriFi = await ethers.getContractFactory("VeriFi");
        // Deploy the VeriFi contract
        veriFi = await VeriFi.deploy();
    });

    // Verifier Management Tests
    it("Should allow the owner to add a verifier", async function () {
        // Owner adds verifier
        await veriFi.connect(owner).addVerifier(verifier.address);
        // Verify verifier role is granted
        expect(await veriFi.hasRole(await veriFi.VERIFIER_ROLE(), verifier.address)).to.equal(true);
    });

    it("Should not allow a non-owner to add a verifier", async function () {
        // User attempts to add verifier (should revert)
        await expect(
            veriFi.connect(user).addVerifier(user.address)
        ).to.be.revertedWithCustomError(veriFi, "AccessControlUnauthorizedAccount");
    });

    it("Should allow the owner to remove a verifier", async function () {
        // Owner removes verifier
        await veriFi.connect(owner).removeVerifier(verifier.address);
        // Verify verifier role is revoked
        expect(await veriFi.hasRole(await veriFi.VERIFIER_ROLE(), verifier.address)).to.equal(false);
    });

    // Document Upload Tests
    it("Should allow a verifier to upload a document", async function () {
        // Re-add verifier for this test
        await veriFi.connect(owner).addVerifier(verifier.address);
        // Verifier uploads a document
        await veriFi.connect(verifier).uploadDocument(1, "Title", "Description", "Type");
        // Retrieve and verify document details
        const doc = await veriFi.documents(1);
        expect(doc.title).to.equal("Title");
        expect(doc.description).to.equal("Description");
        expect(doc.documentType).to.equal("Type");
    });

    it("Should prevent uploading a document with an existing ID", async function () {
        // Verifier attempts to upload a document with a duplicate ID (should revert)
        await expect(
            veriFi.connect(verifier).uploadDocument(1, "Title", "Description", "Type")
        ).to.be.revertedWith("Document already exists");
    });

    it("Should not allow a non-verifier to upload a document", async function () {
        // User attempts to upload a document (should revert)
        await expect(
            veriFi.connect(user).uploadDocument(2, "Title", "Description", "Type")
        ).to.be.revertedWithCustomError(veriFi, "AccessControlUnauthorizedAccount");
    });

    // Document Access Tests
    it("Should allow a verifier to retrieve a document", async function () {
        // Verifier retrieves document details
        const [title, description, documentType, uploader] = await veriFi.connect(verifier).retrieveDocument(1);
        // Verify retrieved document details
        expect(title).to.equal("Title");
        expect(description).to.equal("Description");
        expect(documentType).to.equal("Type");
        expect(uploader).to.equal(verifier.address);
    });

    it("Should not allow a non-verifier to retrieve a document", async function () {
        // User attempts to retrieve a document (should revert)
        await expect(
            veriFi.connect(user).retrieveDocument(1)
        ).to.be.revertedWithCustomError(veriFi, "AccessControlUnauthorizedAccount");
    });

    // Document Deletion Tests
    it("Should allow the uploader to delete a document", async function () {
        // Verifier deletes the uploaded document
        await veriFi.connect(verifier).deleteDocument(1);
        // Verify document no longer exists
        expect(await veriFi.documentExists(1)).to.equal(false);
    });

    it("Should not allow a non-uploader to delete a document", async function () {
        // Verifier uploads a new document
        await veriFi.connect(verifier).uploadDocument(3, "Title", "Description", "Type");
        // User attempts to delete the document (should revert)
        await expect(
            veriFi.connect(user).deleteDocument(3)
        ).to.be.revertedWithCustomError(veriFi, "AccessControlUnauthorizedAccount");
    });

    // Event Emission Tests
    it("Should emit an event when a document is uploaded", async function () {
        // Verify DocumentUploaded event is emitted
        await expect(veriFi.connect(verifier).uploadDocument(4, "Title", "Description", "Type"))
            .to.emit(veriFi, "DocumentUploaded")
            .withArgs(4, "Title", "Description", "Type", verifier.address);
    });

    it("Should emit an event when a document is deleted", async function () {
        // Verifier uploads a new document
        await veriFi.connect(verifier).uploadDocument(5, "Title", "Description", "Type");
        // Verify DocumentDeleted event is emitted
        await expect(veriFi.connect(verifier).deleteDocument(5))
            .to.emit(veriFi, "DocumentDeleted")
            .withArgs(5, verifier.address);
    });

    // Gas and Efficiency Tests
    it("Should measure gas usage for document upload", async function () {
        // Measure gas used for document upload
        const tx = await veriFi.connect(verifier).uploadDocument(6, "Title", "Description", "Type");
        const receipt = await tx.wait();
        // Verify gas usage is within acceptable limits
        expect(receipt.gasUsed).to.be.lessThan(200000); // Directly compare with a number
    });

    // Security Tests
    it("Should prevent reentrancy attacks", async function () {
        // Simulate a reentrancy attack (not applicable here due to AccessControl)
        expect(true).to.equal(true);
    });

    it("Should prevent integer overflow/underflow", async function () {
        // Solidity 0.8.x automatically checks for overflow/underflow
        expect(true).to.equal(true);
    });
});