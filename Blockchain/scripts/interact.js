import dotenv from "dotenv";
import { ethers } from "hardhat"; // Use Hardhat's ethers instead of ethers.js

dotenv.config();

async function main() {
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545"); // Localhost URL
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);  // Your wallet
  const employerWallet = new ethers.Wallet(process.env.EMPLOYER_PRIVATE_KEY, provider); // Employer wallet

  const VeriFi = await ethers.getContractFactory("VeriFi"); // Correcting ethers usage
  const veriFi = VeriFi.attach(process.env.CONTRACT_ADDRESS).connect(wallet); // Connect to the deployed contract

  // --- Helper function to get document hash ---
  const getDocumentHash = (ipfsHash) => ethers.keccak256(ethers.toUtf8Bytes(ipfsHash));

  // --- Example 1: Student uploads a document ---
  const ipfsHash1 = "QmWATm7ABjTjT9n9c59BrWn4i9v79eo3uQe72wFj9V5y9A"; // Dummy IPFS hash
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
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
