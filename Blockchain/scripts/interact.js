require('dotenv').config();
const { ethers } = require("ethers");

async function main() {
    const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
    const [student, employer, admin, deployer] = await ethers.getSigners(); // Get Hardhat test accounts

    const VeriFi = await ethers.getContractFactory("VeriFi");
    const veriFi = new VeriFi.attach(process.env.CONTRACT_ADDRESS).connect(deployer); // Connect with deployer's wallet

    // ... (rest of your interaction logic using student, employer, admin signers)

    const ipfsHash1 = "QmWATm7ABjTjT9n9c59BrWn4i9v79eo3uQe72wFj9V5y9A";
    const tx1 = await veriFi.connect(student).uploadDocument(ipfsHash1); // Student uploads
    await tx1.wait();
    const documentHash1 = ethers.keccak256(ethers.encodePacked(ipfsHash1));

    const accessType = "read";
    const accessDuration = 3600;
    const tx2 = await veriFi.connect(employer).requestAccess(documentHash1, accessType, accessDuration); // Employer requests
    await tx2.wait();

    const tx3 = await veriFi.connect(admin).grantAccess(documentHash1); // Admin grants (if admin is authorized)
    await tx3.wait();


    // ... more interaction examples

}

// ... (rest of the code)