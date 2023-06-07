import { ethers } from "ethers";
import ElementalFusionJson from "@/contracts/ElementalFusion.sol/ElementalFusion.json"
import { ElementalFusion } from "@/contracts/ElementalFusion.sol/ElementalFusion"

const elementalFusionAddress = {
    MUMBAI: process.env.NEXT_PUBLIC_ELEMENTAL_FUSION_CONTRACT_ADDRESS_MUMBAI!,
    LOCALHOST: process.env.NEXT_PUBLIC_ELEMENTAL_FUSION_CONTRACT_ADDRESS_LOCALHOST!,
}
const stage = process.env.NEXT_PUBLIC_CHAIN as keyof typeof elementalFusionAddress || "MUMBAI"

// console.log(address[stage])

const Contracts = {
    ElementalFusion:
        (signer: ethers.Signer | ethers.providers.Provider) =>
            new ethers.Contract(
                elementalFusionAddress[stage],
                ElementalFusionJson.abi,
                signer
            ).connect(signer) as ElementalFusion
}

export default Contracts;