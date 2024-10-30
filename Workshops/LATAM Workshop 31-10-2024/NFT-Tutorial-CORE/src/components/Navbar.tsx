// src/components/Navbar.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 2rem;
  background: black;
  border-radius: 10px;
  margin: 1rem;
  border: solid 0.1px white;
`;

const NavBrand = styled.div`
  display: flex;
  align-items: center;

  img {
    height: 50px;
    margin-right: 10px;
  }

  span {
    font-size: 1.5rem;
    font-weight: bold;
    color: #ffffff;
  }
`;

const NavLinks = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;

  & > li {
    margin-right: 1.5rem;

    &:last-child {
      margin-right: 0;
    }
  }

  & > li > a {
    color: white;
    text-decoration: none;
    font-size: 1rem;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ConnectButton = styled.button`
  background-color: rgba(255, 255, 255, 0.3);
  border: none;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  color: white;
  cursor: pointer;
  border-radius: 20px;

  &:hover {
    background-color: rgba(255, 255, 255, 0.5);
  }
`;

const Navbar = () => {
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);

  const checkWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log('Make sure you have Metamask installed!');
      return;
    } else {
      console.log("Wallet exists! We're ready to go!");
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log('Found an authorized account: ', account);
      setCurrentAccount(account);
    } else {
      console.log('No authorized account found');
    }
  };

  const connectWalletHandler = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert('Please install Metamask!');
      return;
    }

    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      console.log('Found an account! Address: ', accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    checkWalletIsConnected();
  }, []);

  const connectWalletButton = () => {
    return (
      <ConnectButton onClick={connectWalletHandler}>
        Connect Wallet
      </ConnectButton>
    );
  };

  return (
    <NavbarContainer>
      <NavBrand>

      </NavBrand>
      <NavLinks>
        <li><Link to="/">Mint NFT</Link></li>
        <li><Link to="/get">GET NFT´s</Link></li>
      </NavLinks>
      {currentAccount ? (
        <span
          style={{ color: "white"}}
        >
          {`${currentAccount.substring(0, 6)}...${currentAccount.slice(-4)}`}
        </span>) : (
        connectWalletButton()
      )}
    </NavbarContainer>
  );
};

export default Navbar;
