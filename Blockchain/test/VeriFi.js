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
    let ipfsBytes32;

    beforeEach(async function () {
        [admin, student, employer, otherUser] = await ethers.getSigners();
        VeriFi = await ethers.getContractFactory("VeriFi");
        veriFi = await VeriFi.deploy(admin.address);
        await veriFi.waitForDeployment();
        ipfsHash = "QmWATm7ABjTjT9n9c59BrWn4i9v79eo3uQe72wFj9V5y9A";
        ipfsBytes32 = ethers.utils.formatBytes32String(ipfsHash);
        documentHash = ethers.keccak256(ipfsBytes32);
    });

    it("Should allow a student to upload a document", async function () {
        await veriFi.connect(student).uploadDocument(ipfsBytes32);
        const [retIpfsHash, verified] = await veriFi.getDocumentDetails(documentHash);
        expect(retIpfsHash).to.equal(ipfsBytes32);
        expect(verified).to.equal(false);
    });

    it("Should NOT allow a student to upload a document with an empty IPFS hash", async function () {
        const emptyIpfsHash = ethers.utils.formatBytes32String("");
        await expect(veriFi.connect(student).uploadDocument(emptyIpfsHash)).to.be.revertedWithCustomError(veriFi, "EmptyIpfsHash");
    });

    it("Should allow the admin to verify a document", async function () {
        await veriFi.connect(student).uploadDocument(ipfsBytes32);
        await veriFi.connect(admin).verifyDocument(documentHash);
        const [_, verified] = await veriFi.getDocumentDetails(documentHash);
        expect(verified).to.equal(true);
    });

    it("Should NOT allow a non-admin to verify a document", async function () {
        await veriFi.connect(student).uploadDocument(ipfsBytes32);
        await expect(veriFi.connect(otherUser).verifyDocument(documentHash)).to.be.revertedWithCustomError(veriFi, "NotVerifiedAdmin");
    });

    it("Should allow an employer to request access", async function () {
        await veriFi.connect(student).uploadDocument(ipfsBytes32);
        await veriFi.connect(employer).requestAccess(documentHash);
        const request = await veriFi.accessRequests(student.address, documentHash);
        expect(request.employer).to.equal(employer.address);
    });

    it("Should NOT allow the document owner to request access", async function () {
        await veriFi.connect(student).uploadDocument(ipfsBytes32);
        await expect(veriFi.connect(student).requestAccess(documentHash)).to.be.revertedWithCustomError(veriFi, "SelfAccessRequest");
    });

    it("Should allow the student to grant access", async function () {
        await veriFi.connect(student).uploadDocument(ipfsBytes32);
        await veriFi.connect(employer).requestAccess(documentHash);
        await veriFi.connect(student).grantAccess(documentHash, employer.address);
        const access = await veriFi.checkAccess(documentHash, employer.address);
        expect(access).to.equal(true);
    });

    it("Should NOT allow others to grant access", async function () {
        await veriFi.connect(student).uploadDocument(ipfsBytes32);
        await veriFi.connect(employer).requestAccess(documentHash);
        await expect(veriFi.connect(otherUser).grantAccess(documentHash, employer.address)).to.be.revertedWithCustomError(veriFi, "NotDocumentOwner");
    });

    it("Should allow the student to revoke access", async function () {
        await veriFi.connect(student).uploadDocument(ipfsBytes32);
        await veriFi.connect(employer).requestAccess(documentHash);
        await veriFi.connect(student).grantAccess(documentHash, employer.address);
        const accessGranted = await veriFi.checkAccess(documentHash, employer.address);
        expect(accessGranted).to.equal(true);
        await veriFi.connect(student).revokeAccess(documentHash, employer.address);
        const accessRevoked = await veriFi.checkAccess(documentHash, employer.address);
        expect(accessRevoked).to.equal(false);
    });

    it("Should NOT allow others to revoke access", async function () {
        await veriFi.connect(student).uploadDocument(ipfsBytes32);
        await veriFi.connect(employer).requestAccess(documentHash);
        await veriFi.connect(student).grantAccess(documentHash, employer.address);
        await expect(veriFi.connect(otherUser).revokeAccess(documentHash, employer.address)).to.be.revertedWithCustomError(veriFi, "NotDocumentOwner");
    });

    it("Should correctly check access after granting and before revoking", async function () {
        await veriFi.connect(student).uploadDocument(ipfsBytes32);
        await veriFi.connect(admin).verifyDocument(documentHash);
        await veriFi.connect(employer).requestAccess(documentHash);
        await veriFi.connect(student).grantAccess(documentHash, employer.address);
        const hasAccess = await veriFi.checkAccess(documentHash, employer.address);
        expect(hasAccess).to.equal(true);
    });

    it("Should allow admin to mint a certificate", async function () {
        await veriFi.connect(student).uploadDocument(ipfsBytes32);
        const certificateName = "Degree Certificate";
        const issueDate = "2024-01-01";
        const issuer = "University";
        await veriFi.connect(admin).mintCertificate(student.address, certificateName, issueDate, issuer, documentHash);
        const certificate = await veriFi.getCertificateDetails(documentHash);
        expect(certificate.recipient).to.equal(student.address);
        expect(certificate.certificateName).to.equal(certificateName);
    });

    it("Should NOT allow non-admin to mint a certificate", async function () {
        await veriFi.connect(student).uploadDocument(ipfsBytes32);
        const certificateName = "Degree Certificate";
        const issueDate = "2024-01-01";
        const issuer = "University";
        await expect(veriFi.connect(otherUser).mintCertificate(student.address, certificateName, issueDate, issuer, documentHash)).to.be.revertedWithCustomError(veriFi, "NotVerifiedAdmin");
    });

    it("Should NOT allow minting a duplicate certificate", async function () {
        await veriFi.connect(student).uploadDocument(ipfsBytes32);
        const certificateName = "Degree Certificate";
        const issueDate = "2024-01-01";
        const issuer = "University";
        await veriFi.connect(admin).mintCertificate(student.address, certificateName, issueDate, issuer, documentHash);
        await expect(veriFi.connect(admin).mintCertificate(student.address, certificateName, issueDate, issuer, documentHash)).to.be.revertedWithCustomError(veriFi, "CertificateAlreadyMinted");
    });
});