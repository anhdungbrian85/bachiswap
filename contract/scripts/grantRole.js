const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  let bachiTokenAddress = "0xd52eCc7972184Df1f5Af375060CD96E5df2B08C4";
  let nodeManagerAddress = "0x3098149EcbdDe1937c414af41008Dd5B347De8E5";
  let stakingAddress = "0xD3Cf2de124408bB14728e0e774F6aDB104Abd3e7";
  let questManagerAddress = "0xA8CB3b99F30263fd4EB2848b88B570fD4639D78d";

  const MINTER_ROLE =
    "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6";
  const ADMIN_ROLE =
    "0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775";

  const maxPriorityFeePerGas = ethers.parseUnits("2.5", "gwei"); // 2.5 gwei
  const maxFeePerGas = ethers.parseUnits("30", "gwei"); // 30 gwei
  console.log({ maxPriorityFeePerGas, maxFeePerGas });

  // grant role staking for bachi node
  let tx;
  const BachiToken = await ethers.getContractAt(
    "BachiToken",
    bachiTokenAddress
  );

  tx = await BachiToken.grantRole(MINTER_ROLE, stakingAddress, {
    maxPriorityFeePerGas: maxPriorityFeePerGas,
    maxFeePerGas: maxFeePerGas,
  });
  await tx.wait();
  console.log(`grantRole transaction hash: ${tx.hash}`);

  // Interact with questManager contract
  const Staking = await ethers.getContractAt("Staking", stakingAddress);
  tx = await Staking.grantRole(ADMIN_ROLE, questManagerAddress, {
    maxPriorityFeePerGas: maxPriorityFeePerGas,
    maxFeePerGas: maxFeePerGas,
  });
  await tx.wait();
  console.log(`grantRole transaction hash: ${tx.hash}`);

  // Interact with nodeManager contract
  tx = await Staking.grantRole(ADMIN_ROLE, nodeManagerAddress, {
    maxPriorityFeePerGas: maxPriorityFeePerGas,
    maxFeePerGas: maxFeePerGas,
  });
  await tx.wait();
  console.log(`grantRole transaction hash: ${tx.hash}`);

  // Interact with nodeManager contract
  const NodeManager = await ethers.getContractAt(
    "NodeManager",
    nodeManagerAddress
  );
  tx = await NodeManager.grantRole(ADMIN_ROLE, questManagerAddress, {
    maxPriorityFeePerGas: maxPriorityFeePerGas,
    maxFeePerGas: maxFeePerGas,
  });
  await tx.wait();
  console.log(`grantRole transaction hash: ${tx.hash}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
