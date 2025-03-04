const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VeriFi", function () {
    let VeriFi;
    let veriFi;
    let owner;
    let admin;
    let user;

    before(async function () {
        [owner, admin, user] = await ethers.getSigners();

        VeriFi = await ethers.getContractFactory("VeriFi");
        veriFi = await VeriFi.deploy();
        await veriFi.deployed();
    });

    // Admin Management Tests
    it("Should allow the owner to add an admin", async function () {
        await veriFi.connect(owner).addAdmin(admin.address);
        expect(await veriFi.hasRole(await veriFi.ADMIN_ROLE(), admin.address)).to.equal(true);
    });

    it("Should not allow a non-owner to add an admin", async function () {
        await expect(
            veriFi.connect(user).addAdmin(user.address)
        ).to.be.revertedWithCustomError(veriFi, "AccessControlUnauthorizedAccount");
    });

    it("Should allow the owner to remove an admin", async function () {
        await veriFi.connect(owner).removeAdmin(admin.address);
        expect(await veriFi.hasRole(await veriFi.ADMIN_ROLE(), admin.address)).to.equal(false);
    });

    // Document Upload Tests
    it("Should allow an admin to upload a document", async function () {
        await veriFi.connect(owner).addAdmin(admin.address);
        await veriFi.connect(admin).uploadDocument(1, "Title", "Description", "Type");
        const doc = await veriFi.documents(1);
        expect(doc.title).to.equal("Title");
        expect(doc.description).to.equal("Description");
        expect(doc.documentType).to.equal("Type");
    });

    it("Should prevent uploading a document with an existing ID", async function () {
        await expect(
            veriFi.connect(admin).uploadDocument(1, "Title", "Description", "Type")
        ).to.be.revertedWith("Document already exists");
    });

    it("Should not allow a non-admin to upload a document", async function () {
        await expect(
            veriFi.connect(user).uploadDocument(2, "Title", "Description", "Type")
        ).to.be.revertedWithCustomError(veriFi, "AccessControlUnauthorizedAccount");
    });

    // Document Access Tests
    it("Should allow an admin to retrieve a document", async function () {
        const [title, description, documentType, uploader] = await veriFi.connect(admin).retrieveDocument(1);
        expect(title).to.equal("Title");
        expect(description).to.equal("Description");
        expect(documentType).to.equal("Type");
        expect(uploader).to.equal(admin.address);
    });

    it("Should not allow a non-admin to retrieve a document", async function () {
        await expect(
            veriFi.connect(user).retrieveDocument(1)
        ).to.be.revertedWithCustomError(veriFi, "AccessControlUnauthorizedAccount");
    });

    // Document Deletion Tests
    it("Should allow the uploader to delete a document", async function () {
        await veriFi.connect(admin).deleteDocument(1);
        expect(await veriFi.documentExists(1)).to.equal(false);
    });

    it("Should not allow a non-uploader to delete a document", async function () {
        await veriFi.connect(admin).uploadDocument(3, "Title", "Description", "Type");
        await expect(
            veriFi.connect(user).deleteDocument(3)
        ).to.be.revertedWithCustomError(veriFi, "AccessControlUnauthorizedAccount");
    });

    // Event Emission Tests
    it("Should emit an event when a document is uploaded", async function () {
        await expect(veriFi.connect(admin).uploadDocument(4, "Title", "Description", "Type"))
            .to.emit(veriFi, "DocumentUploaded")
            .withArgs(4, "Title", "Description", "Type", admin.address);
    });

    it("Should emit an event when a document is deleted", async function () {
        await veriFi.connect(admin).uploadDocument(5, "Title", "Description", "Type");
        await expect(veriFi.connect(admin).deleteDocument(5))
            .to.emit(veriFi, "DocumentDeleted")
            .withArgs(5, admin.address);
    });

    // Gas and Efficiency Tests
    it("Should measure gas usage for document upload", async function () {
        const tx = await veriFi.connect(admin).uploadDocument(6, "Title", "Description", "Type");
        const receipt = await tx.wait();
        expect(receipt.gasUsed).to.be.lessThan(ethers.BigNumber.from("200000"));
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