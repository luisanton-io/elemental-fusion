import Dialog from "@/components/Dialog";
import Header from "@/components/Header";
import Main from "@/components/Main";
import DialogCtx from "@/context/DialogCtx";
import ElementalCtx, { ElementalContext } from "@/context/ElementalCtx";
import Contracts from "@/contracts";
import { useWeb3Modal } from "@web3modal/react";
import { ethers } from "ethers";
import { useEffect, useRef, useState } from "react";
import { useSigner } from "wagmi";
import { mainnet, localhost, polygonMumbai } from "wagmi/chains";

const chains = {
  LOCALHOST: localhost,
  MUMBAI: polygonMumbai,
  MAINNET: mainnet
}

const defaultChain = chains[process.env.NEXT_PUBLIC_CHAIN as keyof typeof chains] || polygonMumbai

export default function Home() {
  const { setDefaultChain } = useWeb3Modal();

  useEffect(() => {
    setDefaultChain(defaultChain);
  }, [])

  const [dialogChildren, setDialogChildren] = useState<React.ReactNode>(null);

  const [elementalsData, setElementalsData] = useState<ElementalContext["elementalsData"]>([])
  const { data: signer } = useSigner()

  const loadData =
    async (signer: ethers.Signer) =>
      setElementalsData(
        await Contracts.ElementalFusion(signer).viewElementalsData()
      )

  useEffect(() => {
    signer && loadData(signer)
  }, [signer])


  return (
    <DialogCtx.Provider value={{
      dialogRef: useRef<HTMLDialogElement | null>(null),
      dialogChildren,
      setDialogChildren
    }}>
      <ElementalCtx.Provider value={{ elementalsData, loadData }}>
        <div className='flex flex-col pt-5 h-32 mx-auto text-center'>
          <Header />
          {signer && <Main />}
          <Dialog />
        </div>
      </ElementalCtx.Provider>
    </DialogCtx.Provider>
  )
}
