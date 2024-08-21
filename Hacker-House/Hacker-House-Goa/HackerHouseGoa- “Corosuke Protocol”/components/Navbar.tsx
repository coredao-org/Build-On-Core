import styles from "../src/styles/Home.module.css";
import { Link } from 'react-router-dom';
import { ConnectButton } from "thirdweb/react";
import { client  } from '../src/client';
import { defineChain } from "thirdweb";
import React from "react";

const Navbar = () => {
    const myChain = defineChain({
        id: 1115,
        rpc: "https://rpc.test.btcs.network",
    })
    return (
        <div className={styles.navbar}>
            <div className={styles.navbarLogo}>
                <h1 className="text-2xl font-bold">Corosuke Demo</h1>
            </div>
            <div className={styles.navbarLinks}>
                <Link to={"/"}>
                    <p>KYC</p>
                </Link>
                <Link to={"/payments"}>
                    <p>Try Payments</p>
                </Link>
                <Link to={"/key"}>
                    <p>API Keys</p>
                </Link>
                <a href="https://gkhxhkdmreh.typeform.com/to/bpazfezw" target='_blank'>
                    <p>Pre Register</p>
                </a>
            </div>
            <ConnectButton
                client={client}
                chain={myChain}
            />
        </div>
    )
};

export default Navbar