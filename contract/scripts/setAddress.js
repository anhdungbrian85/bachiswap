const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  let bachiNodeAddress = "0x1DcEAA76aa5B60301A06939E46D5B74E9417935F";
  let nodeManagerAddress = "0x3098149EcbdDe1937c414af41008Dd5B347De8E5";
  let stakingAddress = "0xD3Cf2de124408bB14728e0e774F6aDB104Abd3e7";

  const maxPriorityFeePerGas = ethers.parseUnits("2.5", "gwei"); // 2.5 gwei
  const maxFeePerGas = ethers.parseUnits("30", "gwei"); // 30 gwei
  console.log({ maxPriorityFeePerGas, maxFeePerGas });

  // set address for bachi node
  let tx;
  const BachiNode = await ethers.getContractAt("BachiNode", bachiNodeAddress);

  tx = await BachiNode.setNodeManagerAddress(nodeManagerAddress, {
    maxPriorityFeePerGas: maxPriorityFeePerGas,
    maxFeePerGas: maxFeePerGas,
  });
  await tx.wait();
  console.log(`setNodeManagerAddress transaction hash: ${tx.hash}`);

  // Interact with NodeManager contract
  const NodeManager = await ethers.getContractAt(
    "NodeManager",
    nodeManagerAddress
  );
  tx = await NodeManager.setStakingContractAddress(stakingAddress, {
    maxPriorityFeePerGas: maxPriorityFeePerGas,
    maxFeePerGas: maxFeePerGas,
  });
  await tx.wait();
  console.log(`setStakingContractAddress transaction hash: ${tx.hash}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
