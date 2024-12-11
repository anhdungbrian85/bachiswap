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
  const listTier = [
    {
      status: 1,
      name: "Core i5",
      price: "5000000000000000000",
      hashrate: 10,
      farmSpeedBachi: "231481481500000",
      farmSpeedTaiko: "347222222200",
    },
    {
      status: 1,
      name: "Core i7",
      price: "58000000000000000000",
      hashrate: 100,
      farmSpeedBachi: "2314814815000000",
      farmSpeedTaiko: "3472222222000",
    },
    {
      status: 1,
      name: "Core i9",
      price: "580000000000000000000",
      hashrate: 1000,
      farmSpeedBachi: "23148148150000000",
      farmSpeedTaiko: "34722222220000",
    },
  ];
  // 3 node: Tier 1, Tier 2, Tier 3

  for(const tier of listTier){
    tx = await NodeManager.addNodeTier(
      tier.status,
      tier.name,
      tier.price,
      tier.hashrate,
      tier.farmSpeedBachi,
      tier.farmSpeedTaiko,
      {
        maxPriorityFeePerGas: maxPriorityFeePerGas,
        maxFeePerGas: maxFeePerGas,
      }
    );
    await tx.wait();
    console.log(`addNodeTier transaction hash: ${tx.hash}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
