const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  let bachiTokenAddress = "0xd52eCc7972184Df1f5Af375060CD96E5df2B08C4";
  let bachiNodeAddress = "0x1DcEAA76aa5B60301A06939E46D5B74E9417935F";
  let nodeManagerAddress = "0x3098149EcbdDe1937c414af41008Dd5B347De8E5";
  let stakingAddress = "0xD3Cf2de124408bB14728e0e774F6aDB104Abd3e7";
  let questManagerAddress = "0xA8CB3b99F30263fd4EB2848b88B570fD4639D78d";

  const newOwner = "0xb44E803Fe8f3Fe756953c9D5688c24cA8a9a2AFd";

  const maxPriorityFeePerGas = ethers.parseUnits("2.5", "gwei"); // 2.5 gwei
  const maxFeePerGas = ethers.parseUnits("30", "gwei"); // 30 gwei
  console.log({ maxPriorityFeePerGas, maxFeePerGas });

  const NodeManager = await ethers.getContractAt(
    "NodeManager",
    nodeManagerAddress
  );

  tx = await NodeManager.transferOwnership(newOwner, {
    maxPriorityFeePerGas: maxPriorityFeePerGas,
    maxFeePerGas: maxFeePerGas,
  });
  await tx.wait();
  console.log(`transferOwnership transaction hash: ${tx.hash}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
