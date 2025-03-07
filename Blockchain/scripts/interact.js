const hre = require("hardhat");

async function main() {
    const [admin] = await hre.ethers.getSigners(); // Getting the admin account from the local node

    const contractAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"; 
    const Contract = await hre.ethers.getContractFactory("VeriFi");
    const contract = await Contract.attach(contractAddress).connect(admin);

    // Example: Add a new admin (use a local account)
    const newAdmin = "0xFABB0ac9d68B0B445fB7357272Ff202C5651694a"; 
    console.log(`Adding admin at ${newAdmin}...`);
    const tx = await contract.addAdmin(newAdmin);
    await tx.wait();
    console.log(`Admin added successfully!`);

    // Example: Upload a document
    const documentId = 1;
    const title = "Document 1";
    const description = "Document description.";
    const documentType = "PDF";
    console.log(`Uploading document with ID: ${documentId}...`);
    const uploadTx = await contract.uploadDocument(documentId, title, description, documentType);
    await uploadTx.wait();
    console.log(`Document uploaded successfully!`);

    // Example: Retrieve a document
    const [docTitle, docDescription, docType, docUploader] = await contract.retrieveDocument(documentId);
    console.log(`Document Title: ${docTitle}`);
    console.log(`Document Description: ${docDescription}`);
    console.log(`Document Type: ${docType}`);
    console.log(`Uploader: ${docUploader}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
