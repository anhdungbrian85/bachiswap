const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  let nodeManagerAddress = "0xb9469A5C24860bcE855C9D7337AfA211a1647Fb7";

  const maxPriorityFeePerGas = ethers.parseUnits("2.5", "gwei"); // 2.5 gwei
  const maxFeePerGas = ethers.parseUnits("30", "gwei"); // 30 gwei
  console.log({ maxPriorityFeePerGas, maxFeePerGas });

  const NodeManager = await ethers.getContractAt(
    "NodeManager",
    nodeManagerAddress
  );
  const to = "0x8c4B221d2dCB5d666411F94D7e6c43a565caDc4C";
  const value = "10000000000000000000";
  tx = await NodeManager.withdraw(
    to,
    value,
    {
      maxPriorityFeePerGas: maxPriorityFeePerGas,
      maxFeePerGas: maxFeePerGas,
    }
  );
  await tx.wait();
  console.log(`withdraw transaction hash: ${tx.hash}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
