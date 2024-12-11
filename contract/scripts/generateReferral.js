const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  let nodeManagerAddress = "0xb433fF50590299D4ac45D7B6D394f52cc9cD569B";

  const maxPriorityFeePerGas = ethers.parseUnits("2.5", "gwei"); // 2.5 gwei
  const maxFeePerGas = ethers.parseUnits("30", "gwei"); // 30 gwei
  console.log({ maxPriorityFeePerGas, maxFeePerGas });

  // Interact with NodeManager contract
  const NodeManager = await ethers.getContractAt(
    "NodeManager",
    nodeManagerAddress
  );
  tx = await NodeManager.generateReferralCodeIfNeeded({
    maxPriorityFeePerGas: maxPriorityFeePerGas,
    maxFeePerGas: maxFeePerGas,
  });
  await tx.wait();
  console.log(`generateReferralCodeIfNeeded transaction hash: ${tx.hash}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
