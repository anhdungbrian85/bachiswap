const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  let nodeManagerAddress = "0x1FA48ceD6dA4455Ad0FaB8D5514ABc939cCcDda7";

  const maxPriorityFeePerGas = ethers.parseUnits("2.5", "gwei"); // 2.5 gwei
  const maxFeePerGas = ethers.parseUnits("30", "gwei"); // 30 gwei
  console.log({ maxPriorityFeePerGas, maxFeePerGas });

  const NodeManager = await ethers.getContractAt(
    "NodeManager",
    nodeManagerAddress
  );
  const _nodeTierId = 1;
  const referralId = 0;
  const metadata = "metadata";
  const discountCouponId = 0;
  const quantity = 1;
  const taikoAmount = "0";
  tx = await NodeManager.multiBuyNode(
    _nodeTierId,
    referralId,
    metadata,
    discountCouponId,
    quantity,
    taikoAmount,
    {
      maxPriorityFeePerGas: maxPriorityFeePerGas,
      maxFeePerGas: maxFeePerGas,
    }
  );
  await tx.wait();
  console.log(`multiBuyNode transaction hash: ${tx.hash}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
