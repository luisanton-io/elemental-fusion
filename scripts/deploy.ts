import { ethers } from "hardhat";
import { exec } from "child_process";
import path from "path"
import hre from "hardhat";

async function main() {

  const ElementalFusion = await ethers.getContractFactory("ElementalFusion");
  const elementalFusion = await ElementalFusion.deploy();

  await elementalFusion.deployed();

  console.log(
    `Elemental Fusion contract deployed to ${elementalFusion.address}`
  );

  const clientDotEnvPath = path.join(__dirname, '..', 'client', '.env')
  const envVar = `NEXT_PUBLIC_ELEMENTAL_FUSION_CONTRACT_ADDRESS_${hre.network.name.toUpperCase()}`

  await new Promise<void>((resolve, reject) => {
    exec(`sed -i '' -e '/${envVar}/d' ${clientDotEnvPath}`,
      (err, stdout, stderr) => {
        if (err) return reject(err)
        else resolve()
      }
    )
  })

  await new Promise<void>((resolve, reject) => {
    exec(`echo ${envVar}=${elementalFusion.address} >> ${clientDotEnvPath}`,
      (err, stdout, stderr) => {
        if (err) return reject(err)
        else resolve()
      }
    )
  })

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
