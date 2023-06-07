import { createContext } from "react";

interface DialogContext {
    dialogRef: React.MutableRefObject<HTMLDialogElement | null>;
    // dialogRef: HTMLDialogElement | null;
    // setDialogRef: (dialogRef: HTMLDialogElement | null) => void;
    dialogChildren: React.ReactNode;
    setDialogChildren: (children: React.ReactNode) => void;
}

const DialogCtx = createContext<DialogContext>({
    dialogRef: { current: null },
    // setDialogRef: () => { },
    dialogChildren: null,
    setDialogChildren: () => { }
})

export default DialogCtx;