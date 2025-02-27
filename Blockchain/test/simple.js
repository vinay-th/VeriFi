const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Simple Test", function () {
    it("Should access ethers.utils", async function () {
        const hre = require("hardhat");
        expect(hre.ethers.utils).to.be.an("object");
    });
});