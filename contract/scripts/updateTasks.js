const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  let questManagerAddress = "0xA8CB3b99F30263fd4EB2848b88B570fD4639D78d";

  const maxPriorityFeePerGas = ethers.parseUnits("2.5", "gwei"); // 2.5 gwei
  const maxFeePerGas = ethers.parseUnits("30", "gwei"); // 30 gwei
  console.log({ maxPriorityFeePerGas, maxFeePerGas });

  // Interact with NodeManager contract
  const QuestManager = await ethers.getContractAt(
    "QuestManager",
    questManagerAddress
  );
  const _taskId = 1;
  const code = `T1`;
  const point = "100000000000000000";
  const rewardType = 1;
  tx = await QuestManager.updateTask(_taskId, code, point, rewardType, {
    maxPriorityFeePerGas: maxPriorityFeePerGas,
    maxFeePerGas: maxFeePerGas,
  });
  await tx.wait();
  console.log(`updateTask ${_taskId} transaction hash: ${tx.hash}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
