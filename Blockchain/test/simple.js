const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Simple Test", function () {
  it("Should deploy and test a contract", async function () {
    const [owner] = await ethers.getSigners();

    const SimpleContract = await ethers.getContractFactory("SimpleContract");
    const simple = await SimpleContract.deploy(100); // Pass an initial value
    await simple.waitForDeployment();

    console.log("Contract deployed to:", await simple.getAddress());

    expect(await simple.getValue()).to.equal(100); // Verify initial value
  });
});