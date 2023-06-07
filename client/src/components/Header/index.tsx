import { Web3Button } from "@web3modal/react";
import styles from "./styles.module.scss";

export default function Header() {
    return <div>
        <h1 className={styles.title}>Elemental Fusion</h1>
        <Web3Button />
    </div>
}