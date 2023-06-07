import { ElementalResponseStructOutput } from "@/contracts/ElementalFusion.sol/ElementalFusion";
import { ethers } from "ethers";
import { createContext } from "react"


export interface ElementalContext {
    elementalsData: ElementalResponseStructOutput[],
    loadData: (signer: ethers.Signer) => Promise<void>
}

const ElementalCtx = createContext<ElementalContext>({
    elementalsData: [],
    loadData: async () => { }
})

export default ElementalCtx;