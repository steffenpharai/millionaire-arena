// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { Script, console } from "forge-std/Script.sol";
import { MillionToken } from "../src/MillionToken.sol";
import { ArenaPot } from "../src/ArenaPot.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        vm.startBroadcast(deployerPrivateKey);

        // MillionToken constructor needs pot and lp addresses. Use deployer as temporary placeholder.
        MillionToken token = new MillionToken(deployer, deployer, deployer);
        console.log("MillionToken deployed at:", address(token));

        ArenaPot pot = new ArenaPot(address(token));
        console.log("ArenaPot deployed at:", address(pot));

        token.setPotAddress(address(pot));
        // Optionally set LP: token.setLPAddress(lpAddress);
        vm.stopBroadcast();
    }
}
