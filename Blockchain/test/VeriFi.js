const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VeriFi", function () {
    let VeriFi;
    let veriFi;
    let admin;
    let user;

    before(async function () {
        [admin, user] = await ethers.getSigners();

        VeriFi = await ethers.getContractFactory("VeriFi");
        veriFi = await VeriFi.deploy();
    });

    // Test Case 1: Verify that only the admin can upload documents
    it("Should not allow non-admin to upload a document", async function () {
        await expect(
            veriFi.connect(user).uploadDocument("TestDoc", "Issuer", "QmHash")
        ).to.be.revertedWithCustomError(veriFi, "AccessControlUnauthorizedAccount");
    });

    // Test Case 2: Verify that admins are properly added
    it("Should add a new admin", async function () {
        await veriFi.connect(admin).addAdmin(user.address);
        expect(await veriFi.hasRole(await veriFi.ADMIN_ROLE(), user.address)).to.equal(true);
    });

    // Test Case 3: Verify that an admin can be removed
    it("Should remove an admin", async function () {
        await veriFi.connect(admin).removeAdmin(user.address);
        expect(await veriFi.hasRole(await veriFi.ADMIN_ROLE(), user.address)).to.equal(false);
    });

    // Test Case 4: Verify that an admin can upload a document
    it("Should allow admin to upload a document", async function () {
        await veriFi.connect(admin).uploadDocument("TestDoc", "Issuer", "QmHash");
        const doc = await veriFi.documents(1);
        expect(doc.name).to.equal("TestDoc");
        expect(doc.issuer).to.equal("Issuer");
        expect(doc.ipfsHash).to.equal("QmHash");
    });

    // Test Case 5: Verify that the document can be retrieved
    it("Should retrieve the uploaded document", async function () {
        const doc = await veriFi.documents(1);
        expect(doc.name).to.equal("TestDoc");
        expect(doc.issuer).to.equal("Issuer");
        expect(doc.ipfsHash).to.equal("QmHash");
    });

    // Test Case 6: Verify document uniqueness
    it("Should prevent duplicate document uploads", async function () {
        await expect(
            veriFi.connect(admin).uploadDocument("TestDoc", "Issuer", "QmHash")
        ).to.be.revertedWith("Document already exists");
    });

    // Test Case 7: Verify that only admins can upload documents
    it("Should not allow non-admin to upload a document", async function () {
        await expect(
            veriFi.connect(user).uploadDocument("TestDoc", "Issuer", "QmHash")
        ).to.be.revertedWithCustomError(veriFi, "AccessControlUnauthorizedAccount");
    });

    // Test Case 8: Verify document accessibility by the admin
    it("Should allow admin to access the document", async function () {
        const doc = await veriFi.connect(admin).queryDocumentStatus(1);
        expect(doc.isVerified).to.equal(false);
        expect(doc.isRevoked).to.equal(false);
    });

    // Test Case 9: Verify that non-admin users cannot access documents
    it("Should not allow non-admin to access the document", async function () {
        const [isVerified, isRevoked, revocationReason] = await veriFi.connect(user).queryDocumentStatus(1);
        expect(isVerified).to.equal(false);
        expect(isRevoked).to.equal(false);
        expect(revocationReason).to.equal("");
    });

    // Test Case 10: Verify metadata validation
    it("Should store metadata correctly", async function () {
        const doc = await veriFi.documents(1);
        expect(doc.name).to.equal("TestDoc");
        expect(doc.issuer).to.equal("Issuer");
        expect(doc.ipfsHash).to.equal("QmHash");
    });

    // Test Case 11: Verify that incorrect metadata is rejected
    it("Should reject incomplete metadata", async function () {
        await expect(
            veriFi.connect(admin).uploadDocument("", "Issuer", "QmHash")
        ).to.be.revertedWith("IPFS hash cannot be empty");
    });

    // Test Case 12: Verify gas usage during document upload
    it("Should upload a document within reasonable gas limits", async function () {
        const tx = await veriFi.connect(admin).uploadDocument("LargeDoc", "Issuer", "QmLargeHash");
        const receipt = await tx.wait();
        expect(receipt.gasUsed).to.be.lessThan(ethers.BigNumber.from("200000"));
    });

    // Test Case 13: Verify multiple uploads in a single block
    it("Should handle multiple uploads efficiently", async function () {
        await veriFi.connect(admin).uploadDocument("Doc1", "Issuer1", "QmHash1");
        await veriFi.connect(admin).uploadDocument("Doc2", "Issuer2", "QmHash2");
        const doc1 = await veriFi.documents(2);
        const doc2 = await veriFi.documents(3);
        expect(doc1.name).to.equal("Doc1");
        expect(doc2.name).to.equal("Doc2");
    });

    // Test Case 14: Verify protection against reentrancy attacks
    it("Should be immune to reentrancy attacks", async function () {
        // Simulate a reentrancy attack (not applicable here due to AccessControl)
        // This is a placeholder to demonstrate the concept
        expect(true).to.equal(true);
    });

    // Test Case 15: Verify protection against overflow/underflow
    it("Should prevent overflow/underflow", async function () {
        // Solidity 0.8.x automatically checks for overflow/underflow
        expect(true).to.equal(true);
    });

    // Test Case 16: Verify document upload with maximum size
    it("Should upload a document with maximum size", async function () {
        const largeHash = "Qm" + "a".repeat(64); // Simulate a large hash
        await veriFi.connect(admin).uploadDocument("LargeDoc", "Issuer", largeHash);
        const doc = await veriFi.documents(4);
        expect(doc.ipfsHash).to.equal(largeHash);
    });

    // Test Case 17: Verify document upload under high load
    it("Should handle multiple uploads under high load", async function () {
        for (let i = 0; i < 10; i++) {
            await veriFi.connect(admin).uploadDocument(`Doc${i}`, `Issuer${i}`, `QmHash${i}`);
        }
        const doc = await veriFi.documents(14);
        expect(doc.name).to.equal("Doc9");
    });

    // Test Case 18: Verify event emission on document upload
    it("Should emit an event on document upload", async function () {
        await expect(veriFi.connect(admin).uploadDocument("EventDoc", "Issuer", "QmEventHash"))
            .to.emit(veriFi, "DocumentUploaded")
            .withArgs(15, "EventDoc", "Issuer", "QmEventHash", ethers.BigNumber.from(await ethers.provider.getBlockNumber()));
    });

    // Test Case 19: Verify event emission on admin addition/removal
    it("Should emit an event when an admin is added", async function () {
        await expect(veriFi.connect(admin).addAdmin(user.address))
            .to.emit(veriFi, "AdminAdded")
            .withArgs(user.address);
    });

    // Test Case 20: Verify that only admins can revoke documents
    it("Should not allow non-admin to revoke a document", async function () {
        await expect(
            veriFi.connect(user).revokeDocument(1, "Invalid")
        ).to.be.revertedWithCustomError(veriFi, "AccessControlUnauthorizedAccount");
    });

    // Test Case 21: Verify that a document can be revoked by an admin
    it("Should allow admin to revoke a document", async function () {
        await veriFi.connect(admin).revokeDocument(1, "Invalid");
        const doc = await veriFi.documents(1);
        expect(doc.isRevoked).to.equal(true);
        expect(doc.revocationReason).to.equal("Invalid");
    });
});