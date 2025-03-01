const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VeriFi", function () {
    let VeriFi, veriFi, admin, student, employer, nonAdmin;

    beforeEach(async function () {
        [admin, student, employer, nonAdmin] = await ethers.getSigners();
        VeriFi = await ethers.getContractFactory("VeriFi");
        veriFi = await VeriFi.deploy();
    });

    it("Should allow a student to upload a document", async function () {
        await expect(veriFi.connect(student).uploadDocument("Qm123456789"))
            .to.emit(veriFi, "DocumentUploaded");
    });

    it("Should NOT allow a student to upload a document with an empty IPFS hash", async function () {
        await expect(veriFi.connect(student).uploadDocument("")).to.be.revertedWithCustomError(
            veriFi, "EmptyIpfsHash"
        );
    });

    it("Should allow the admin to verify a document", async function () {
        const docHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("Qm123456789"));
        await expect(veriFi.connect(admin).verifyDocument(docHash))
            .to.emit(veriFi, "DocumentVerified");
    });

    it("Should NOT allow a non-admin to verify a document", async function () {
        const docHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("Qm123456789"));
        await expect(veriFi.connect(nonAdmin).verifyDocument(docHash)).to.be.revertedWithCustomError(
            veriFi, "NotVerifiedAdmin"
        );
    });

    it("Should allow an employer to request access", async function () {
        await expect(veriFi.connect(employer).requestAccess(student.address))
            .to.emit(veriFi, "AccessRequested");
    });

    it("Should NOT allow the document owner to request access", async function () {
        await expect(veriFi.connect(student).requestAccess(student.address))
            .to.be.revertedWith("Owner cannot request access");
    });

    it("Should allow the student to grant access", async function () {
        await veriFi.connect(employer).requestAccess(student.address);
        await expect(veriFi.connect(student).grantAccess(employer.address))
            .to.emit(veriFi, "AccessGranted");
    });

    it("Should NOT allow others to grant access", async function () {
        await veriFi.connect(employer).requestAccess(student.address);
        await expect(veriFi.connect(nonAdmin).grantAccess(employer.address))
            .to.be.revertedWith("No access request found");
    });

    it("Should allow the student to revoke access", async function () {
        await veriFi.connect(employer).requestAccess(student.address);
        await veriFi.connect(student).grantAccess(employer.address);
        await expect(veriFi.connect(student).revokeAccess(employer.address))
            .to.emit(veriFi, "AccessRevoked");
    });

    it("Should NOT allow others to revoke access", async function () {
        await veriFi.connect(employer).requestAccess(student.address);
        await veriFi.connect(student).grantAccess(employer.address);
        await expect(veriFi.connect(nonAdmin).revokeAccess(employer.address))
            .to.be.revertedWith("No granted access to revoke");
    });

    it("Should correctly check access after granting and before revoking", async function () {
        await veriFi.connect(employer).requestAccess(student.address);
        await veriFi.connect(student).grantAccess(employer.address);
        expect(await veriFi.accessRequests(student.address, employer.address)).to.equal(false);
        await veriFi.connect(student).revokeAccess(employer.address);
        expect(await veriFi.accessRequests(student.address, employer.address)).to.equal(true);
    });

    it("Should allow admin to mint a certificate", async function () {
        const docHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("Qm123456789"));
        await expect(veriFi.connect(admin).mintCertificate(docHash))
            .to.emit(veriFi, "CertificateMinted");
    });

    it("Should NOT allow non-admin to mint a certificate", async function () {
        const docHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("Qm123456789"));
        await expect(veriFi.connect(nonAdmin).mintCertificate(docHash))
            .to.be.revertedWithCustomError(veriFi, "NotVerifiedAdmin");
    });

    it("Should NOT allow minting a duplicate certificate", async function () {
        const docHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("Qm123456789"));
        await veriFi.connect(admin).mintCertificate(docHash);
        await expect(veriFi.connect(admin).mintCertificate(docHash)).to.be.revertedWith(
            "Certificate already minted"
        );
    });
});
