import { useContext } from "react";
import DialogCtx from "../../context/DialogCtx";
import styles from "./styles.module.scss"

export default function Dialog() {

    const { dialogRef, dialogChildren, setDialogChildren } = useContext(DialogCtx);

    const handleCloseClick = () => {
        dialogRef?.current?.close()
        setDialogChildren(null)
    }

    return <dialog id={styles.dialog} ref={dialogRef} className="h-[75vh] w-[70vw] rounded-none p-0">
        <button className="absolute z-10 top-0 right-0 bg-black bg-opacity-50 hover:bg-orange-800 text-3xl text-white font-mono rounded-none h-12 w-12 ml-auto" onClick={handleCloseClick}>
            ×
        </button>
        {dialogChildren}
    </dialog>
}
