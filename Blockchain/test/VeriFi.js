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

    it("Should allow the admin to verify a document", async function () {
        const docHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("Qm123456789"));
        await expect(veriFi.connect(admin).verifyDocument(docHash))
            .to.emit(veriFi, "Document Verified");
    });

    it("Should NOT allow a non-admin to verify a document", async function () {
        const docHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("Qm123456789"));
        await expect(veriFi.connect(nonAdmin).verifyDocument(docHash)).to.be.revertedWithCustomError(
            veriFi, "Not Verified Admin"
        );
    });

    it("Should allow an employer to request access", async function () {
        await expect(veriFi.connect(employer).requestAccess(student.address))
            .to.emit(veriFi, "Access Requested");
    });

    it("Should NOT allow the document owner to request access", async function () {
        await expect(veriFi.connect(student).requestAccess(student.address))
            .to.be.revertedWith("Cannot request access to own documents");
    });

    it("Should allow the student to grant access", async function () {
        await veriFi.connect(employer).requestAccess(student.address);
        await expect(veriFi.connect(student).grantAccess(employer.address))
            .to.emit(veriFi, "Access Granted");
    });

    it("Should NOT allow others to grant access", async function () {
        await veriFi.connect(employer).requestAccess(student.address);
        await expect(veriFi.connect(nonAdmin).grantAccess(employer.address))
            .to.be.revertedWith("You are not the document owner");
    });

    it("Should allow the student to revoke access", async function () {
        await veriFi.connect(employer).requestAccess(student.address);
        await veriFi.connect(student).grantAccess(employer.address);
        await expect(veriFi.connect(student).revokeAccess(employer.address))
            .to.emit(veriFi, "Access Revoked");
    });

    it("Should NOT allow others to revoke access", async function () {
        await veriFi.connect(employer).requestAccess(student.address);
        await veriFi.connect(student).grantAccess(employer.address);
        await expect(veriFi.connect(nonAdmin).revokeAccess(employer.address))
            .to.be.revertedWith("You are not the document owner");
    });

    it("Should correctly check access after granting and before revoking", async function () {
        await veriFi.connect(employer).requestAccess(student.address);
        await veriFi.connect(student).grantAccess(employer.address);
        expect(await veriFi.accessRequests(student.address, employer.address)).to.equal(false);
        await veriFi.connect(student).revokeAccess(employer.address);
        expect(await veriFi.accessRequests(student.address, employer.address)).to.equal(true);
    });

    it("Should allow admin to mint a certificate", async function () {
        await uploadAndVerifyDocument(student);
        const studentName = "John Doe";
        const courseName = "BSc. IT";

        await expect(veriFi.connect(admin).mintCertificate(studentName, courseName, ipfsHash))
            .to.emit(veriFi, "Certificate minted");
    });

    it("Should NOT allow non-admin to mint a certificate", async function () {
        await uploadAndVerifyDocument(student);
        const studentName = "John Doe";
        const courseName = "BSc. IT";

        await expect(veriFi.connect(admin).mintCertificate(studentName, courseName, ipfsHash))
            .to.be.revertedWith("Only admins can perform this action");

    });

    it("Should NOT allow minting a duplicate certificate", async function () {
        await uploadAndVerifyDocument(student);
        const studentName = "John Doe";
        const courseName = "BSc. IT";

        await veriFi.conect(admin).mintCertificate(studentName, courseName, ipfsHash);
        await expect(veriFi.connect(admin).mintCertificate(studentName, courseName, ipfsHash)).to.be.revertedWith(
            "Certificate already isssued"
        )
    });
});
