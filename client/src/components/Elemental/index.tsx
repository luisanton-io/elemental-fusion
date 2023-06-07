import { useContext, useState } from "react";
import thumbnails from "../../assets/thumbnails";
import frame from "../../assets/thumbnails/frame.png";
import DialogCtx from "../../context/DialogCtx";
import styles from "./styles.module.scss";
import floatingBall from "../../assets/floatingBall.png"
import Image from "next/image"
import { ElementalStructOutput } from "@/contracts/ElementalFusion.sol/ElementalFusion";
import ElementalCtx from "@/context/ElementalCtx";
import { useSigner } from "wagmi";
import Contracts from "@/contracts";
import ForgeBtn from "./ForgeBtn";
interface Props {
    info: ElementalStructOutput;
}

function ElementalDialogContent({ id }: { id: number }) {

    const { elementalsData } = useContext(ElementalCtx)
    const { elemental: { name, tributes, cooldown }, balance, cooldownTimer } = elementalsData[id]

    return (
        <div className="flex grow h-[100%] overflow-hidden">
            <div className="w-[50%]" draggable="false">
                <Image alt="..." src={thumbnails[id]} className="tilt-in-bottom-1 w-[100%] h-[100%] object-cover rounded-none" />
            </div>

            <div className="grow flex flex-col px-5 py-14 ">
                <h1 className="text-5xl text-center my-2">{name}</h1>


                <div className="flex my-auto items-center">
                    <p className="font-pirata opacity-80 text-white text-3xl ml-auto mr-4">In your wallet:</p>
                    <div draggable={false} className={styles.crystalBall + " relative flex mr-auto"}>
                        <Image alt="..." src={floatingBall} className="w-24" />
                        <span className={"absolute inset-0 top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] text-5xl text-white font-pirata"}>
                            {balance.toNumber()}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col items-center border p-12">
                    {
                        !!tributes.length && (
                            <div className={styles.tributes}>
                                {
                                    tributes.map(tribute => (
                                        <div key={`tribute-${tribute}`}>
                                            <Image alt="..."
                                                src={thumbnails[tribute]}
                                                className="w-24 rounded-full"
                                            />
                                        </div>
                                    ))
                                }
                            </div>
                        )
                    }

                    <ForgeBtn cooldownTimer={cooldownTimer.toNumber()} id={id} />

                </div>
            </div>
        </div>
    )
}

export default function Elemental({ info: elemental }: Props) {

    const { dialogRef, setDialogChildren } = useContext(DialogCtx);
    const handleModal = () => {
        dialogRef.current?.showModal();
        setDialogChildren(<ElementalDialogContent id={elemental.id.toNumber()} />)
    }

    return <div className={styles.frameWrapper}>

        <div className={styles.frame} onClick={handleModal} draggable="false">
            <Image alt="..." src={frame} className="w-48" draggable="false" />
            <Image alt="..." src={thumbnails[elemental.id.toNumber()]} className="w-48" draggable="false" />
        </div>

        <h1>{elemental.name}</h1>
        {/* <p>{elemental.tributes}</p>
        <p>{elemental.cooldown}</p> */}
    </div>
}