const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Simple Test", function () {
    it("Should access ethers.utils", function () {
        expect(ethers.utils).to.be.an("object");
    });
});