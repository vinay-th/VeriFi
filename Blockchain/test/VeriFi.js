const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VeriFi", function () {
    let VeriFi, veriFi, admin, student, employer, nonAdmin;
    const ipfsHash = "Qm123456789"; // Consistent IPFS hash

    beforeEach(async function () {
        [admin, student, employer, nonAdmin] = await ethers.getSigners();
        VeriFi = await ethers.getContractFactory("VeriFi");
        veriFi = await VeriFi.deploy();
    });

    async function uploadAndVerifyDocument(student) {
        const tx = await veriFi.connect(student).uploadDocument(ipfsHash);
        const receipt = await tx.wait();
        const docHash = receipt.events.find((e) => e.event === "DocumentUploaded").args.docHash;
        await veriFi.connect(admin).verifyDocument(docHash);
        return docHash;
    }

    it("Should allow the admin to verify a document", async function () {
        const docHash = await uploadAndVerifyDocument(student);
        await expect(veriFi.connect(admin).verifyDocument(docHash))
            .to.emit(veriFi, "DocumentVerified");
    });

    it("Should NOT allow a non-admin to verify a document", async function () {
        const docHash = await uploadAndVerifyDocument(student);
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
            .to.be.revertedWith("Cannot request access to own documents");
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
        expect(await veriFi.accessGrants(student.address, employer.address)).to.equal(true);
        await veriFi.connect(student).revokeAccess(employer.address);
        expect(await veriFi.accessGrants(student.address, employer.address)).to.equal(false);
    });

    it("Should allow admin to mint a certificate", async function () {
        const docHash = await uploadAndVerifyDocument(student);
        await expect(veriFi.connect(admin).mintCertificate(docHash))
            .to.emit(veriFi, "CertificateMinted");
    });

    it("Should NOT allow non-admin to mint a certificate", async function () {
        const docHash = await uploadAndVerifyDocument(student);
        await expect(veriFi.connect(nonAdmin).mintCertificate(docHash))
            .to.be.revertedWithCustomError(veriFi, "NotVerifiedAdmin");
    });

    it("Should NOT allow minting a duplicate certificate", async function () {
        const docHash = await uploadAndVerifyDocument(student);
        await veriFi.connect(admin).mintCertificate(docHash);
        await expect(veriFi.connect(admin).mintCertificate(docHash)).to.be.revertedWithCustomError(
            veriFi, "CertificateAlreadyMinted"
        );
    });
});