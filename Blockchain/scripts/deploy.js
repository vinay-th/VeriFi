const hre = require("hardhat");

async function main() {
    const ContractFactory = await hre.ethers.getContractFactory("VeriFi");
    const contract = await ContractFactory.deploy(); // Deploy contract
    await contract.waitForDeployment(); // Wait for deployment to complete

    console.log(`Contract deployed at: ${contract.target}`); // Correct way to get address
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Contract deployment failed:", error);
        process.exit(1);
    });
