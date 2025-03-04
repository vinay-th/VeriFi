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

    it("Should allow admin to upload a document", async function () {
        await veriFi.connect(admin).uploadDocument("TestDoc", "Issuer", "QmHash");
        const doc = await veriFi.documents(1);
        expect(doc.name).to.equal("TestDoc");
        expect(doc.issuer).to.equal("Issuer");
        expect(doc.ipfsHash).to.equal("QmHash");
    });

     it("Should not allow non-admin to upload a document", async function () {
        // Expect a custom error for AccessControl
        await expect(
            veriFi.connect(user).uploadDocument("TestDoc", "Issuer", "QmHash")
        ).to.be.revertedWithCustomError(veriFi, "AccessControlUnauthorizedAccount");
    });

    it("Should allow admin to verify a document", async function () {
        await veriFi.connect(admin).verifyDocument(1);
        const doc = await veriFi.documents(1);
        expect(doc.isVerified).to.equal(true);
    });

    it("Should allow admin to revoke a document", async function () {
        await veriFi.connect(admin).revokeDocument(1, "Invalid");
        const doc = await veriFi.documents(1);
        expect(doc.isRevoked).to.equal(true);
        expect(doc.revocationReason).to.equal("Invalid");
    });

    it("Should allow users to query document status", async function () {
        const [isVerified, isRevoked, revocationReason] = await veriFi.connect(user).queryDocumentStatus(1);
        expect(isVerified).to.equal(true);
        expect(isRevoked).to.equal(true);
        expect(revocationReason).to.equal("Invalid");
    });
});