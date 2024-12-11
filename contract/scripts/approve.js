const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  let taikoTokenAddress = process.env.TAIKO_TOKEN_ADDRESS;

  let caller = "0x16283E3bD24d16B2b4A2aba72b97a1E15df7cf92";
  let contractAddress = "0x3098149EcbdDe1937c414af41008Dd5B347De8E5";

  const maxPriorityFeePerGas = ethers.parseUnits("2.5", "gwei"); // 2.5 gwei
  const maxFeePerGas = ethers.parseUnits("30", "gwei"); // 30 gwei
  console.log({ maxPriorityFeePerGas, maxFeePerGas });

  // Approve Taiko Token
  const TaikoToken = await ethers.getContractAt("IERC20", taikoTokenAddress);

  // allowance
  const allowance = await TaikoToken.allowance(caller, contractAddress);
  console.log({ allowance });

  // const amountToApprove = 10000000000000000000n;
  // const spenderAddress = "0x9e6fFe6af8A2C8a049CC5dfC7A67CAec141c3b66";

  // console.log(
  //   `Approving ${spenderAddress} to spend ${amountToApprove.toString()} Taiko tokens`
  // );
  // const tx = await TaikoToken.approve(spenderAddress, amountToApprove);
  // await tx.wait();
  // console.log(`Approval transaction hash: ${tx.hash}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
