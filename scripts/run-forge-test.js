#!/usr/bin/env node
/**
 * Run contract tests with Forge. On Windows, invokes WSL (forge must be in WSL PATH).
 * From repo root: node scripts/run-forge-test.js
 */
const { execSync } = require("child_process");
const path = require("path");

const contractsDir = path.resolve(__dirname, "..", "contracts");
const isWindows = process.platform === "win32";

if (isWindows) {
  // Convert Windows path to WSL path: C:\Base\Agent\contracts -> /mnt/c/Base/Agent/contracts
  const wslPath = contractsDir
    .replace(/\\/g, "/")
    .replace(/^([a-zA-Z]):/, (_, d) => `/mnt/${d.toLowerCase()}`);
  // Forge is typically in WSL at ~/.foundry/bin; ensure it is on PATH
  const wslCmd = `export PATH="$HOME/.foundry/bin:$PATH" 2>/dev/null; cd '${wslPath}' && forge test`;
  execSync(`wsl -e bash -c ${JSON.stringify(wslCmd)}`, {
    stdio: "inherit",
    shell: true,
  });
} else {
  execSync("forge test", {
    stdio: "inherit",
    cwd: contractsDir,
    shell: true,
  });
}
