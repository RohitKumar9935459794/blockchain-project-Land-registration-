import { ethers } from 'ethers';
import blockchain from '../assets/blockchain.png';
import { useState, useEffect } from 'react';

const Navigation = () => {
    const [account, setAccount] = useState(null);

    // Function to connect to MetaMask
    const connectHandler = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const account = ethers.utils.getAddress(accounts[0]);
                setAccount(account);
            } catch (error) {
                console.error("Error connecting to MetaMask:", error);
            }
        } else {
            console.error("MetaMask is not installed");
            alert("Please install MetaMask to use this feature.");
        }
    };

    // useEffect to check if an account is already connected when the component mounts
    useEffect(() => {
        const checkAccount = async () => {
            if (window.ethereum) {
                try {
                    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                    if (accounts.length > 0) {
                        const account = ethers.utils.getAddress(accounts[0]);
                        setAccount(account);
                    }
                } catch (error) {
                    console.error("Error fetching accounts:", error);
                }
            }
        };

        checkAccount();

        // Optionally, listen for account changes
        const handleAccountsChanged = (accounts) => {
            if (accounts.length > 0) {
                const account = ethers.utils.getAddress(accounts[0]);
                setAccount(account);
            } else {
                setAccount(null);
            }
        };

        if (window.ethereum) {
            window.ethereum.on('accountsChanged', handleAccountsChanged);
        }

        // Cleanup listener on component unmount
        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            }
        };
    }, []); // Empty dependency array ensures this effect runs only once when the component mounts

    return (
        <nav>
            <ul className='nav__links'>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Rent</a></li>
                <li><a href="#">Sell</a></li>
                <li><a href="#">About Us</a></li>
            </ul>

            <div className='nav__brand'>
                <img src={blockchain} alt="Logo" />
                <h1>Land Registration</h1>
            </div>

            {account ? (
                <button
                    type="button"
                    className='nav__connect'
                >
                    {account.slice(0, 6) + '...' + account.slice(-4)}
                </button>
            ) : (
                <button
                    type="button"
                    className='nav__connect'
                    onClick={connectHandler}
                >
                    Connect
                </button>
            )}
        </nav>
    );
};

export default Navigation;
