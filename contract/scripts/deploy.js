const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);
  let initialBalance = await deployer.provider.getBalance(deployer.address);
  console.log("Initial ETH balance:", Number(initialBalance), "ETH");

  let bachiTokenAddress = "0xd52eCc7972184Df1f5Af375060CD96E5df2B08C4";
  let bachiNodeAddress = "0x1DcEAA76aa5B60301A06939E46D5B74E9417935F";
  let nodeManagerAddress = "0x3098149EcbdDe1937c414af41008Dd5B347De8E5";
  let stakingAddress = "0xD3Cf2de124408bB14728e0e774F6aDB104Abd3e7";
  let questManagerAddress = "0x30a794d3d9df30DFE63DA1847cfC1ed965d1670e";
  let taikoTokenAddress = process.env.TAIKO_TOKEN_ADDRESS;

  console.log({ taikoTokenAddress });

  // Deploy BachiToken contract
  let tokenName = "BACHI";
  let tokenSymbol = "BACHI";
  const BachiToken = await ethers.getContractFactory("BachiToken");
  const bachiToken = await BachiToken.deploy(tokenName, tokenSymbol);
  await bachiToken.waitForDeployment();
  const bachiTokenTx = await bachiToken.deploymentTransaction();
  bachiTokenAddress = bachiToken.target;
  console.log("BachiToken deployed successfully.");
  console.log(`Deployed to: ${bachiTokenAddress}`);
  console.log(`Transaction hash: ${bachiTokenTx.hash}`);

  // Deploy BachiNode contract
  tokenName = "BACHI NODE";
  tokenSymbol = "BACHINODE";
  const BachiNode = await ethers.getContractFactory("BachiNode");
  const bachiNode = await BachiNode.deploy(
    tokenName,
    tokenSymbol,
    nodeManagerAddress
  );
  await bachiNode.waitForDeployment();
  const bachiNodeTx = await bachiNode.deploymentTransaction();
  bachiNodeAddress = bachiNode.target;
  console.log("BachiNode deployed successfully.");
  console.log(`Deployed to: ${bachiNodeAddress}`);
  console.log(`Transaction hash: ${bachiNodeTx.hash}`);

  // Deploy NodeManager contract
  const NodeManager = await ethers.getContractFactory("NodeManager");
  const nodeManager = await NodeManager.deploy(
    bachiNodeAddress,
    bachiTokenAddress,
    stakingAddress,
    taikoTokenAddress
  );
  await nodeManager.waitForDeployment();
  const nodeManagerTx = await nodeManager.deploymentTransaction();
  nodeManagerAddress = nodeManager.target;
  console.log("NodeManager deployed successfully.");
  console.log(`Deployed to: ${nodeManagerAddress}`);
  console.log(`Transaction hash: ${nodeManagerTx.hash}`);

  // Deploy Staking contract
  const Staking = await ethers.getContractFactory("Staking");
  const staking = await Staking.deploy(
    bachiNodeAddress,
    bachiTokenAddress,
    nodeManagerAddress,
    taikoTokenAddress
  );
  await staking.waitForDeployment();
  const stakingTx = await staking.deploymentTransaction();
  stakingAddress = staking.target;
  console.log("Staking deployed successfully.");
  console.log(`Deployed to: ${stakingAddress}`);
  console.log(`Transaction hash: ${stakingTx.hash}`);

  // Deploy Quest manager contract
  const QuestManager = await ethers.getContractFactory("QuestManager");
  const questManager = await QuestManager.deploy(stakingAddress, nodeManagerAddress);
  await questManager.waitForDeployment();
  const questManagerTx = await questManager.deploymentTransaction();
  questManagerAddress = questManager.target;
  console.log("QuestManager deployed successfully.");
  console.log(`Deployed to: ${stakingAddress}`);
  console.log(`Transaction hash: ${questManagerTx.hash}`);

  /********************** CONTRACT ADDRESS **************************/

  let currentBalance = await deployer.provider.getBalance(deployer.address);
  console.log("Current ETH balance:", Number(currentBalance), "ETH");

  console.log({
    fee: (Number(initialBalance) - Number(currentBalance)) / 10 ** 18,
  });

  console.log({
    bachiTokenAddress,
    bachiNodeAddress,
    nodeManagerAddress,
    stakingAddress,
    questManagerAddress,
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
