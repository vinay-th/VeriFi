require('dotenv').config();
const { ethers } = require("ethers");

async function main() {
  const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545"); // Localhost URL
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);  // Your wallet
  const employerWallet = new ethers.Wallet(process.env.EMPLOYER_PRIVATE_KEY, provider); // Employer wallet

  const VeriFi = await ethers.getContractFactory("VeriFi");
  const veriFi = new VeriFi.attach(process.env.CONTRACT_ADDRESS).connect(wallet); // Connect to the deployed contract

    // --- Helper function to get document hash ---
    const getDocumentHash = (ipfsHash) => ethers.keccak256(ethers.encodePacked(ipfsHash));

    // --- Example 1: Student uploads a document ---
    const ipfsHash1 = "QmWATm7ABjTjT9n9c59BrWn4i9v79eo3uQe72wFj9V5y9A"; // Dummy IPFS hash - replace with a real one for testing
    const tx1 = await veriFi.uploadDocument(ipfsHash1);
    await tx1.wait();
    const documentHash1 = getDocumentHash(ipfsHash1);
    console.log("Document uploaded:", tx1.hash);

    // --- Example 2: Employer requests access ---
    const accessType = "read";
    const accessDuration = 3600; // 1 hour (in seconds)
    const tx2 = await veriFi.connect(employerWallet).requestAccess(documentHash1, accessType, accessDuration);
    await tx2.wait();
    console.log("Access requested:", tx2.hash);

    // --- Example 3: Student grants access ---
    const tx3 = await veriFi.grantAccess(documentHash1);
    await tx3.wait();
    console.log("Access granted:", tx3.hash);

    // --- Example 4: Get document details ---
    const document1 = await veriFi.documents(documentHash1);
    console.log("Document 1 details:", document1);

    // --- Example 5: Upload another document ---
    const ipfsHash2 = "QmSomeOtherHash..."; // Another dummy IPFS hash
    const tx4 = await veriFi.uploadDocument(ipfsHash2);
    await tx4.wait();
    const documentHash2 = getDocumentHash(ipfsHash2);
    console.log("Another document uploaded:", tx4.hash);


    // --- Example 6: Employer requests access to the second document ---
    const tx5 = await veriFi.connect(employerWallet).requestAccess(documentHash2, accessType, accessDuration);
    await tx5.wait();
    console.log("Access requested to document 2:", tx5.hash);

    // --- Example 7: Student grants access to the second document ---
    const tx6 = await veriFi.grantAccess(documentHash2);
    await tx6.wait();
    console.log("Access granted to document 2:", tx6.hash);

    const document2 = await veriFi.documents(documentHash2);
    console.log("Document 2 details:", document2);

    // --- Example 8: Revoke Access (Example - Add to your contract if needed) ---
    // If you have a `revokeAccess` function in your contract:
    // const tx7 = await veriFi.revokeAccess(documentHash1, employerWallet.address); // Example
    // await tx7.wait();
    // console.log("Access revoked:", tx7.hash);

    // --- Example 9: Check Access (Example - Add to your contract if needed) ---
    // If you have a `checkAccess` function in your contract:
    // const hasAccess = await veriFi.checkAccess(documentHash1, employerWallet.address); // Example
    // console.log("Has access:", hasAccess);

    // ... Add more examples for other functions (if you have them in your contract)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });