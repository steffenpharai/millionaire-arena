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

        // Deploy pot first (token needs pot address). Use deployer as placeholder for pot/lp.
        ArenaPot pot = new ArenaPot(address(0));
        console.log("ArenaPot deployed at:", address(pot));

        MillionToken token = new MillionToken(address(pot), deployer, deployer);
        console.log("MillionToken deployed at:", address(token));

        pot = new ArenaPot(address(token));
        console.log("ArenaPot (final) deployed at:", address(pot));

        token.setPotAddress(address(pot));
        vm.stopBroadcast();
    }
}
