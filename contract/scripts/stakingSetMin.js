const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  let stakingAddress = "0xD3Cf2de124408bB14728e0e774F6aDB104Abd3e7";

  const maxPriorityFeePerGas = ethers.parseUnits("2.5", "gwei"); // 2.5 gwei
  const maxFeePerGas = ethers.parseUnits("30", "gwei"); // 30 gwei
  console.log({ maxPriorityFeePerGas, maxFeePerGas });

  // Interact with NodeManager contract
  const Staking = await ethers.getContractAt("Staking", stakingAddress);

  const taikoMinClaimAmount = "3000000000000000000";
  const taikoMinWithdrawAmount = "5000000000000000000";

  let tx = await Staking.setTaikoMinClaimAmount(taikoMinClaimAmount, {
    maxPriorityFeePerGas: maxPriorityFeePerGas,
    maxFeePerGas: maxFeePerGas,
  });
  await tx.wait();
  console.log(`setTaikoMinClaimAmount transaction hash: ${tx.hash}`);

  tx = await Staking.setTaikoMinWithdrawAmount(taikoMinWithdrawAmount, {
    maxPriorityFeePerGas: maxPriorityFeePerGas,
    maxFeePerGas: maxFeePerGas,
  });
  await tx.wait();
  console.log(`setTaikoMinWithdrawAmount transaction hash: ${tx.hash}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
