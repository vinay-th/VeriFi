// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleContract {
    uint256 public value;

    constructor(uint256 _initialValue) {
        value = _initialValue;
    }

    function setValue(uint256 _newValue) public {
        value = _newValue;
    }

    function getValue() public view returns (uint256) {
        return value;
    }
}