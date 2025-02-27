const { expect } = require("chai");
const ethers = require("ethers");

describe("Simple Test", function () {
    it("Should access ethers.utils", async function () {
        console.log("Ethers object:", ethers); // Debugging
        console.log("Ethers utils: ", ethers.utils);
        expect(ethers.utils).to.be.an("object");
    });
});
