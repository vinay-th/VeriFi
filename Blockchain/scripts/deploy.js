const { ethers } = require("hardhat");

async function main() {
    const VeriFi = await ethers.getContractFactory("VeriFi");
    const veriFi = await VeriFi.deploy();
    await veriFi.waitForDeployment();

    console.log("VeriFi deployed to:", await veriFi.getAddress());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
