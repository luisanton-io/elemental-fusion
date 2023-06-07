
import ElementalCtx from "@/context/ElementalCtx";
import Contracts from "@/contracts";
import { useState, useEffect, MouseEventHandler, useContext } from "react";
import { useSigner } from "wagmi";
import Spinner from "../Spinner";

interface Props {
    cooldownTimer: number,
    id: number
}

export default function ForgeBtn({ cooldownTimer, id }: Props) {

    const { data: signer } = useSigner()
    const { loadData } = useContext(ElementalCtx)

    const [loadingMessage, setLoadingMessage] = useState<string>('')

    const handleForge = async () => {
        if (!signer) return

        const ElementalFusion = Contracts.ElementalFusion(signer)

        setLoadingMessage("Forging new token")
        try {
            const tx = await ElementalFusion.forge(id, { gasLimit: 100000 })
            setLoadingMessage("Waiting for block confirmation...")
            await tx.wait()

            setLoadingMessage("Waiting for new on-chain data...")
            await loadData(signer)

        } catch (error) {
            console.log(error)
        } finally {
            setLoadingMessage('')
        }

    }

    const [seconds, setSeconds] = useState(0)

    useEffect(() => {
        setSeconds(cooldownTimer == 0 ? cooldownTimer : cooldownTimer - Math.floor(Date.now() / 1000))

        if (cooldownTimer == 0) return

        const interval = setInterval(() => {
            setSeconds(seconds => --seconds)
        }, 1000)

        return () => {
            clearInterval(interval)
        }
    }, [cooldownTimer])

    return (
        loadingMessage
            ? <Spinner loadingMessage={loadingMessage} />
            : (
                <button
                    onClick={handleForge}
                    className="font-pirata transition-all tracking-widest text-2xl text-white rounded-none bg-orange-600 hover:bg-orange-500 disabled:bg-slate-600 disabled:opacity-50 px-5 py-3"
                    disabled={seconds > 0}
                >
                    Forge {
                        seconds > 0 && <span className="text-white text-3xl">[-{seconds}]</span>
                    }
                </button>
            )
    )
}