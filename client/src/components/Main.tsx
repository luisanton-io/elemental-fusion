// import { elementals } from "../data/elementals";
import ElementalCtx from "@/context/ElementalCtx";
import { useContext } from "react";
import Elemental from "./Elemental";
import styles from "./styles.module.scss";

export default function Main() {

    const { elementalsData } = useContext(ElementalCtx)

    return <div id={styles.main} className="grid grid-cols-3 gap-12 w-[60vw] mx-auto mt-5 ">
        {
            elementalsData.map(({ elemental: info }, i) => (
                <Elemental key={`elemental-${i}`} info={info} />
            ))
        }
    </div>
}   