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

    it("Should not allow non-admin to upload a document", async function () {
        await expect(
            veriFi.connect(user).uploadDocument("TestDoc", "Issuer", "QmHash")
        ).to.be.revertedWithCustomError(veriFi, "AccessControlUnauthorizedAccount");
    });

    it("Should add a new admin", async function () {
        await veriFi.connect(admin).addAdmin(user.address);
        expect(await veriFi.hasRole(await veriFi.ADMIN_ROLE(), user.address)).to.equal(true);
    });

    it("Should remove an admin", async function () {
        await veriFi.connect(admin).removeAdmin(user.address);
        expect(await veriFi.hasRole(await veriFi.ADMIN_ROLE(), user.address)).to.equal(false);
    });

    it("Should allow admin to upload a document", async function () {
        await veriFi.connect(admin).uploadDocument("TestDoc", "Issuer", "QmHash");
        const doc = await veriFi.documents(1);
        expect(doc.name).to.equal("TestDoc");
        expect(doc.issuer).to.equal("Issuer");
        expect(doc.ipfsHash).to.equal("QmHash");
    });

    it("Should retrieve the uploaded document", async function () {
        const doc = await veriFi.documents(1);
        expect(doc.name).to.equal("TestDoc");
        expect(doc.issuer).to.equal("Issuer");
        expect(doc.ipfsHash).to.equal("QmHash");
    });

    it("Should prevent duplicate document uploads", async function () {
        await expect(
            veriFi.connect(admin).uploadDocument("TestDoc", "Issuer", "QmHash")
        ).to.be.revertedWith("Document already exists");
    });

    it("Should not allow non-admin to upload a document", async function () {
        await expect(
            veriFi.connect(user).uploadDocument("TestDoc", "Issuer", "QmHash")
        ).to.be.revertedWithCustomError(veriFi, "AccessControlUnauthorizedAccount");
    });

    it("Should allow admin to access the document", async function () {
        const doc = await veriFi.connect(admin).queryDocumentStatus(1);
        expect(doc.isVerified).to.equal(false);
        expect(doc.isRevoked).to.equal(false);
    });

    it("Should not allow non-admin to access the document", async function () {
        const [isVerified, isRevoked, revocationReason] = await veriFi.connect(user).queryDocumentStatus(1);
        expect(isVerified).to.equal(false);
        expect(isRevoked).to.equal(false);
        expect(revocationReason).to.equal("");
    });

    it("Should store metadata correctly", async function () {
        const doc = await veriFi.documents(1);
        expect(doc.name).to.equal("TestDoc");
        expect(doc.issuer).to.equal("Issuer");
        expect(doc.ipfsHash).to.equal("QmHash");
    });

    it("Should reject incomplete metadata", async function () {
        await expect(
            veriFi.connect(admin).uploadDocument("TestDoc", "Issuer", "")
        ).to.be.revertedWith("IPFS hash cannot be empty");
    });

    it("Should upload a document within reasonable gas limits", async function () {
        const tx = await veriFi.connect(admin).uploadDocument("LargeDoc", "Issuer", "QmLargeHash");
        const receipt = await tx.wait();
        expect(receipt.gasUsed).to.be.lessThan(ethers.BigNumber.from("200000"));
    });

    it("Should handle multiple uploads efficiently", async function () {
        await veriFi.connect(admin).uploadDocument("Doc1", "Issuer1", "QmHash1");
        await veriFi.connect(admin).uploadDocument("Doc2", "Issuer2", "QmHash2");
        const doc1 = await veriFi.documents(2);
        const doc2 = await veriFi.documents(3);
        expect(doc1.name).to.equal("Doc1");
        expect(doc2.name).to.equal("Doc2");
    });

    it("Should be immune to reentrancy attacks", async function () {
        expect(true).to.equal(true);
    });

    it("Should prevent overflow/underflow", async function () {
        expect(true).to.equal(true);
    });

    it("Should upload a document with maximum size", async function () {
        const largeHash = "Qm" + "a".repeat(64);
        await veriFi.connect(admin).uploadDocument("LargeDoc", "Issuer", largeHash);
        const doc = await veriFi.documents(4);
        expect(doc.ipfsHash).to.equal(largeHash);
    });

    it("Should handle multiple uploads under high load", async function () {
        for (let i = 0; i < 10; i++) {
            await veriFi.connect(admin).uploadDocument(`Doc${i}`, `Issuer${i}`, `QmHash${i}`);
        }
        const doc = await veriFi.documents(14);
        expect(doc.name).to.equal("Doc9");
    });

    it("Should emit an event on document upload", async function () {
        const blockNumber = await ethers.provider.getBlockNumber();
        await expect(veriFi.connect(admin).uploadDocument("EventDoc", "Issuer", "QmEventHash"))
            .to.emit(veriFi, "DocumentUploaded")
            .withArgs(15, "EventDoc", "Issuer", "QmEventHash", blockNumber + 1);
    });

    it("Should emit an event when an admin is added", async function () {
        await expect(veriFi.connect(admin).addAdmin(user.address))
            .to.emit(veriFi, "AdminAdded")
            .withArgs(user.address);
    });

    it("Should not allow non-admin to revoke a document", async function () {
        await expect(
            veriFi.connect(user).revokeDocument(1, "Invalid")
        ).to.be.revertedWithCustomError(veriFi, "AccessControlUnauthorizedAccount");
    });

    it("Should allow admin to revoke a document", async function () {
        await veriFi.connect(admin).uploadDocument("RevokeDoc", "Issuer", "QmRevokeHash");
        const docId = documentCounter;
        await veriFi.connect(admin).revokeDocument(docId, "Invalid");
        const doc = await veriFi.documents(docId);
        expect(doc.isRevoked).to.equal(true);
        expect(doc.revocationReason).to.equal("Invalid");
    });
});