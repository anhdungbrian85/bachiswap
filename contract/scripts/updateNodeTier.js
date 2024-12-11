const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  let nodeManagerAddress = "0x3098149EcbdDe1937c414af41008Dd5B347De8E5";

  const maxPriorityFeePerGas = ethers.parseUnits("2.5", "gwei"); // 2.5 gwei
  const maxFeePerGas = ethers.parseUnits("30", "gwei"); // 30 gwei
  console.log({ maxPriorityFeePerGas, maxFeePerGas });

  const NodeManager = await ethers.getContractAt(
    "NodeManager",
    nodeManagerAddress
  );

  let _nodeTierId = 1;
  let status = 1;
  let name = "Core i5";
  let price = "5000000000000000000";
  let hashrate = 10;
  let farmSpeedBachi = "231481481500000";
  let farmSpeedTaiko = "347222222200";

  let tx = await NodeManager.updateNodeTier(
    _nodeTierId,
    name,
    status,
    price,
    hashrate,
    farmSpeedBachi,
    farmSpeedTaiko,
    {
      maxPriorityFeePerGas: maxPriorityFeePerGas,
      maxFeePerGas: maxFeePerGas,
    }
  );
  await tx.wait();
  console.log(`updateNodeTier transaction hash: ${tx.hash}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
