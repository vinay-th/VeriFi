const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VeriFi", function () {
    let VeriFi;
    let veriFi;
    let admin;
    let student;
    let employer;
    let otherUser;
    let ipfsHash;
    let documentHash;

    beforeEach(async function () {
        [admin, student, employer, otherUser] = await ethers.getSigners();
        VeriFi = await ethers.getContractFactory("VeriFi");
        veriFi = await VeriFi.deploy();
        await veriFi.waitForDeployment();
        ipfsHash = "QmWATm7ABjTjT9n9c59BrWn4i9v79eo3uQe72wFj9V5y9A"; // Dummy IPFS hash
        documentHash = await veriFi.getDocumentHash(ipfsHash);
    });

    // ... (Other tests - upload, verify, requestAccess - same as before)
    it("Should allow a student to upload a document", async function () {
        await veriFi.connect(student).uploadDocument(ipfsHash);
        const [retIpfsHash, verified] = await veriFi.getDocumentDetails(documentHash);
        expect(retIpfsHash).to.equal(ipfsHash);
        expect(verified).to.equal(false);
    });

    it("Should NOT allow a student to upload a document with an empty IPFS hash", async function () {
        const emptyIpfsHash = "";
        await expect(veriFi.connect(student).uploadDocument(emptyIpfsHash)).to.be.revertedWith("IPFS hash cannot be empty");
    });

    it("Should allow the admin to verify a document", async function () {
        await veriFi.connect(student).uploadDocument(ipfsHash);
        await veriFi.connect(admin).verifyDocument(documentHash);
        const [_, verified] = await veriFi.getDocumentDetails(documentHash);
        expect(verified).to.equal(true);
    });

    it("Should NOT allow a non-admin to verify a document", async function () {
        await veriFi.connect(student).uploadDocument(ipfsHash);
        await expect(veriFi.connect(otherUser).verifyDocument(documentHash)).to.be.revertedWith("Only admin can call this function");
    });

    it("Should allow an employer to request access", async function () {
        await veriFi.connect(student).uploadDocument(ipfsHash);
        await veriFi.connect(employer).requestAccess(documentHash);
        const request = await veriFi.accessRequests(student.address, documentHash);
        expect(request.employer).to.equal(employer.address);
    });

    it("Should NOT allow the document owner to request access", async function () {
        await veriFi.connect(student).uploadDocument(ipfsHash);
        await expect(veriFi.connect(student).requestAccess(documentHash)).to.be.revertedWith("You cannot request access to your own document.");
    });

    it("Should allow the student to grant access", async function () {
        await veriFi.connect(student).uploadDocument(ipfsHash);
        await veriFi.connect(employer).requestAccess(documentHash);
        await veriFi.connect(student).grantAccess(documentHash, employer);
        const access = await veriFi.checkAccess(documentHash, employer); // Await the promise
        expect(access).to.equal(true); // Correct assertion
    });

    it("Should NOT allow others to grant access", async function () {
        await veriFi.connect(student).uploadDocument(ipfsHash);
        await veriFi.connect(employer).requestAccess(documentHash);
        await expect(veriFi.connect(otherUser).grantAccess(documentHash, employer)).to.be.revertedWith("Only the document owner can grant access.");
    });

    it("Should allow the student to revoke access", async function () {
        await veriFi.connect(student).uploadDocument(ipfsHash);
        await veriFi.connect(employer).requestAccess(documentHash);
        await veriFi.connect(student).grantAccess(documentHash, employer);
        const accessGranted = await veriFi.checkAccess(documentHash, employer);
        expect(accessGranted).to.equal(true);
        await veriFi.connect(student).revokeAccess(documentHash, employer);
        const accessRevoked = await veriFi.checkAccess(documentHash, employer);
        expect(accessRevoked).to.equal(false);
    });

    it("Should NOT allow others to revoke access", async function () {
        await veriFi.connect(student).uploadDocument(ipfsHash);
        await veriFi.connect(employer).requestAccess(documentHash);
        await veriFi.connect(student).grantAccess(documentHash, employer);
        await expect(veriFi.connect(otherUser).revokeAccess(documentHash, employer)).to.be.revertedWith("Only the document owner can revoke access.");
    });

    it("Should correctly check access after granting and before revoking", async function () {
        await veriFi.connect(student).uploadDocument(ipfsHash);
        await veriFi.connect(employer).requestAccess(documentHash); // Employer requests access FIRST
        const accessBefore = await veriFi.checkAccess(documentHash, employer);
        expect(accessBefore).to.equal(false); // Should not have access yet
    
        await veriFi.connect(student).grantAccess(documentHash, employer);
        const accessAfter = await veriFi.checkAccess(documentHash, employer);
        expect(accessAfter).to.equal(true); // Should have access now
    });

});